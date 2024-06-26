import { Router } from 'express';
import MessageModel from '../models/message.model';
import ChannelModel from '../models/channel.model';
import { Channel, ChannelWithUserName } from '@common/interfaces/channel.interface';
import { authenticate } from '../auth.module';
import { User } from '@common/interfaces/user.interface';
import { Message, MessageWithUserName } from '@common/interfaces/message.interface';
import UserModel from '../models/user.model';
import { sendChannelThruSocket, sendMessageThruSocket, sendRemovedPublicChannelThruSocket } from '../socket';
import { getChannelById } from '../helpers/channel.helper';

const router = Router();

// Create Channel
router.post('/', authenticate, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = req.user as User;

    try {
        const { name, isPublic, description } = req.body;

        // Create a new channel document
        const ch: Channel = {
            name,
            members: [user._id!],
            isPublic,
            description
        };

        // Save the channel to the database
        const channel = await (await ChannelModel.create<Channel>(ch)).populate<ChannelWithUserName>('members', 'name');

        const msg: Message = {
            channelId: channel._id!,
            content: `${user.name} created the channel`,
            sentAt: new Date(),
        }

        // Save the message to the database
        const message: MessageWithUserName = await (await MessageModel.create<Message>(msg)).populate<MessageWithUserName>('sentBy', 'name');

        sendChannelThruSocket(channel)
        sendMessageThruSocket(message)
        res.status(201).json({ message: 'Channel created successfully', channel, messages: [message] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get All Channels for logged user
router.get('/', authenticate, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = req.user as User;

    try {
        const channels = await ChannelModel.find<Channel>({ members: user._id }).populate('members', 'name');

        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Get all public channels
router.get('/public', authenticate, async (req, res) => {
    try {
        const channels = await ChannelModel.find<Channel>({ isPublic: true }).populate<ChannelWithUserName[]>('members', 'name');

        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/join', authenticate, async (req, res) => {
    try {
        const user = req.user as User
        const { channelId } = req.body

        await ChannelModel.updateOne<Channel>({ _id: channelId }, { $push: { members: user._id } })

        const msg: Message = {
            channelId,
            content: `${user.name} joined the channel`,
            sentAt: new Date(),
        }

        // Save the message to the database
        const message: MessageWithUserName = await (await MessageModel.create<Message>(msg)).populate<MessageWithUserName>('sentBy', 'name');

        const channel = await getChannelById(channelId)

        if (!!channel)
            sendChannelThruSocket(channel);

        sendMessageThruSocket(message);
        res.status(200).json({ message: 'Successfully joined the channel', channel });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Add Member to channel
router.post('/add-member', authenticate, async (req, res) => {
    try {
        const { channelId, userEmail } = req.body;

        const user = await UserModel.findOne<User>({ email: userEmail })
        if (!user)
            return res.status(404).json({ message: 'User not found!' });

        await ChannelModel.updateOne({ _id: channelId }, { $push: { members: user._id } });

        const msg: Message = {
            channelId,
            content: `${user.name} joined the channel`,
            sentAt: new Date(),
        }

        // Save the message to the database
        const message: MessageWithUserName = await (await MessageModel.create<Message>(msg)).populate<MessageWithUserName>('sentBy', 'name');

        const channel = await getChannelById(channelId)

        if (!!channel)
            sendChannelThruSocket(channel)

        sendMessageThruSocket(message);
        res.status(200).json({ message: 'User added to channel successfully', channel });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/leave', authenticate, async (req, res) => {
    try {
        const { channelId } = req.body;

        const user = req.user as User;

        await ChannelModel.updateOne({ _id: channelId }, { $pull: { 'members': user._id } })

        const channel = await getChannelById(channelId);
        if (!channel)
            return res.status(404).json({ message: 'Channel not found!' });

        if (channel.members.length === 0) {
            await ChannelModel.deleteOne({ _id: channelId })
            sendRemovedPublicChannelThruSocket(channel)
            return res.status(200).json({ message: 'Left channel successfully' })
        }

        const msg: Message = {
            channelId,
            content: `${user.name} left the channel`,
            sentAt: new Date(),
        }

        // Save the message to the database
        const message: MessageWithUserName = await (await MessageModel.create<Message>(msg)).populate<MessageWithUserName>('sentBy', 'name');

        sendChannelThruSocket(channel);
        sendMessageThruSocket(message);
        res.status(200).json({ message: 'Left channel successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})


export default router;
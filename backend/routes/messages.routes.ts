import { Router } from 'express';
import MessageModel from '../models/message.model';
import { Message, MessageWithUserName } from '@common/interfaces/message.interface';
import { authenticate } from '../auth.module';
import { sendMessageThruSocket } from '../socket';
import ChannelModel from '../models/channel.model'
import { User } from '@common/interfaces/user.interface';
import { Channel } from '@common/interfaces/channel.interface';

const router = Router();

// // Get Messages by Conversation (Channel)
router.get('/:channelId', authenticate, async (req, res) => {
    try {
        const user = req.user as User;
        const channelId = req.params.channelId;

        if (!channelId) {
            return res.status(400).json({ error: 'Missing channelId in parameters' });
        }

        const ch = await ChannelModel.findOne<Channel>({ _id: channelId, members: user._id })
        if (!ch)
            return res.status(401).json({ error: "You don't have access to this channel!" });

        const messages = await MessageModel.find({ channelId }).populate('sentBy', 'name');

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { channelId, sentBy, content, sentAt } = req.body;

        // Create a new message document
        const message: Message = {
            channelId,
            sentBy,
            content,
            sentAt
        }

        // Save the message to the database
        const newMessage = await (await MessageModel.create(message)).populate<MessageWithUserName>('sentBy', 'name');

        sendMessageThruSocket(newMessage);

        res.status(201).json({ message: 'Message created successfully', newMessage });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


// messageController.delete('/deleteByMessageId/:messageId', async (req, res) => {
//     try {
//         const { messageId } = req.params;

//         // Find the message by ID and delete it
//         const message = await defaultMessageModel.findByIdAndDelete(messageId);

//         if (!message) {
//             return res.status(404).json({ error: 'Message not found' });
//         }

//         res.status(200).json({ message: 'Message deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
export default router;
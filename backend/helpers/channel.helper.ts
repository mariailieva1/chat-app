import { ChannelWithUserName } from '@common/interfaces/channel.interface';
import { Channel } from 'diagnostics_channel';
import ChannelModel from '../models/channel.model';

export async function getChannelById(channelId: string): Promise<ChannelWithUserName | null> {
    return await ChannelModel.findOne<Channel>({ _id: channelId }).populate<ChannelWithUserName>('members', 'name')
}
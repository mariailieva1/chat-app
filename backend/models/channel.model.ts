// import { ObjectId } from 'mongodb';
import { Document, Schema, model } from 'mongoose';
import { Channel } from '@common/interfaces/channel.interface';
import { MongoModel, MongoSchema } from './MongoTypeExtensions';

const schemaObj: MongoSchema<Channel> = {
    name: { type: String, required: false },
    members: { type: [Schema.Types.ObjectId], required: true, ref: 'user' },
    description: { type: String, required: false },
    isPublic: { type: Boolean, required: true, default: true }
};

let schema = new Schema(schemaObj)

export type ChannelModel = MongoModel<Channel, Document>;
let defaultChannelModel = model<ChannelModel>('channel', schema);

export default defaultChannelModel;

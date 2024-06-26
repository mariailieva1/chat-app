import { Schema, model } from 'mongoose';
import { Message } from '@common/interfaces/message.interface';
import { MongoModel, MongoSchema } from './MongoTypeExtensions';

const schemaObj: MongoSchema<Message> = {
    channelId: { type: Schema.Types.ObjectId, ref: 'channel', required: true },
    sentBy: { type: Schema.Types.ObjectId, ref: 'user' },
    content: { type: String, required: true },
    sentAt: { type: Date, default: Date.now, required: true },
};

const schema = new Schema(schemaObj)

export type MessageModel = MongoModel<Message, Document>;
let defaultMessageModel = model<MessageModel>('message', schema);

export default defaultMessageModel;

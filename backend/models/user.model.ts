import { Schema, model } from 'mongoose';
import { MongoModel, MongoSchema } from './MongoTypeExtensions';
import { User } from '@common/interfaces/user.interface';

const emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


const schemaObj: MongoSchema<User> = {
	email: {
		type: String,
		required: true,
		match: [emailRegex, 'Invalid email']
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		// match: [passwordRegex, 'Invalid password! It must contain minimum eight characters, at least one letter and one number!']
	},
	// profilePhoto: { type: String, default: '\avatar.jpg' },
	// createdAt: { type: Date, default: Date.now },
	// lastActive: { type: Date, default: Date.now }

};

let schema = new Schema(schemaObj)

export type UserModel = MongoModel<User, Document>;
let defaultUserModel = model<UserModel>('user', schema);

export default defaultUserModel;

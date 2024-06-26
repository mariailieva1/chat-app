import { ChannelWithUserName } from "@common/interfaces/channel.interface";
import { MessageWithUserName } from "@common/interfaces/message.interface";
import { User } from "@common/interfaces/user.interface";
import { Server, Socket } from "socket.io";
import { getChannelById } from "./helpers/channel.helper";


const connectedUsers: { [socketId: string]: User } = {};
let io: Server;

export function startSocket(_io: Server) {
    io = _io;
    io.on("connection", (socket) => {
        socket.on("connected", (user) => {
            connectedUsers[socket.id] = user;
        });

        socket.on("disconnect", () => {
            delete connectedUsers[socket.id]
        });
    });
}

async function getUsersForChannel(ch: ChannelWithUserName): Promise<string[]> {
    return Object.keys(connectedUsers).filter(key => ch.members.some(member => member._id == connectedUsers[key]._id!))
}

export async function sendMessageThruSocket(message: MessageWithUserName) {
    const channel = await getChannelById(message.channelId);
    if (!channel) return;

    const socketIds = await getUsersForChannel(channel)
    socketIds.forEach(socketId => {
        io.to(socketId).emit("new-message", { channel, message })
    })
}

export async function sendChannelThruSocket(channel: ChannelWithUserName) {
    if (channel.isPublic)
        io.emit('public-channel-members', channel);

    const socketIds = await getUsersForChannel(channel)
    socketIds.forEach(socketId => io.to(socketId).emit("channel-members", channel))
}

export function sendRemovedPublicChannelThruSocket(channel: ChannelWithUserName) {
    if (channel.isPublic)
        io.emit('removed-public-channel-members', channel);
}
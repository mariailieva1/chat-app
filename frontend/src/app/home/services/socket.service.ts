import { Injectable } from "@angular/core";
import { io } from 'socket.io-client'
import { DataService } from "./data.service";
import { Message, MessageWithUserName } from "@common/interfaces/message.interface";
import { ChannelWithUserName } from "@common/interfaces/channel.interface";
import { User } from "@common/interfaces/user.interface";
import { filter, take } from "rxjs";

@Injectable()
export class SocketService {
    private socket = io({ path: '/socket' });
    private user?: User;

    constructor(private dataService: DataService) {

    }

    startConnection() {
        this.dataService.user.pipe(filter(u => !!u), take(1)).subscribe(user => {
            this.user = user;
            this.initSocket()
        })
    }

    sendMessage(message: Message) {
        this.socket.emit('chat message', message);
    }

    private async initSocket() {
        this.socket.emit('connected', this.user);
        this.socket.on('connect', () => {
            this.socket.emit('connected', this.user);
        })
        this.socket.on('new-message', (data: { message: MessageWithUserName, channel: ChannelWithUserName }) => {
            this.dataService.addMessages(data.channel._id!, [data.message])
        });
        this.socket.on('channel-members', (channel: ChannelWithUserName) => {
            this.dataService.updateChannel(channel);
        })

        this.socket.on('public-channel-members', (channel: ChannelWithUserName) => {
            this.dataService.updatePublicChannel(channel)
        })
        this.socket.on('removed-public-channel-members', (channel: ChannelWithUserName) => {
            this.dataService.removePublicChannel(channel._id!)
        })
    }
}
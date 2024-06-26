import { Injectable } from "@angular/core";
import { Channel, ChannelWithUserName } from "@common/interfaces/channel.interface";
import { MessageWithUserName } from "@common/interfaces/message.interface";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { ChannelService } from "./channel.service";
import { MessagesService } from "./messages.service";
import { User } from "@common/interfaces/user.interface";
import { AuthService } from "@app/shared/services/auth.service";

@Injectable()
export class DataService {
    private _channels: ChannelWithUserName[] = []
    private _publicChannels: ChannelWithUserName[] = []
    private _messages: { [channelId: string]: MessageWithUserName[] } = {}
    private _user?: User;

    channels: BehaviorSubject<ChannelWithUserName[]> = new BehaviorSubject(this._channels)
    publicChannels: BehaviorSubject<ChannelWithUserName[]> = new BehaviorSubject(this._publicChannels)
    messages: BehaviorSubject<{ [channelId: string]: MessageWithUserName[] }> = new BehaviorSubject(this._messages)
    user: BehaviorSubject<User | undefined> = new BehaviorSubject(this._user)

    constructor(
        private channelService: ChannelService,
        private messagesService: MessagesService,
        private authService: AuthService
    ) { }

    addChannel(channel: ChannelWithUserName) {
        this._channels.push(channel);
        this.channels.next(this._channels);
    }

    updateChannel(channel: ChannelWithUserName) {
        const ch = this._channels.findIndex(c => c._id === channel._id)
        if (ch == -1) {
            this._channels.push(channel);
        } else
            this._channels[ch] = channel;

        this.channels.next(this._channels);
    }

    updatePublicChannel(channel: ChannelWithUserName) {
        const ch = this._publicChannels.findIndex(c => c._id === channel._id)
        if (ch == -1) {
            this._publicChannels.push(channel);
        } else
            this._publicChannels[ch] = channel;

        this.publicChannels.next(this._publicChannels);
    }

    removeChannel(channelId: string) {
        const ch = this._channels.findIndex(ch => ch._id == channelId)
        if (ch == -1) return;

        this._channels.splice(ch, 1);
        this.channels.next(this._channels);
    }
    removePublicChannel(channelId: string) {
        const ch = this._publicChannels.findIndex(ch => ch._id == channelId)
        if (ch == -1) return;

        this._publicChannels.splice(ch, 1);
        this.publicChannels.next(this._publicChannels);
    }

    addMessages(channelId: string, messages: MessageWithUserName[]) {
        if (!this._messages[channelId])
            this._messages[channelId] = messages;
        else this._messages[channelId].push(...messages);

        this.messages.next(this._messages);

    }

    async loadAllChannels() {
        const channels = await lastValueFrom(this.channelService.getAllChannels())

        this._channels = channels;;
        this.channels.next(this._channels);
    }

    async loadPublicChannels() {
        const publicChannels = await lastValueFrom(this.channelService.getPublicChannels())

        this._publicChannels = publicChannels;
        this.publicChannels.next(this._publicChannels)
    }

    async loadMessages(channelId: string) {
        const { messages } = await lastValueFrom(this.messagesService.getMessagesByChannelId(channelId))

        this._messages[channelId] = messages;
        this.messages.next(this._messages);
    }

    async loadUserInfo() {
        const user = await lastValueFrom(this.authService.getUserInfo())

        this._user = user;
        this.user.next(this._user);
    }

    logout() {
        this._user = undefined;
        this.user.next(this._user)
    }
}
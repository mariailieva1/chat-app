import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChannelWithUserName } from "@common/interfaces/channel.interface";
import { MessageWithUserName } from "@common/interfaces/message.interface";

@Injectable()
export class ChannelService {

    constructor(private http: HttpClient) { }

    addChannel(name: string, isPublic: boolean, description: string) {
        return this.http.post<{ message: string, channel: ChannelWithUserName, messages: MessageWithUserName[] }>('/api/channel', { name, isPublic, description })
    }

    getAllChannels() {
        return this.http.get<ChannelWithUserName[]>('/api/channel')
    }

    getPublicChannels() {
        return this.http.get<ChannelWithUserName[]>('/api/channel/public')
    }

    addMember(channelId: string, userEmail: string) {
        return this.http.post<{ message: string, channel: ChannelWithUserName }>('/api/channel/add-member', { channelId, userEmail })
    }

    leaveChannel(channelId: string) {
        return this.http.put('/api/channel/leave', { channelId })
    }

    joinPublicChannel(channelId: string) {
        return this.http.put('/api/channel/join', { channelId })
    }
}
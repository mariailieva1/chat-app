import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message, MessageWithUserName } from "@common/interfaces/message.interface";

@Injectable()
export class MessagesService {

    constructor(private http: HttpClient) {
    }

    getMessagesByChannelId(channelId: string) {
        return this.http.get<{ messages: MessageWithUserName[] }>(`/api/messages/${channelId}`);
    }

    sendMessage(message: Message) {
        return this.http.post<{ message: MessageWithUserName }>(`/api/messages`, message);
    }

}
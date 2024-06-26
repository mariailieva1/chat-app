export interface Message {
    _id?: string,
    channelId: string,
    sentBy?: string,
    content: string,
    sentAt: Date,
}

export interface MessageWithUserName {
    _id?: string,
    channelId: string,
    sentBy?: { _id: string, name: string },
    content: string,
    sentAt: Date,
}
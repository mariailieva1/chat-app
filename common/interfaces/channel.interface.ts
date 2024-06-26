export interface Channel {
    _id?: string,
    name: string,
    members: string[]
    isPublic: boolean;
    description: string;
}

export interface ChannelWithUserName {
    _id?: string,
    name: string,
    members: { _id: string, name: string }[]
    isPublic: boolean;
    description: string;
}
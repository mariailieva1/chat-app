import { Component, OnInit } from '@angular/core';
import { ChannelService } from '@app/home/services/channel.service';
import { DataService } from '@app/home/services/data.service';
import { ChannelWithUserName } from '@common/interfaces/channel.interface';
import { User } from '@common/interfaces/user.interface';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-public-channels',
  templateUrl: './public-channels.page.html',
  styleUrl: './public-channels.page.scss'
})
export class PublicChannelsPage implements OnInit {

  publicChannels: ChannelWithUserName[] = [];
  user?: User;

  constructor(private channelService: ChannelService, private dataService: DataService) {

  }

  ngOnInit(): void {
    this.dataService.publicChannels.subscribe(publicChannels => this.publicChannels = publicChannels);
    this.dataService.user.subscribe(user => this.user = user);
    this.dataService.loadPublicChannels()
  }

  getShortName(fullName: string) {
    return fullName.split(' ').map(n => n[0]).join('');
  }

  isJoined(channel: ChannelWithUserName) {
    return channel.members.some(m => m._id === this.user?._id)
  }

  async joinChannel(channel: ChannelWithUserName) {
    await lastValueFrom(this.channelService.joinPublicChannel(channel._id!))
  }

  async leaveChannel(channel: ChannelWithUserName) {
    await lastValueFrom(this.channelService.leaveChannel(channel._id!))
    this.dataService.removeChannel(channel._id!)
  }

  getFirstMembers(members: { _id: string, name: string }[]) {
    return members.slice(0, 3)
  }

  getLastMembers(members: { _id: string, name: string }[]) {
    return members.slice(3).map(m => m.name).join(',')
  }

}

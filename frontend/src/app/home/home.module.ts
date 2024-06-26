import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './pages/home/home.page';
import { SharedModule } from '../shared/shared.module';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { CreateChannelDialogComponent } from './components/create-channel-dialog/create-channel-dialog.component';
import { ChannelService } from './services/channel.service';
import { DataService } from './services/data.service';
import { ChannelPage } from './pages/channel/channel.page';
import { MessagesService } from './services/messages.service';
import { TimeAgoPipe } from '@app/shared/pipes/time-ago.pipe';
import { SocketService } from './services/socket.service';
import { AddMemberDialogComponent } from './components/add-member-dialog/add-member-dialog.component';
import { PublicChannelsPage } from './pages/public-channels/public-channels.page';

const PAGES = [HomePage, ChannelPage, PublicChannelsPage];

const COMPONENTS = [
  ChannelListComponent,
  CreateChannelDialogComponent,
  AddMemberDialogComponent,
];

const PIPES = [TimeAgoPipe];

const SERVICES = [ChannelService, DataService, MessagesService, SocketService];

@NgModule({
  declarations: [...PAGES, ...COMPONENTS, ...PIPES],
  imports: [SharedModule, HomeRoutingModule],
  providers: [...SERVICES, ...PIPES],
})
export class HomeModule {}

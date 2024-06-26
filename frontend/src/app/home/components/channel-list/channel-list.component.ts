import { Component, OnInit } from '@angular/core';
import { User } from '@common/interfaces/user.interface';
import { ChannelWithUserName } from '@common/interfaces/channel.interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { lastValueFrom } from 'rxjs';
import { ChannelService } from '@app/home/services/channel.service';
import { DataService } from '@app/home/services/data.service';
import { AuthService } from '@app/shared/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent implements OnInit {

  user?: User;

  channels: ChannelWithUserName[] = []
  filteredChannels: ChannelWithUserName[] = []
  isHomeActive: boolean = true;
  searchValue: string = ''

  constructor(
    private dialog: MatDialog,
    private channelService: ChannelService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.checkIsHomeActive()
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) this.checkIsHomeActive()
    });

    this.dataService.channels.subscribe(channels => {
      this.channels = channels;
      this.filterChannels()
    });

    this.dataService.user.subscribe(user => this.user = user);

    this.dataService.loadAllChannels();
  }

  async addChannel() {
    const dialogRef = this.dialog.open(CreateChannelDialogComponent)
    const result = await lastValueFrom(dialogRef.afterClosed())

    if (!result) return;
    const { name, isPublic, description } = result;
    await lastValueFrom(this.channelService.addChannel(name, isPublic, description))
  }

  logout() {
    this.authService.logout()
    this.dataService.logout()
  }

  checkIsHomeActive() {
    this.isHomeActive = this.router.url == '/'
  }

  filterChannels() {
    this.filteredChannels = this.channels.filter(ch => ch.name.toUpperCase().includes(this.searchValue.toUpperCase()))
  }

}

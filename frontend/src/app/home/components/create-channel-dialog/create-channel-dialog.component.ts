import { Component } from '@angular/core';

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrl: './create-channel-dialog.component.scss'
})
export class CreateChannelDialogComponent {
  channelName: string = '';
  channelDescription: string = '';
  isPublic: boolean = true;
}

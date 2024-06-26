import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMemberDialogComponent } from '@app/home/components/add-member-dialog/add-member-dialog.component';
import { ChannelService } from '@app/home/services/channel.service';
import { DataService } from '@app/home/services/data.service';
import { MessagesService } from '@app/home/services/messages.service';
import { SocketService } from '@app/home/services/socket.service';
import { ChannelWithUserName } from '@common/interfaces/channel.interface';
import {
  Message,
  MessageWithUserName,
} from '@common/interfaces/message.interface';
import { User } from '@common/interfaces/user.interface';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.page.html',
  styleUrl: './channel.page.scss',
})
export class ChannelPage implements OnInit, AfterViewChecked {
  channelId?: string;
  channel?: ChannelWithUserName;
  messages: MessageWithUserName[] = [];
  filteredMessages: MessageWithUserName[] = [];
  newMessage: string = '';
  user?: User;
  searchValue: string = '';
  shouldScroll: boolean = true;

  @ViewChild('messagesContainer', { static: true })
  messagesElement?: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private messagesService: MessagesService,
    private channelService: ChannelService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.channelId = params['channelId'];

      this.subscribeToData();
    });
  }

  ngAfterViewChecked(): void {
    if (!this.messagesElement || !this.shouldScroll) return;

    this.messagesElement.nativeElement.scrollTop =
      this.messagesElement.nativeElement.scrollHeight;
    this.shouldScroll = false;
  }

  subscribeToData() {
    if (!this.channelId) return;

    this.dataService.channels.subscribe((channels) => {
      this.channel = channels.find((channel) => channel._id === this.channelId);
    });

    this.dataService.messages.subscribe((messages) => {
      this.messages = messages[this.channelId!] || [];
      this.shouldScroll = true;
      this.filterMessages();
    });

    this.dataService.user.subscribe((user) => (this.user = user));

    this.dataService.loadMessages(this.channelId);
  }

  sendMessageIfEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (event.shiftKey) {
        event.preventDefault(); // Предотвратяване на изпращане на формата
        const textarea = event.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value =
          textarea.value.substring(0, start) +
          '\n' +
          textarea.value.substring(end);

        textarea.selectionStart = textarea.selectionEnd = start + 1;
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }

  async sendMessage() {
    const newMessage: Message = {
      content: this.newMessage,
      channelId: this.channelId!,
      sentBy: this.user?._id,
      sentAt: new Date(),
    };

    await lastValueFrom(this.messagesService.sendMessage(newMessage));
    this.newMessage = '';
    this.searchValue = '';
  }

  async leaveChannel() {
    if (!this.channelId) return;

    await lastValueFrom(this.channelService.leaveChannel(this.channelId));
    this.dataService.removeChannel(this.channelId);
    this.router.navigate(['/']);
  }

  async addMember() {
    const userEmail = await lastValueFrom(
      this.dialog.open(AddMemberDialogComponent).afterClosed()
    );

    if (!userEmail) return;

    await lastValueFrom(
      this.channelService.addMember(this.channelId!, userEmail)
    );
  }

  filterMessages() {
    if (this.searchValue == '') {
      this.filteredMessages = this.messages;
      this.shouldScroll = true;
    }
    this.filteredMessages = this.messages.filter((message) => {
      return (
        message.content
          .toUpperCase()
          .includes(this.searchValue.toUpperCase()) ||
        message.sentBy?.name
          .toUpperCase()
          .includes(this.searchValue.toUpperCase())
      );
    });
  }
}

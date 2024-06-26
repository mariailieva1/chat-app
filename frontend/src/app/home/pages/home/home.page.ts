import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/home/services/data.service';
import { SocketService } from '@app/home/services/socket.service';


@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage implements OnInit {
  constructor(private socketService: SocketService, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.loadUserInfo();
    this.socketService.startConnection();
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent {
  userEmail: string = '';
}

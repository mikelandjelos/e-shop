import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:{title:string,text:string},private dialogRef: MatDialogRef<NotificationComponent>) {
    
  }
  close(){
    this.dialogRef.close();
  }
}

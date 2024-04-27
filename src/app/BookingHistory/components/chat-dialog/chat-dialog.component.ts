import { Component, Inject, ViewChild } from '@angular/core';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { Chat } from 'src/app/models/chat.model';
import { NgForm } from '@angular/forms';
import { HistoryCardsComponent } from '../history-cards/history-cards.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
})

export class ChatDialogComponent {

  chatData!: Chat;
  messages!: any[];
  historyDialog!: HistoryCardsComponent;
  elementData!: any[];
  history!: any[];

  @ViewChild('chatForm',{static: false}) chatForm!: NgForm;

  userId: string = '';
  userType: string = '';

  constructor(private companyDataService: CargaSinEstresDataService, private router: Router, private route: ActivatedRoute
              , @Inject(MAT_DIALOG_DATA) public data: any){
    this.chatData = {} as any;
    this.messages = [];
    this.elementData = [];
    this.history = [];

  }

  ngOnInit(): void {
    this.messages = this.data.element.chats;
    this.userType = this.data.userType;
    this.userId = this.data.userId;
  }

  //add
  sendMessage(){
    this.chatData.user = this.userType;

    this.chatData.dateTime = new Date().toLocaleDateString();
    
    const newMensaje = {
      message : this.chatData.message
    }
    this.companyDataService.updateBookingHistoryMessage(this.data.element.id, this.userType,newMensaje).subscribe((response: any) => {

      //se actualiza el arreglo de mensajes
      this.messages.push(response);
    }, (error: any) => {
    }
    );
    this.chatForm.reset();
  }

}

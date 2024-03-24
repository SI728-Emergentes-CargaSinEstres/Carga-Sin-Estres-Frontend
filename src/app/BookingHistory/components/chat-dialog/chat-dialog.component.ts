import { Component, Inject, ViewChild } from '@angular/core';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { Chat } from 'src/app/models/chat.model';
import { NgForm } from '@angular/forms';
import { ActiveReservationsComponent } from '../active-reservations/active-reservations.component';
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
  historyDialog!: ActiveReservationsComponent;
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
    console.log('this.messages inicializado:', this.messages); // Agregar este console.log para verificar la inicialización de this.messages

  }

  ngOnInit(): void {

    this.userType = this.data.userType;
    this.userId = this.data.userId;

    // Llamar al servicio para obtener los mensajes
    this.companyDataService.getMessagesByReservation(this.data.element.id).subscribe(
        (response) => {
          // Mapear la respuesta para obtener solo el contenido y la fecha del mensaje
          this.messages = response.map((message: any) => ({
            content: message.content,
            messageDate: message.messageDate
          }));
          console.log('Mensajes obtenidos:', this.messages);
        },
        (error) => {
          console.error('Error al obtener mensajes:', error);
        }
    );

  }

  //add
  sendMessage(){

    this.companyDataService.updateReservationMessage(this.data.element.id, this.userType,this.chatData.message).subscribe((response: any) => {

      console.log("el response es: " + JSON.stringify(response));
      console.log('this.messages antes de push:', this.messages); // Agregar este console.log para verificar el estado de this.messages antes de push

      this.messages.push(response); //este push no funiona porque "messages" aui es indefinido

    }, (error: any) => {
    }
    );
    this.chatForm.reset();
  }

}

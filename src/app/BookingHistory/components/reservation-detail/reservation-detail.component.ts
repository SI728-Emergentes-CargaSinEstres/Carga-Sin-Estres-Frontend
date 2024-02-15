import {Component, Input} from '@angular/core';
import {BookingHistory} from "../../../models/booking-history.model";
import { MatDialog } from '@angular/material/dialog';
import { EditPaymentDialogComponent } from '../edit-payment-dialog/edit-payment-dialog.component';
import {ChatDialogComponent} from "../chat-dialog/chat-dialog.component";

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent {
  @Input() reservation!: BookingHistory;
  constructor(private dialog: MatDialog) { }
  openEditPaymentDialog() {
    this.dialog.open(EditPaymentDialogComponent, {
      width: '400px',
      data: { element: this.reservation },
    });
  }

  openChatDialog(element: any) {
    this.dialog.open(ChatDialogComponent, {
      width: '600px',
      data:{
        userId:this.reservation.id,
        userType: this.reservation,
        element
      }
    });
  }

}

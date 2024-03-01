import { Component, Input } from '@angular/core';
import { BookingHistory } from 'src/app/models/booking-history.model';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatDialogComponent } from "../chat-dialog/chat-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.scss']
})
export class ReservationItemComponent {
  @Input() reservation!: BookingHistory;
  @Input() userType!: string;

  showDetails: boolean = false;

  constructor(private companyDataService: CargaSinEstresDataService, private _snackBar: MatSnackBar, private dialog: MatDialog) { }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  cancelReservation(company: any) {
    const cancelStatus = 'Finalizado';
    this.companyDataService.updateBookingHistoryStatus(company.id, cancelStatus).subscribe((response: any) => {
      this._snackBar.open('Se canceló la reserva con éxito', 'Cancelado', {
        duration: 2000, // Duración en milisegundos
      });
    });
  }

  openChatDialog(element: any) {
    this.dialog.open(ChatDialogComponent, {
      width: '600px',
      data: {
        userId: this.reservation.id,
        userType: this.userType,
        element
      }
    });
  }
}
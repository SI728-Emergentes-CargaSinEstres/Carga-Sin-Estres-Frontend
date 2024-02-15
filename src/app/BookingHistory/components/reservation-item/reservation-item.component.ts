import { Component, Input } from '@angular/core';
import { BookingHistory } from 'src/app/models/booking-history.model';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.scss']
})
export class ReservationItemComponent {
  @Input() reservation!: BookingHistory;
  showDetails: boolean = false;

  constructor(private companyDataService: CargaSinEstresDataService, private _snackBar: MatSnackBar) { }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  cancelReservation(company: any) {
    const cancelStatus = 'Finalizado';
    this.companyDataService.updateBookingHistoryStatus(company.id, cancelStatus).subscribe((response: any) => {
      // Aquí puedes manejar la respuesta si es necesario
      this._snackBar.open('Se canceló la reserva con éxito', 'Cancelado', {
        duration: 2000, // Duración en milisegundos
      });
    });
  }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Reservation} from 'src/app/models/reservation.model';
import {CargaSinEstresDataService} from 'src/app/services/carga-sin-estres-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ChatDialogComponent} from "../chat-dialog/chat-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-reservation-item',
    templateUrl: './reservation-item.component.html',
    styleUrls: ['./reservation-item.component.scss']
})
export class ReservationItemComponent {
    @Input() reservation!: Reservation;
    @Input() userType!: string;

    showDetails: boolean = false;

    constructor(private companyDataService: CargaSinEstresDataService, private _snackBar: MatSnackBar, private dialog: MatDialog) {
    }

    toggleDetails() {
        this.showDetails = !this.showDetails;
    }

    @Output() reservationUpdated: EventEmitter<void> = new EventEmitter<void>();
    setReservationStatus(company: any, status: any) {
        this.companyDataService.updateReservationStatus(company.id, status, {}).subscribe((response: any) => {
            if (status === 'scheduled') {
                this._snackBar.open('Se confirmó la reserva con éxito', 'Cerrar', {
                    duration: 2000,
                });
            }
            else if (status == 'rescheduled') {
                this._snackBar.open('Se reprogramó la reserva con éxito', 'Cerrar', {
                    duration: 2000,
                });
            }
            else if (status == 'finalized') {
                this._snackBar.open('Se finalizó la reserva con éxito', 'Cerrar', {
                    duration: 2000,
                });
            }
            else if (status == 'cancelled') {
                this._snackBar.open('Se canceló la reserva con éxito', 'Cerrar', {
                    duration: 2000,
                });
            }
            this.reservationUpdated.emit();
        });
    }

    //set end date and end time
    setReservationEndDateTime(reservation: any) {
        const endDate = new Date();
        const endTime = endDate.getHours() + ':' + endDate.getMinutes();
        const endDateString = endDate.toISOString().split('T')[0];
        const endTimeString = endTime;
        this.companyDataService.updateReservationStatus(reservation.id,  endDateString, endTimeString).subscribe((response: any) => {
            this._snackBar.open('Se finalizó la reserva con éxito', 'Cerrar', {
                duration: 2000,
            });
            this.reservationUpdated.emit();
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

    isReservationFinalized(startDate: string, startTime: string): boolean {
        const startDateTime = new Date(startDate + ' ' + startTime);
        const currentDateTime = new Date();
        return startDateTime < currentDateTime;
    }    
}
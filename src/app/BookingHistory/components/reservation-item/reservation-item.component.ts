import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Reservation} from 'src/app/models/reservation.model';
import {CargaSinEstresDataService} from 'src/app/services/carga-sin-estres-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ChatDialogComponent} from "../chat-dialog/chat-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {EditPaymentDialogComponent} from "../edit-payment-dialog/edit-payment-dialog.component";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import { ReportCompanyDialogComponent } from '../report-company-dialog/report-company-dialog.component';
import { ReportClientDialogComponent } from '../report-client-dialog/report-client-dialog.component';

@Component({
    selector: 'app-reservation-item',
    templateUrl: './reservation-item.component.html',
    styleUrls: ['./reservation-item.component.scss']
})
export class ReservationItemComponent {
    @Input() reservation!: Reservation;
    @Input() userType!: string;

    locationOrigin:string[] = [];
    locationDestination:string[] = [];

    showDetails: boolean = false;

    constructor(private companyDataService: CargaSinEstresDataService, private _snackBar: MatSnackBar, private dialog: MatDialog) {
    }

    ngOnInit() {
        // Llamar a una función que se ejecuta periódicamente, por ejemplo, cada segundo
        this.checkReservationsInProgress();

        this.loadLocationOrigin();
        this.loadLocationDestination();
        this.getFormattedLocationOrigin();
        this.getFormattedLocationDestination();
    }

    toggleDetails() {
        this.showDetails = !this.showDetails;
    }

    @Output() reservationUpdated: EventEmitter<void> = new EventEmitter<void>();
    setReservationStatus(reservation: any, status: any) {
        this.companyDataService.updateReservationStatus(reservation.id, status, {}).subscribe((response: any) => {
            const contractData = { reservationId: reservation.id };

            if (status === 'scheduled') {
                this.createContractForReservation(contractData);
            }

            else if (status == 're-scheduled') {
                this.createContractForReservation(contractData);
            }

            else if (status == 'in progress') {
                this._snackBar.open('La reserva se va llevar a cabo', 'Cerrar', {
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

            setTimeout(() => {
                this.reservationUpdated.emit();
                window.location.reload();
            }, 2000);
        });
    }

    private createContractForReservation(contractRequest : any): void { //----------------------------------------------------------------------------------------------------
        console.log('Objeto a enviarse para contrato:', contractRequest );
    
        this.companyDataService.createContract(contractRequest).subscribe(
            () => {
                this._snackBar.open('Contrato generado', 'Cerrar', { duration: 2000 });
            },
            (error) => {
                console.error('Error al crear el contrato:', error);
                this._snackBar.open('Error al crear el contrato', 'Cerrar', { duration: 2000 });
            }
        );
    }

    //set end date and end times
    setReservationEndDateTime(reservation: any) {

        const endDate = new Date();
        
        const endTime = endDate.getHours().toString().padStart(2, '0') + ':' + endDate.getMinutes().toString().padStart(2, '0');
        const endDateSent= endDate.toISOString().split('T')[0];

        this.companyDataService.updateReservationEndDateAndEndTime(reservation.id, endDateSent , endTime).subscribe((response: any) => {
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

    openReviewDialog(element: any) {
        this.dialog.open(ReviewDialogComponent, {
            width: '600px',
            data: {
                element
            }
        });
    }

    openReportClientDialog() {
        const dialogRef = this.dialog.open(ReportClientDialogComponent, {
          width: '600px',
          data: {
            element: this.reservation
          }
        });
      }
    

    reservationMarkedInProgress: boolean = false;

    checkReservationsInProgress() {
        // Verificar si la reserva aún no está marcada como 'in progress'
        if (!this.reservationMarkedInProgress && this.reservation.status === 'scheduled' && this.isReservationInProgress(this.reservation.startDate, this.reservation.startTime)) {
            // Cambiar el estado de la reserva a 'in progress' y marcarla como ya procesada
            this.setReservationStatus(this.reservation, 'in progress');
            this.reservationMarkedInProgress = true;
        }
    }

    isReservationInProgress(startDate: string, startTime: string): boolean {
        const startDateTime = new Date(startDate + ' ' + startTime);
        const currentDateTime = new Date();
        return startDateTime <= currentDateTime; 
    }

    openEditPaymentDialog() {
        const dialogRef = this.dialog.open(EditPaymentDialogComponent, {
            width: '600px',
            data: {
                element: this.reservation
            }
        });
        dialogRef.afterClosed().subscribe(element =>{
            if (element){
                this.reservation = element;
                console.log('Nuevo precio:', this.reservation.price);
            }else{
                console.log('Edición cancelada');
            }
        })

    }

    openReportCompanyDialog(){
        const dialogRef = this.dialog.open(ReportCompanyDialogComponent, {
            width: '600px',
            data: {
                element: this.reservation
            }
        });
    }

    loadLocationOrigin() {
        if (this.reservation.ubigeoOrigin) {
            this.companyDataService.getLocation(this.reservation.ubigeoOrigin).subscribe((location: string[]) => {
                this.locationOrigin = location;
            }, (error) => {
                console.error('Error al obtener la ubicación de origen:', error);
            });
        }
    }

    loadLocationDestination() {
        if (this.reservation.ubigeoDestination) {
            this.companyDataService.getLocation(this.reservation.ubigeoDestination).subscribe((location: string[]) => {
                this.locationDestination = location;
            }, (error) => {
                console.error('Error al obtener la ubicación de destino:', error);
            });
        }
    }

    // Método para unir los elementos del arreglo en un string separado por guiones
    getFormattedLocationOrigin(): string {
        return this.locationOrigin.join(' - ');
    }

    getFormattedLocationDestination(): string {
        return this.locationDestination.join(' - ');
    }


}
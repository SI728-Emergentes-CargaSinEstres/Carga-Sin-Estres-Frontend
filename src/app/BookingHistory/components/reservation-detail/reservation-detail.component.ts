import {Component, Input, OnInit} from '@angular/core';
import {Reservation} from "../../../models/reservation.model";
import { MatDialog } from '@angular/material/dialog';
import { EditPaymentDialogComponent } from '../edit-payment-dialog/edit-payment-dialog.component';
import {ChatDialogComponent} from "../chat-dialog/chat-dialog.component";
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {
  @Input() reservation!: Reservation;
  @Input() userType!: string;
  contract: any;

  constructor(
    private dialog: MatDialog,
    private service: CargaSinEstresDataService
  ) { }

  ngOnInit(): void {
    this.loadContractData();
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

  loadContractData(): void {
    if (this.reservation?.id) {
      this.service.getContractByReservationId(this.reservation.id).subscribe({
        next: (contract) => {
          this.contract = contract;
          console.log('Contrato:', this.contract);
        },
        error: (err) => {
          this.contract = null;
          console.error(err);
        }
      });
    }
  }

}
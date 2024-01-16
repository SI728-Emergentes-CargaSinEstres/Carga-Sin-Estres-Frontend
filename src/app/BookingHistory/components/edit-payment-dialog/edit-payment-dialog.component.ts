import { Component, Inject, ViewChild } from '@angular/core';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { NgForm } from '@angular/forms';
import { HistoryCardsComponent } from '../history-cards/history-cards.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-payment-dialog',
  templateUrl: './edit-payment-dialog.component.html',
  styleUrls: ['./edit-payment-dialog.component.scss']
})
export class EditPaymentDialogComponent {

  payment: any;

  paymentForm!: NgForm;

  @ViewChild('paymentForm', {static: false}) currentForm!: NgForm;

  constructor(private cargaSinEstresDataService: CargaSinEstresDataService, private historyCardsComponent: HistoryCardsComponent, 
    private route: ActivatedRoute, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {
    this.payment = 0;
  }

  ngOnInit(): void {
    this.payment = this.data.element.payment;
  }

  updatePayment() {
    this.cargaSinEstresDataService.updateBookingHistoryPayment(this.data.id, this.payment).subscribe((response: any) => {
      this.data.element.map((o: any)=> {
        if (o.id === response.id) {
          o = response;
        }
        return o;
      })
      this._snackBar.open('Se cambió el pago de la reserva con éxito', 'Pago cambiado', {
        duration: 2000, // Duración en milisegundos
      });
    });

  }




}

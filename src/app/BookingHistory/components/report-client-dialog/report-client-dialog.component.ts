import { Component, Inject } from '@angular/core';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report-client-dialog',
  templateUrl: './report-client-dialog.component.html',
  styleUrls: ['./report-client-dialog.component.scss']
})
export class ReportClientDialogComponent {
  reportClientForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private businessRulesService: CargaSinEstresDataService, 
    private router: Router,
    private dialogRef: MatDialogRef<ReportClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _snackBar: MatSnackBar
  ) {
    this.reportClientForm = this.fb.group({
      reason: [null, Validators.required]
    });
  }

  reportClient() {
    if (this.reportClientForm.invalid) {
      this._snackBar.open('Por favor, ingrese una razón válida', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    const reason: string = this.reportClientForm.value.reason;
    const reportData = {
      customerId: this.data.element.customer.id,
      reason
    };

    console.log('Datos del reporte:', JSON.stringify(reportData));

    this.businessRulesService.createadditionalWaitingTime(reportData).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);

        this._snackBar.open(`Se reportó al cliente`, 'Cerrar', {
          duration: 2000,
        });

        this.setReservationStatus(this.data.element, 'cancelled');
        this.dialogRef.close();
        
        window.history.back();
      },
      (error) => {
        console.error('Error al enviar el reporte:', error);
        this._snackBar.open('Hubo un error al enviar el reporte', 'Cerrar', {
          duration: 2000,
        });
      }
    );
  }

  setReservationStatus(reservation: any, status: string) {
    if (status === 'cancelled') {
      this.businessRulesService.updateReservationStatus(reservation.id, status, {}).subscribe(() => {
        this._snackBar.open('Se canceló la reserva con éxito', 'Cerrar', {
          duration: 2000,
        });
      });
    }
  }
}

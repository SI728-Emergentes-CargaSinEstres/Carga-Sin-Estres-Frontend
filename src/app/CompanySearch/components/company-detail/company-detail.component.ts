import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CargaSinEstresDataService} from "../../../services/carga-sin-estres-data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
    selector: 'app-company-detail',
    templateUrl: './company-detail.component.html',
    styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent {
    selectedServices: { [key: string]: boolean } = {};

    departamentosOrigin:string[] = [];
    departamentosDestination:string[] = [];
    provincesOrigin:string[] = [];
    provincesDestination:string[] = [];
    districtsOrigin:any[] = [];
    districtsDestination:any[] = [];

    selectedRegionDestination: string | null = null;
    selectedProvinceDestination: string | null = null;

    selectedRegionOrigin: string | null = null;
    selectedProvinceOrigin: string | null = null;

    reservation: any = {
        ubigeoOrigin: undefined,
        originAddress: undefined,
        ubigeoDestination: undefined,
        destinationAddress: undefined,
        startDate: undefined,
        startTime: undefined,
        services: []
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private api: CargaSinEstresDataService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<CompanyDetailComponent>
    ) {
      this.getDepartamentos();
    }

    getDepartamentos(){
      this.api.getDepartamentos().subscribe((res: any[]) => {
      this.departamentosOrigin = res;
      this.departamentosDestination = res
     } )
  }

  //Para origen
  onRegionChangeOrigin(event: any): void {
    this.selectedRegionOrigin = (event as HTMLSelectElement).value;
    this.provincesOrigin = []; 
    this.districtsOrigin = [];
    
    this.api.getProvincias(this.selectedRegionOrigin).subscribe((data) => {
      this.provincesOrigin = data;
    });
  }

  onProvinceChangeOrigin(event: any): void {
    this.selectedProvinceOrigin = (event as HTMLSelectElement).value;
    this.districtsOrigin = [];

    this.api.getDistritos(this.selectedProvinceOrigin).subscribe((data) => {
      this.districtsOrigin = data;
    });
  }

  //Para destino:
  onRegionChangeDestination(event: any): void {
    this.selectedRegionDestination = (event as HTMLSelectElement).value;
    this.provincesDestination = []; 
    this.districtsDestination = [];
    
    this.api.getProvincias(this.selectedRegionDestination).subscribe((data) => {
      this.provincesDestination = data;
    });
  }

  onProvinceChangeDestination(event: any): void {
    this.selectedProvinceDestination = (event as HTMLSelectElement).value;
    this.districtsDestination = [];

    this.api.getDistritos(this.selectedProvinceDestination).subscribe((data) => {
      this.districtsDestination = data;
    });
  }

    getStars(rating: number): number[] {
        if (!rating) {
            return Array(0).fill(0);
        } else {
            rating = Math.round(rating);
            return Array(rating).fill(0);
        }
    }

    getEmptyStars(rating: number): number[] {
        if (!rating) {
            return Array(5).fill(0);
        } else {
            const filledStars = this.getStars(rating).length;
            const emptyStars = 5 - filledStars;
            return Array(emptyStars).fill(0);
        }
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Cerrar', {
            panelClass: ['color-snackbar-created'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }

    getReservationByCompanyId(){
        this.api.getReservationByCompanyId(this.data.companyId).subscribe(
            (res:any) =>{

            }
        )
    }

    addReservation() {
        console.log(this.reservation);
        this.reservation = {
            ubigeoOrigin: this.reservation.ubigeoOrigin,
            originAddress: this.reservation.originAddress,
            ubigeoDestination:this.reservation.ubigeoDestination,
            destinationAddress: this.reservation.destinationAddress,
            startDate: this.reservation.startDate.toISOString(),
            startTime: this.reservation.startTime,
            services: Object.keys(this.selectedServices).filter(key => this.selectedServices[key]).join(', ')
        };

        this.api.createReservation(this.data.customerId, this.data.company.id, this.reservation).subscribe(
            (res: any) => {
                this.openSnackBar('Reserva agregada exitosamente');
            },
            (error: any) => {
                if (error.status == 400) {
                    this.openSnackBar(error.error.message);
                } else {
                    this.openSnackBar('Error al desconocido del servidor'); //error generico
                }
            }
        );
        this.dialogRef.close();
    }

    onSubmit() {
        this.addReservation();
    }

    cancel() {
        this.dialogRef.close();
    }

    openCalendar() {
        this.api.getReservationByCompanyId(this.data.company.id).subscribe(
            (response:any) =>{

                this.api.getTimeblock(this.data.company.id).subscribe(
                    (res:any) =>{

                        const dialogRef = this.dialog.open(CalendarComponent,{
                            panelClass: ['w-1/2'],
                            data: {
                                events: response,
                                timeblock: res,
                            }
                        });
                
                        dialogRef.afterClosed().subscribe(result => {
                            if (result) {
                              this.handleSaveEvent(result);
                            } 
                          });
                    }
                );

               
            }
        );
        
    }

    handleSaveEvent(event: any): void {
        console.log('Evento guardado:', event);
       this.reservation.startDate = event.date;
        this.reservation.startTime = `${event.startHour.toString().padStart(2, '0')}:00`;
        console.log(this.reservation.startTime);
      }
    
}


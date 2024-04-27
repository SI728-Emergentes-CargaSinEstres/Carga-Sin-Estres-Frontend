import { Component, OnInit, ViewChild } from '@angular/core';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
    @ViewChild('reservationForm', {static: false})
    reservationForm!: NgForm;

    company: any = '';
    client: any = '';

    companyId: any = '';
    clientId: any = '';

    reviews: any = [];
    averageRating: any = null;
    reviewFilter: string = 'all';
    stars: number[] = Array(5).fill(0);

    numeroTarjeta: string = '';
    CVV: string = '';
    fechaVencimiento: string = '';

    reservation: any = {
      pickupAddress: undefined,
      destinationAddress: undefined,
      movingDate: undefined,
      movingTime: undefined,
      services: undefined,
    };

    userId: string = '';
    constructor(private api: CargaSinEstresDataService, private activatedRoute: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { 
      this.activatedRoute.params.subscribe(
        params => {
          this.companyId = params['id'];
          this.getCompany(params['id']);
        }
      );

        // Obtiene el id del usuario
      this.activatedRoute.pathFromRoot[1].url.subscribe(
        url => {
          this.userId = url[1].path;
          this.clientId = parseInt(this.userId);
        }
      ); 
    }
  
    ngOnInit(): void {
      this.fetchReviews();
    }

    openSnackBar(message: string) {
      this.snackBar.open(message, 'Cerrar', {
        panelClass: ['color-snackbar-created'],
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  
    getCompany(id: any) {
      this.api.getCompanyById(id).subscribe(
        (res: any) => 
        {
          this.company = res;
        }
      );
    }

    getClient(id: any){
      this.api.getClientById(id).subscribe(
        (res: any) => 
        {
          this.client = res;
        }
      );
    }


    addReservation() {
      this.api.createReservation(this.clientId, this.companyId,this.reservation).subscribe(
        (res: any) => 
        {
          this.openSnackBar('Reserva agregada exitosamente');
        }
      );
    }

    onSubmit() {
      this.addReservation();

      this.router.navigateByUrl(`client/${this.userId}/history-cards`);
    }

    fetchReviews() {
      this.api.getReviewsByCompanyId(this.companyId).subscribe((res: any) => 
        {
          
          this.reviews = res;
          this.averageRating = this.reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / this.reviews.length;
          this.averageRating = Math.round(this.averageRating);
        }
      );
    }

    getStars(rating: number): number[] {
      if(!rating ){
        return Array(0).fill(0);
      }
      else{
      rating = Math.round(rating);
      return Array(rating).fill(0);
      }
    }

    ReturnToCompanyTable(){
      this.router.navigateByUrl(`client/${this.userId}/company-table`);
    }
}


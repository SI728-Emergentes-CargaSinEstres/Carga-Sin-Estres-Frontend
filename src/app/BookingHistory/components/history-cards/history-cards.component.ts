import {Component, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BookingHistory} from 'src/app/models/booking-history.model';
import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {ChatDialogComponent} from '../chat-dialog/chat-dialog.component';
import {ReviewDialogComponent} from '../review-dialog/review-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {CargaSinEstresDataService} from 'src/app/services/carga-sin-estres-data.service';
import {Form, NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-history-cards',
    templateUrl: './history-cards.component.html',
    styleUrls: ['./history-cards.component.scss']
})
export class HistoryCardsComponent implements OnInit {

    userType: any;
    companyId: any;
    newReservations: any[];
    pendingReservations: any[];
    serviceFilter: string = '';

    constructor(private companyDataService: CargaSinEstresDataService, private router: Router, private dialog: MatDialog,
                private route: ActivatedRoute, private fb: FormBuilder) {
        this.newReservations = [];
        this.pendingReservations = [];
        this.route.pathFromRoot[1].url.subscribe(
            url => {
                // Obtiene el tipo de usuario
                this.userType = url[0].path;
                // Obtiene el id del usuario
                this.companyId = url[1].path;
            }
        );
    }

    ngOnInit(): void {
        this.getNewReservations();
        this.getPendingReservations();
    }

    getNewReservations() {
        const status = 'solicited';
        this.companyDataService.getReservationsByCompanyIdAndStatus(this.companyId, status).subscribe((res: any) => {
            this.newReservations = res;
        });
    }

    getPendingReservations() {
        const status = 'En curso';
        this.companyDataService.getReservationsByCompanyIdAndStatus(this.companyId, status).subscribe((res: any) => {
            this.pendingReservations = res;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        if (!filterValue) {
            this.getPendingReservations();
        } else {
            this.pendingReservations = this.pendingReservations.filter(reservation =>
                Object.values(reservation).some(value =>
                    (typeof value === 'string' && value.toLowerCase().includes(filterValue))
                )
            );
        }
    }

}


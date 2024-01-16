import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingHistory } from 'src/app/models/booking-history.model';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { Form, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-history-cards',
  templateUrl: './history-cards.component.html',
  styleUrls: ['./history-cards.component.scss']
})
export class HistoryCardsComponent implements OnInit {

  bookingData!: BookingHistory;

  elementData!: any[];
  pageSlice!: any[];
  messages!: any[];
  

  @ViewChild(MatPaginator, {static: true}) 
  paginator!: MatPaginator;

  userId: string = '';
  userType: string = '';
  company: any;
  client: any;

  paymentForm: FormGroup;

  constructor(private companyDataService: CargaSinEstresDataService, private router: Router, private dialog: MatDialog,
     private route: ActivatedRoute, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.bookingData = {} as any;
    this.pageSlice = [];
    this.elementData = [];
    this.messages = [];
    this.paymentForm = this.fb.group({
       payment: ['', Validators.required]
    });

    this.route.pathFromRoot[1].url.subscribe(
      url => {

        // Obtiene el tipo de usuario
        this.userType = url[0].path;

        // Obtiene el id del usuario
        this.userId = url[1].path;
      }
    );    
  }
  
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.elementData.length) {
      endIndex = this.elementData.length;
    }
    this.pageSlice = this.elementData.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    this.getBookingHistoryById(this.userId);
  }

  getCompany(id: any) {
    this.companyDataService.getCompanyById(id).subscribe(
      (res: any) => {this.company = res;},
      err => {
        console.log(err);
      }
    );
  }

  getBookingHistoryById(id: any) {  
    if(this.userType == 'client'){
      this.companyDataService.getBookingHistoryById(id).subscribe((response: any) => {
        this.elementData = response;

        this.elementData.forEach((element, index) => {
          element.counter = index + 1;
          element.isEditMode = false;
        });
        this.elementData.reverse();

        this.pageSlice = this.elementData.slice(0, 4);
      })
    }else 
    
    if(this.userType == 'company'){
      
      this.companyDataService.getBookingHistoryByCompanyId(id).subscribe((response: any) => {
        this.elementData = response;
        this.elementData.forEach((element, index) => {
          element.counter = index + 1;
          element.isEditMode = false;
        });
        this.elementData.reverse();
        this.pageSlice = this.elementData.slice(0, 4);
      })
    }
  }

  openDialog(element: any) {
    this.dialog.open(ChatDialogComponent, {
      width: '600px',
      data:{
        userId:this.userId, 
        userType: this.userType, 
        element
      }
    });
  }

  
  openDialogReview(element: any) {
    this.dialog.open(ReviewDialogComponent, {
      width: '600px',
      data: {
        userId: this.userId,
        userType: this.userType,
        company: element,
      }
    });
  }
  isEditMode = false;
  paymentData!: any;

  editItem(element: any){
    this.paymentData = element.payment;
    element.isEditMode = true;
  }

  cancelEdit(element: any){
    element.isEditMode = false;
  }

  onSubmit(element: any){
    const payment = this.paymentForm.value.payment;
    if(element.isEditMode){
      this.updatePayment(element, payment);
    }

  }

  updatePayment(element: any, newPayment: any){
    const data = {
      payment: newPayment
    }
    this.companyDataService.updateBookingHistoryPayment(element.id, data).subscribe((response: any)=>{
      this.getBookingHistoryById(this.userId);
    })
  }

  cancelBooking(element: any){
    const cancelStatus = 'Finalizado';
    this.companyDataService.updateBookingHistoryStatus(element.id, cancelStatus).subscribe((response: any)=>{
      this.getBookingHistoryById(this.userId);
    });
    this._snackBar.open('Se canceló la reserva con éxito', 'Cancelado', {
      duration: 2000, // Duración en milisegundos
    });
  }
    
}


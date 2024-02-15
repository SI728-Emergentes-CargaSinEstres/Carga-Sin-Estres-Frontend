import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookingHistory } from '../models/booking-history.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaSinEstresDataService {
  base_url = environment.baseURL;

  constructor( private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTcwMDY4MjY4NCwiZXhwIjoxNzA5MDAyNjg0LCJyb2xlcyI6WyJST0xFX1VTRVIiXX0.5fJ4KkmgMiPQj0jQs8Ss7LslBJ9mxpS6CeyJTNvnbDY`
    })
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`Ocurrió un error: ${error.status}, el cuerpo fue: ${error.error}`);
    }
    else {
      console.log(`El servidor respondió con el código ${error.status}, el cuerpo fue: ${error.error}`);
    }
    return throwError('Ha ocurrido un problema con la solicitud, por favor inténtalo de nuevo más tarde');
  }

  //Company Controller ---------------------------------------------------------------
  getAllCompanies(): Observable<any> {
    return this.http.get<any>(this.base_url+"/companies", this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }
  
  getCompanyById(id: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/companies/${id}`, this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getCompaniesForLogin(email: string, password: string): Observable<any> {
    return this.http.get(`${this.base_url}/companiesForLogin?email=${email}&password=${password}`, this.httpOptions);
  }

  createCompany(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/companies`, JSON.stringify(data), this.httpOptions);
  }

  updateCompany(id: any, data: any): Observable<any> {
    return this.http.put(`${this.base_url}/companies/${id}`, JSON.stringify(data), this.httpOptions);
  }


  //BookingHistory Controller ---------------------------------------------------------------
  createReservation(clientId: any ,companyId: any,item: any): Observable<BookingHistory>{
    console.log("clientId: " + clientId);
    return this.http.post<BookingHistory>(`${this.base_url}/bookingHistory?idClient=${clientId}&idCompany=${companyId}`, JSON.stringify(item), this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getBookingHistoryById(clientId: any): Observable<BookingHistory> {
    return this.http.get<BookingHistory>(`${this.base_url}/bookingHistory/client/${clientId}`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  getBookingHistoryByCompanyId(companyId: any): Observable<BookingHistory> {
    return this.http.get<BookingHistory>(`${this.base_url}/bookingHistory/company/${companyId}`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  //update status
  updateBookingHistoryStatus(id: any, data: any): Observable<BookingHistory> {
    return this.http.patch<BookingHistory>(`${this.base_url}/bookingHistory/${id}/status`, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  //update payment
  updateBookingHistoryPayment(id: any, data: any): Observable<BookingHistory> {
    return this.http.patch<BookingHistory>(`${this.base_url}/bookingHistory/${id}/payment`, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  //Chat Controller ---------------------------------------------------------------
  updateBookingHistoryMessage(id: any, userType: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bookingHistory/${id}/chat?userType=${userType}`, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  
  //Client Controller ---------------------------------------------------------------
  getClientsForLogin(email: string, password: string): Observable<any> {
    const url = `${this.base_url}/clients?Email=${email}&Password=${password}`;
    return this.http.get(`${url}`, this.httpOptions);
  }

  createClient(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/clients`, JSON.stringify(data), this.httpOptions);
  }

  //for settings
  updateClient(id: any, data: any): Observable<any> {
    return this.http.put(`${this.base_url}/clients/${id}`, JSON.stringify(data), this.httpOptions);
  }

  //get client by id
  getClientById(clientId: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/clients/${clientId}`, this.httpOptions)
    .pipe(retry(2),catchError(this.handleError));
  }

  //Subscription Controller ---------------------------------------------------------------
  createSubscription(companyId: any, subscriptionData: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/subscriptions/${companyId}`, JSON.stringify(subscriptionData), this.httpOptions)
      .pipe(retry(2),catchError(this.handleError));
  }

  searchExistingMembership(companyId: any): Observable<boolean> {
    return this.http.get<any[]>(`${this.base_url}/subscriptions/${companyId}`, this.httpOptions)
      .pipe(
        map((subscriptions: any[]) => subscriptions.length > 0)
      );
  }
  
  //Review Controller ---------------------------------------------------------------
  addReview(companyId: any, review: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/reviews/${companyId}`, JSON.stringify(review), this.httpOptions)
      .pipe(retry(2),catchError(this.handleError));
  }

  getReviewsByCompanyId(companyId: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/reviews/${companyId}`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  // Obtain companies by status of the reservation
  getReservationsByCompanyIdAndStatus(companyId: any, status: string): Observable<BookingHistory[]> {
    return this.http.get<BookingHistory[]>(`${this.base_url}/bookingHistory/company/${companyId}?status=${status}`, this.httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bill, PaymentRequest, PaymentResponse } from '../models/bill.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = 'http://localhost:8080/api/bills';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Customer methods
  getCustomerBills(consumerId: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/customer/${consumerId}`)
      .pipe(catchError(this.handleError));
  }

  getBillById(billId: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/${billId}`)
      .pipe(catchError(this.handleError));
  }

  getUnpaidBills(consumerId: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/customer/${consumerId}/pending`)
      .pipe(catchError(this.handleError));
  }

  payBill(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/pay`, paymentRequest)
      .pipe(catchError(this.handleError));
  }

  downloadBill(billId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${billId}/download`, { 
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  // Admin methods
  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  getBillsByStatus(status: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/status/${status}`)
      .pipe(catchError(this.handleError));
  }

  createBill(bill: Partial<Bill>): Observable<Bill> {
    return this.http.post<Bill>(`${this.apiUrl}`, bill)
      .pipe(catchError(this.handleError));
  }

  updateBill(billId: string, bill: Partial<Bill>): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/${billId}`, bill)
      .pipe(catchError(this.handleError));
  }

  deleteBill(billId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${billId}`)
      .pipe(catchError(this.handleError));
  }

  getBillStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  getPaymentHistory(consumerId?: string): Observable<PaymentResponse[]> {
    const url = consumerId 
      ? `${this.apiUrl}/payments/customer/${consumerId}` 
      : `${this.apiUrl}/payments`;
    return this.http.get<PaymentResponse[]>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status ? `${error.status}: ${error.message}` : 'Server error';
    }
    return throwError(() => new Error(errorMessage));
  }
}
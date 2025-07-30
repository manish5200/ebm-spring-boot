import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bill, PaymentRequest, PaymentResponse } from '../models/bill.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

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
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}/customer/${consumerId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getBillById(billId: string): Observable<Bill> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill>(`${this.apiUrl}/${billId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getUnpaidBills(consumerId: string): Observable<Bill[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}/customer/${consumerId}/unpaid`, { headers })
      .pipe(catchError(this.handleError));
  }

  payBill(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<PaymentResponse>(`${this.apiUrl}/pay`, paymentRequest, { headers })
      .pipe(catchError(this.handleError));
  }

  downloadBill(billId: string): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${billId}/download`, { 
      headers, 
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  // Admin methods
  getAllBills(consumerId:string): Observable<Bill[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}/customers/${consumerId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getBillsByStatus(status: string): Observable<Bill[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}/status/${status}`, { headers })
      .pipe(catchError(this.handleError));
  }

  createBill(bill: Partial<Bill>): Observable<Bill> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Bill>(`${this.apiUrl}`, bill, { headers })
      .pipe(catchError(this.handleError));
  }

  updateBill(billId: string, bill: Partial<Bill>): Observable<Bill> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Bill>(`${this.apiUrl}/${billId}`, bill, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteBill(billId: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${billId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getBillStats(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPaymentHistory(consumerId?: string): Observable<PaymentResponse[]> {
    const headers = this.authService.getAuthHeaders();
    const url = consumerId 
      ? `${this.apiUrl}/payments/customer/${consumerId}` 
      : `${this.apiUrl}/payments`;
    return this.http.get<PaymentResponse[]>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || 'Server error';
    }
    console.error('Bill Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
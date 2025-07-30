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
  private apiUrl = environment.apiUrl + '/bills'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Customer methods
  // FIXED: Changed customerId type to string to match consumerId from User model
  getCustomerBills(customerId: string): Observable<Bill[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}/customer/${customerId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getBillById(id: string): Observable<Bill> { // FIXED: Changed id type to string if billId is string
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPendingBills(customerId: string): Observable<Bill[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}/customer/${customerId}/pending`, { headers })
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

  // Admin methods (keeping as is, assuming they are correct for admin functionality)
  getAllBills(): Observable<Bill[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Bill[]>(`${this.apiUrl}`, { headers })
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

  updateBill(id: number, bill: Partial<Bill>): Observable<Bill> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Bill>(`${this.apiUrl}/${id}`, bill, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteBill(id: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getBillStats(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers })
      .pipe(catchError(this.handleError));
  }

  // FIXED: Changed customerId type to string to match consumerId from User model
  getPaymentHistory(customerId?: string): Observable<PaymentResponse[]> {
    const headers = this.authService.getAuthHeaders();
    const url = customerId
      ? `${this.apiUrl}/payments/customer/${customerId}`
      : `${this.apiUrl}/payments`; // This branch is likely for admin to get all payments
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

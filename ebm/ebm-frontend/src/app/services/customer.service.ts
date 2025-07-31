
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Customer, CustomerUpdateRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  /**
   * Get all customers
   */
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get customer by consumerId
   */
  getCustomerById(consumerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${consumerId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update customer by consumerId
   */
  updateCustomer(consumerId: string, customerData: CustomerUpdateRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${consumerId}`, customerData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update customer profile by userId
   */
  updateCustomerProfile(userId: number, customerData: CustomerUpdateRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/profile/${userId}`, customerData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete customer by consumerId
   */
  deleteCustomer(consumerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${consumerId}`)
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

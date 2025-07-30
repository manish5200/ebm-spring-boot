import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Complaint, ComplaintRequest, ComplaintResponse } from '../models/complaint.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = environment.apiUrl + '/complaints'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Customer methods
  getCustomerComplaints(customerId: number): Observable<Complaint[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint[]>(`${this.apiUrl}/customer/${customerId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  createComplaint(complaint: ComplaintRequest): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Complaint>(`${this.apiUrl}`, complaint, { headers })
      .pipe(catchError(this.handleError));
  }

  updateComplaint(id: number, complaint: ComplaintRequest): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint, { headers })
      .pipe(catchError(this.handleError));
  }

 deleteComplaint(id: number | string): Observable<void> {
  const headers = this.authService.getAuthHeaders();
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
    .pipe(catchError(this.handleError));
}

  getComplaintById(id: number): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  editComplaint(complaintId: string, complaint: any) {
    return this.http.put(`${this.apiUrl}/${complaintId}`, complaint, { headers: this.authService.getAuthHeaders() });
  }

  fileComplaint(complaint: any) {
    return this.http.post(`${this.apiUrl}`, complaint, { headers: this.authService.getAuthHeaders() });
  }

  // Admin methods
  getAllComplaints(): Observable<Complaint[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint[]>(`${this.apiUrl}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint[]>(`${this.apiUrl}/status/${status}`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateComplaintStatus(id: string, response: ComplaintResponse): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Complaint>(`${this.apiUrl}/${id}/status`, response, { headers })
      .pipe(catchError(this.handleError));
  }

  getComplaintStats(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers })
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
    console.error('Complaint Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Complaint, ComplaintRequest, ComplaintResponse, UpdateComplaintStatusRequest } from '../models/complaint.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8080/api/complaints';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Customer methods
  getCustomerComplaints(consumerId: string): Observable<Complaint[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint[]>(`${this.apiUrl}/customer/${consumerId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getOpenComplaints(consumerId: string): Observable<Complaint[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint[]>(`${this.apiUrl}/customer/${consumerId}/open`, { headers })
      .pipe(catchError(this.handleError));
  }

  createComplaint(complaint: ComplaintRequest): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Complaint>(`${this.apiUrl}`, complaint, { headers })
      .pipe(catchError(this.handleError));
  }

  updateComplaint(complaintId: string, complaint: ComplaintRequest): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Complaint>(`${this.apiUrl}/${complaintId}`, complaint, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteComplaint(complaintId: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${complaintId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getComplaintById(complaintId: string): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint>(`${this.apiUrl}/${complaintId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Admin methods
  getAllComplaints(): Observable<Complaint[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Complaint[]>(`${this.apiUrl}`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateComplaintStatus(complaintId: string, updateRequest: UpdateComplaintStatusRequest): Observable<Complaint> {
    const headers = this.authService.getAuthHeaders();
    return this.http.patch<Complaint>(`${this.apiUrl}/${complaintId}/status`, updateRequest, { headers })
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
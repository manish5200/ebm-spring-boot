import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Complaint, ComplaintRequest, ComplaintResponse, UpdateComplaintStatusRequest } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8080/api/complaints';

  constructor(private http: HttpClient) {}

  // Customer methods
  getCustomerComplaints(consumerId: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/customer/${consumerId}`)
      .pipe(catchError(this.handleError));
  }

  getOpenComplaints(consumerId: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/customer/${consumerId}/open`)
      .pipe(catchError(this.handleError));
  }

  createComplaint(complaint: ComplaintRequest): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(`${this.apiUrl}`, complaint)
      .pipe(catchError(this.handleError));
  }

  updateComplaint(complaintId: string, complaint: ComplaintRequest): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(`${this.apiUrl}/${complaintId}`, complaint)
      .pipe(catchError(this.handleError));
  }

  deleteComplaint(complaintId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${complaintId}`)
      .pipe(catchError(this.handleError));
  }

  getComplaintById(complaintId: string): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${complaintId}`)
      .pipe(catchError(this.handleError));
  }

  // Admin methods
  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/status/${status}`)
      .pipe(catchError(this.handleError));
  }

  updateComplaintStatus(complaintId: string, updateRequest: UpdateComplaintStatusRequest): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(`${this.apiUrl}/${complaintId}/status`, updateRequest)
      .pipe(catchError(this.handleError));
  }

  getComplaintStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`)
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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComplaintResponse, RegisterComplaintRequest, UpdateComplaintStatusRequest } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private baseUrl = 'http://localhost:8080/api/complaints';

  constructor(private http: HttpClient) {}

  // Register a new complaint
  registerComplaint(request: RegisterComplaintRequest): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(this.baseUrl, request);
  }

  // Get all complaints (Admin only)
  getAllComplaints(): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(this.baseUrl);
  }

  // Get complaints for a specific customer
  getCustomerComplaints(consumerId: string): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(`${this.baseUrl}/customer/${consumerId}`);
  }

  // Get open complaints for a customer
  getOpenComplaints(consumerId: string): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(`${this.baseUrl}/customer/${consumerId}/open`);
  }

  // Get complaint by ID
  getComplaintById(complaintId: string): Observable<ComplaintResponse> {
    return this.http.get<ComplaintResponse>(`${this.baseUrl}/${complaintId}`);
  }

  // Update complaint status (Admin only)
  updateComplaintStatus(request: UpdateComplaintStatusRequest): Observable<ComplaintResponse> {
    return this.http.patch<ComplaintResponse>(`${this.baseUrl}/${request.complaintId}/status`, request);
  }

  // Delete complaint (Customer only)
  deleteComplaint(complaintId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${complaintId}`);
  }
}
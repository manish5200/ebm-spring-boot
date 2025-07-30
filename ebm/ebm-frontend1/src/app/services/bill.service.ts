import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillResponse, CreateBillRequest, PaymentRequest, PaymentResponse } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private baseUrl = 'http://localhost:8080/api/bills';

  constructor(private http: HttpClient) {}

  // Create a new bill (Admin only)
  createBill(request: CreateBillRequest): Observable<BillResponse> {
    return this.http.post<BillResponse>(this.baseUrl, request);
  }

  // Get all bills for a customer
  getAllBills(consumerId: string): Observable<BillResponse[]> {
    return this.http.get<BillResponse[]>(`${this.baseUrl}/customer/${consumerId}`);
  }

  // Get pending bills for a customer
  getPendingBills(consumerId: string): Observable<BillResponse[]> {
    return this.http.get<BillResponse[]>(`${this.baseUrl}/customer/${consumerId}/pending`);
  }

  // Get paid bills for a customer
  getPaidBills(consumerId: string): Observable<BillResponse[]> {
    return this.http.get<BillResponse[]>(`${this.baseUrl}/customer/${consumerId}/paid`);
  }

  // Pay a bill
  payBill(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/pay`, request);
  }

  // Get all bills (Admin only)
  getAllBillsForAdmin(): Observable<BillResponse[]> {
    return this.http.get<BillResponse[]>(`${this.baseUrl}/admin/all`);
  }
}
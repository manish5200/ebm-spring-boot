import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  username: string;
  userType: string;
  message: string;
}

export interface CustomerRegistrationRequest {
  username: string;
  email: string;
  password: string;
  consumerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

export interface AdminRegistrationRequest {
  username: string;
  email: string;
  password: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.userType && response.userId) {
            const user = {
              userId: response.userId,
              username: response.username,
              userType: response.userType
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  registerCustomer(data: CustomerRegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/register`, data);
  }

  registerAdmin(data: AdminRegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/admins/register`, data);
  }

  updateCustomerProfile(userId: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customers/profile/${userId}`, data);
  }

  // Admin Statistics
  getAdminStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/statistics`);
  }

  // Customer Management
  getAllCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/customers`);
  }

  deleteCustomer(customerId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/customers/${customerId}`);
  }

  // Bill Management
  getAllBills(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/bills`);
  }

  deleteBill(billId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/bills/${billId}`);
  }

  // Complaint Management
  getAllComplaints(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/complaints`);
  }

  deleteComplaint(complaintId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/complaints/${complaintId}`);
  }

  updateComplaintStatus(complaintId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/complaints/${complaintId}/status`, { status });
  }

  respondToComplaint(complaintId: string, response: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/complaints/${complaintId}/respond`, { response });
  }

  // Customer Dashboard Methods
  getCustomerBills(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/${userId}/bills`);
  }

  getCustomerComplaints(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/${userId}/complaints`);
  }

  payBill(billId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/bills/${billId}/pay`, {});
  }

  fileComplaint(userId: string, complaintData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/${userId}/complaints`, complaintData);
  }
  
  // Utility methods
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
  
  isCustomer(): boolean {
    const user = this.getCurrentUser();
    return user && user.userType === 'CUSTOMER';
  }
  
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.userType === 'ADMIN';
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // registerCustomer(customerData: { username: any; email: any; password: any; consumerId: any; name: string; address: any; city: any; state: any; pincode: any; mobile: any; }) {
  //   throw new Error('Method not implemented.');
  // }
  // registerAdmin(adminData: { username: any; email: any; password: any; department: any; }) {
  //   throw new Error('Method not implemented.');
  // }
  private apiUrl = environment.apiUrl + '/auth'; // Update with your API URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  isLoggedIn: any;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData)
      .pipe(catchError(this.handleError));
  }
 /**
   * Registers a new customer.
   * @param customerData The data for the new customer.
   * @returns An Observable of the registration response.
   */
  registerCustomer(customerData: any): Observable<any> { // Use 'any' or define a specific interface for customerData
    // Assuming your backend has a specific endpoint for customer registration
    return this.http.post<any>(`${this.apiUrl}/register/customer`, customerData)
      .pipe(catchError(this.handleError));
  }

   /**
   * Registers a new admin.
   * @param adminData The data for the new admin.
   * @returns An Observable of the registration response.
   */
  registerAdmin(adminData: any): Observable<any> { // Use 'any' or define a specific interface for adminData
    // Assuming your backend has a specific endpoint for admin registration
    return this.http.post<any>(`${this.apiUrl}/register/admin`, adminData)
      .pipe(catchError(this.handleError));
  }



  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.role === 'ADMIN' : false;
  }

  isCustomer(): boolean {
    const user = this.currentUserValue;
    return user ? user.role === 'CUSTOMER' : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  updateAdminProfile(userId: string, updateData: any): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/admin/${userId}`, updateData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateCustomerProfile(userId: string, updateData: any): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/customer/${userId}`, updateData, { headers })
      .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, { headers })
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
    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
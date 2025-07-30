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
  private apiUrl = 'http://localhost:8080/api/auth'; // Update with your API URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

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
          if (response && response.userId) {
            // Build user object
            const user: User = {
              id: response.userId,
              username: response.username,
              userType: response.userType as 'CUSTOMER' | 'ADMIN',
              status: 'ACTIVE',
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(catchError(this.handleError));
  }

  registerCustomer(customerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/customer`, customerData)
      .pipe(catchError(this.handleError));
  }

  registerAdmin(adminData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/admin`, adminData)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.userType === 'ADMIN' : false;
  }

  isCustomer(): boolean {
    const user = this.currentUserValue;
    return user ? user.userType === 'CUSTOMER' : false;
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

  updateAdminProfile(userId: number, updateData: any): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/admin/${userId}`, updateData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateCustomerProfile(userId: number, updateData: any): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/customer/${userId}`, updateData, { headers })
      .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<void> {
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
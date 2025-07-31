import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Update with your API URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
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
              name: response.name,
              username: response.username,
              userType: response.userType as 'CUSTOMER' | 'ADMIN',
              status: 'ACTIVE',
              consumerId: response.consumerId // Add consumerId for customers
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            
            // Store token if it exists in response
            if ((response as any).token) {
              localStorage.setItem('token', (response as any).token);
            }
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
    return this.http.post<any>(`http://localhost:8080/api/customers/register`, customerData)
      .pipe(catchError(this.handleError));
  }

  registerAdmin(adminData: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/admins/register`, adminData)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']);
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

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/api/admins/customers`)
      .pipe(catchError(this.handleError));
  }

  updateUserProfile(userId: number, userData: any): Observable<User> {
    return this.http.put<User>(`http://localhost:8080/api/admins/${userId}`, userData)
      .pipe(catchError(this.handleError));
  }

  updateCustomerProfile(userId: number, customerData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/customers/profile/${userId}`, customerData)
      .pipe(catchError(this.handleError));
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
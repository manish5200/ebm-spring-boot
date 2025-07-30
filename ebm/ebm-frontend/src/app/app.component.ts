import { Component, OnInit, OnDestroy, importProvidersFrom } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'EBM System';
  currentUser: User | null = null;
  private authSubscription: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(
      user => this.currentUser = user
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCustomer(): boolean {
    return this.authService.isCustomer();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('You have been logged out successfully', 'Logout');
    this.router.navigate(['/auth/login']);
  }
}

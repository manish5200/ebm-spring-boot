import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  dashboardLink = '/';
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.isLoggedIn) {
      if (this.authService.isCustomer()) {
        this.dashboardLink = '/customer/dashboard';
      } else if (this.authService.isAdmin()) {
        this.dashboardLink = '/admin/dashboard';
      }
    }
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  navigateToService(service: string): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    switch (service) {
      case 'bills':
        if (this.authService.isCustomer()) {
          this.router.navigate(['/customer/dashboard']);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        }
        break;
      case 'payments':
        if (this.authService.isCustomer()) {
          this.router.navigate(['/customer/dashboard']);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        }
        break;
      case 'complaints':
        if (this.authService.isCustomer()) {
          this.router.navigate(['/customer/dashboard']);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        }
        break;
      case 'analytics':
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        }
        break;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.dashboardLink = '/';
  }
}
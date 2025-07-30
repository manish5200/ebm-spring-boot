import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Check if route requires specific role
      const requiredRole = route.data?.['role'];
      if (requiredRole) {
        const user = this.authService.currentUserValue;
        if (user && user.role === requiredRole) {
          return true;
        } else {
          // Redirect to appropriate dashboard based on user role
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else if (this.authService.isCustomer()) {
            this.router.navigate(['/customer/dashboard']);
          }
          return false;
        }
      }
      return true;
    }

    // Not logged in, redirect to login page with return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    if (this.authService.isCustomer()) {
      this.router.navigate(['/customer/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.isCustomer()) {
      return true;
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    return false;
  }
}
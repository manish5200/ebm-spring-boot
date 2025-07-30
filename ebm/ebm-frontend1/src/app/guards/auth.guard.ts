import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      const requiredRole = route.data['role'];
      
      if (requiredRole) {
        if (requiredRole === 'CUSTOMER' && this.authService.isCustomer()) {
          return true;
        } else if (requiredRole === 'ADMIN' && this.authService.isAdmin()) {
          return true;
        } else {
          // User doesn't have required role
          this.router.navigate(['/unauthorized']);
          return false;
        }
      } else {
        // No specific role required, just need to be logged in
        return true;
      }
    } else {
      // User is not logged in
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
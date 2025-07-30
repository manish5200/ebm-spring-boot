import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, CustomerGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'auth/login', loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'customer/dashboard', canActivate: [CustomerGuard], loadComponent: () => import('./components/customer/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
  { path: 'customer/complaints', canActivate: [CustomerGuard], loadComponent: () => import('./components/customer/customer-complaints.component').then(m => m.CustomerComplaintsComponent) },
  { path: 'customer/file-complaint', canActivate: [CustomerGuard], loadComponent: () => import('./components/customer/file-complaint.component').then(m => m.FileComplaintComponent) },
  { path: 'customer/bills', canActivate: [CustomerGuard], loadComponent: () => import('./components/customer/customer-bills.component').then(m => m.CustomerBillsComponent) },
  { path: 'admin/dashboard', canActivate: [AdminGuard], loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/users', canActivate: [AdminGuard], loadComponent: () => import('./components/admin/admin-users.component').then(m => m.AdminUsersComponent) },
  { path: 'admin/complaints', canActivate: [AdminGuard], loadComponent: () => import('./components/admin/admin-complaints.component').then(m => m.AdminComplaintsComponent) },
  { path: 'admin/bills', canActivate: [AdminGuard], loadComponent: () => import('./components/admin/admin-bills.component').then(m => m.AdminBillsComponent) },
  { path: '**', redirectTo: '/home' }
];
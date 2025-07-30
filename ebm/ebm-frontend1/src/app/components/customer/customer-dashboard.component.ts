import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: any;
  loading = true;
  
  // Statistics
  stats = {
    pendingBills: 0,
    paidBills: 0,
    openComplaints: 0,
    totalDue: 0
  };
  
  // Recent data
  recentBills: any[] = [];
  recentComplaints: any[] = [];
  
  // Profile editing
  profileEditMode = false;
  profileFormData: any = {};
  profileUpdateSuccess = '';
  profileUpdateError = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'CUSTOMER') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.loading = true;
    
    // Load customer bills
    this.authService.getCustomerBills(this.currentUser.userId).subscribe({
      next: (bills) => {
        this.recentBills = bills.slice(0, 5); // Show last 5 bills
        this.calculateStats(bills);
      },
      error: (error) => {
        console.error('Error loading bills:', error);
      }
    });
    
    // Load customer complaints
    this.authService.getCustomerComplaints(this.currentUser.userId).subscribe({
      next: (complaints) => {
        this.recentComplaints = complaints.slice(0, 5); // Show last 5 complaints
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading complaints:', error);
        this.loading = false;
      }
    });
  }
  
  calculateStats(bills: any[]): void {
    this.stats.pendingBills = bills.filter(bill => bill.status === 'PENDING').length;
    this.stats.paidBills = bills.filter(bill => bill.status === 'PAID').length;
    this.stats.totalDue = bills
      .filter(bill => bill.status === 'PENDING')
      .reduce((sum, bill) => sum + parseFloat(bill.amountDue), 0);
  }
  
  // Profile editing methods
  startEditProfile(): void {
    this.profileEditMode = true;
    this.profileFormData = {
      name: this.currentUser.name || '',
      address: this.currentUser.address || '',
      city: this.currentUser.city || '',
      state: this.currentUser.state || '',
      pincode: this.currentUser.pincode || '',
      mobile: this.currentUser.mobile || ''
    };
  }
  
  cancelEditProfile(): void {
    this.profileEditMode = false;
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
  }
  
  saveProfile(): void {
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
    
    this.authService.updateCustomerProfile(this.currentUser.userId, this.profileFormData).subscribe({
      next: (response) => {
        this.profileUpdateSuccess = 'Profile updated successfully!';
        // Update current user with new details
        Object.assign(this.currentUser, this.profileFormData);
        this.profileEditMode = false;
      },
      error: (error) => {
        this.profileUpdateError = 'Failed to update profile. Please try again.';
        console.error('Profile update error:', error);
      }
    });
  }
  
  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN');
  }
  
  getCurrentDateTime(): Date {
    return new Date();
  }
  
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge-warning';
      case 'PAID':
        return 'badge-success';
      case 'OPEN':
        return 'badge-danger';
      case 'IN_PROGRESS':
        return 'badge-info';
      case 'RESOLVED':
        return 'badge-success';
      case 'CLOSED':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  payBill(billId: string): void {
    this.authService.payBill(billId).subscribe({
      next: () => {
        this.loadDashboardData(); // Reload data after payment
      },
      error: (error) => {
        console.error('Payment error:', error);
      }
    });
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BillService } from '../../services/bill.service';
import { ComplaintService } from '../../services/complaint.service';
// Update the import to match the actual exported member from bill.model.ts
import { Bill } from '../../models/bill.model';
import { Complaint, ComplaintStatus } from '../../models/complaint.model';
import { BillStatus } from '../../models/bill.model';
@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent {
  currentUser: any;
  loading = true;
  
  // Dashboard statistics
  stats = {
    pendingBills: 0,
    totalDue: 0,
    openComplaints: 0,
    paidBills: 0
  };

  recentBills: Bill[] = [];
  recentComplaints: Complaint[] = [];
  paymentHistory: any[] = [];

  profileEditMode = false;
  profileFormData: any = {};
  profileUpdateSuccess = '';
  profileUpdateError = '';

  constructor(
    private authService: AuthService,
    private billService: BillService,
    private complaintService: ComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser || !this.authService.isCustomer()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
    this.loadPaymentHistory();
  }

  getCurrentDateTime(): Date {
    return new Date();
  }

  loadDashboardData(): void {
    this.loading = true;
    const customerId = this.currentUser.userId;

    // Load bills data
    this.billService.getAllBills().subscribe({
      next: (bills) => {
        const pendingBills = bills.filter(bill => bill.status === BillStatus.PENDING || bill.status === BillStatus.PARTIAL);
        const paidBills = bills.filter(bill => bill.status === BillStatus.PAID);

        this.stats.pendingBills = pendingBills.length;
        this.stats.paidBills = paidBills.length;
        this.stats.totalDue = pendingBills.reduce((sum, bill) => sum + bill.amountDue, 0);
        
        // Get recent bills (last 5)
        this.recentBills = bills
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading bills:', error);
      }
    });

    // Load complaints data
// Load complaints data
this.complaintService.getCustomerComplaints(customerId).subscribe({
  next: (complaints) => {
    this.stats.openComplaints = complaints.filter(c =>
      c.status === ComplaintStatus.OPEN || c.status === ComplaintStatus.IN_PROGRESS
    ).length;
    
    // Get recent complaints (last 5)
    this.recentComplaints = complaints
      .sort((a, b) => new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime())
      .slice(0, 5);
    
    this.loading = false;
  },
  error: (error) => {
    console.error('Error loading complaints:', error);
    this.loading = false;
  }
});

  }

  loadPaymentHistory() {
    const customerId = this.currentUser.userId;
    this.billService.getPaymentHistory(customerId).subscribe({
      next: (history) => {
        this.paymentHistory = history;
      },
      error: (err) => {
        this.paymentHistory = [];
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
      case 'OPEN':
        return 'bg-warning text-dark';
      case 'IN_PROGRESS':
        return 'bg-info';
      case 'PAID':
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  startEditProfile() {
    this.profileEditMode = true;
    // Pre-fill form data with current user details
    this.profileFormData = {
      name: this.currentUser.name || '',
      address: this.currentUser.address || '',
      city: this.currentUser.city || '',
      state: this.currentUser.state || '',
      pincode: this.currentUser.pincode || '',
      mobile: this.currentUser.mobile || ''
    };
  }

  cancelEditProfile() {
    this.profileEditMode = false;
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
  }

  saveProfile() {
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
    const userId = this.currentUser.userId || this.currentUser.id;
    const updateData = {
      name: this.profileFormData.name,
      address: this.profileFormData.address,
      city: this.profileFormData.city,
      state: this.profileFormData.state,
      pincode: this.profileFormData.pincode,
      mobile: this.profileFormData.mobile
    };
    this.authService.updateCustomerProfile(userId, updateData).subscribe({
      next: (res) => {
        this.profileUpdateSuccess = 'Profile updated successfully!';
        Object.assign(this.currentUser, updateData);
        this.profileEditMode = false;
      },
      error: (err) => {
        this.profileUpdateError = 'Failed to update profile.';
      }
    });
  }
}
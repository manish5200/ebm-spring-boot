import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BillService } from '../../services/bill.service';
import { ComplaintService } from '../../services/complaint.service';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Bill, BillStatus } from '../../models/bill.model';
import { Complaint, ComplaintStatus } from '../../models/complaint.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  stats = {
    totalCustomers: 0,
    pendingBills: 0,
    openComplaints: 0,
    totalRevenue: 0
  };

  recentBills: Bill[] = [];
  recentComplaints: Complaint[] = [];

  // Profile view only
  showProfileModal = false;

  constructor(
    private authService: AuthService,
    private billService: BillService,
    private complaintService: ComplaintService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadStats();
    this.loadRecentBills();
    this.loadRecentComplaints();
  }

  loadStats(): void {
    // Load real stats from APIs
    this.loadCustomerStats();
    this.loadBillStats();
    this.loadComplaintStats();
  }

  loadCustomerStats(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.stats.totalCustomers = customers.length;
      },
      error: (error) => {
        console.error('Failed to load customer stats:', error);
      }
    });
  }

  loadBillStats(): void {
    this.billService.getAllBills().subscribe({
      next: (bills) => {
        this.stats.pendingBills = bills.filter(bill => bill.status === 'PENDING').length;
        this.stats.totalRevenue = bills
          .filter(bill => bill.status === 'PAID')
          .reduce((sum, bill) => sum + bill.amountDue, 0);
      },
      error: (error) => {
        console.error('Failed to load bill stats:', error);
      }
    });
  }

  loadComplaintStats(): void {
    this.complaintService.getAllComplaints().subscribe({
      next: (complaints) => {
        this.stats.openComplaints = complaints.filter(complaint => complaint.status === 'OPEN').length;
      },
      error: (error) => {
        console.error('Failed to load complaint stats:', error);
      }
    });
  }

  loadRecentBills(): void {
    // Load real bills from API
    this.billService.getAllBills().subscribe({
      next: (bills) => {
        this.recentBills = bills
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, 5); // Get first 5 bills
      },
      error: (error) => {
        this.toastr.error('Failed to load recent bills', 'Error');
      }
    });
  }

  loadRecentComplaints(): void {
    // Load real complaints from API
    this.complaintService.getAllComplaints().subscribe({
      next: (complaints) => {
        this.recentComplaints = complaints
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5); // Get first 5 complaints
      },
      error: (error) => {
        this.toastr.error('Failed to load recent complaints', 'Error');
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

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case BillStatus.PENDING: return 'badge bg-warning';
      case BillStatus.PAID: return 'badge bg-success';
      case ComplaintStatus.OPEN: return 'badge bg-warning';
      case ComplaintStatus.IN_PROGRESS: return 'badge bg-info';
      case ComplaintStatus.RESOLVED: return 'badge bg-success';
      case ComplaintStatus.CLOSED: return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  // Profile view methods
  viewProfile(): void {
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  // Profile edit functionality
  profileEditMode = false;
  profileFormData: any = {};
  profileUpdateSuccess = '';
  profileUpdateError = '';

  startEditProfile(): void {
    this.profileEditMode = true;
    this.profileFormData = {
      name: this.currentUser?.name || '',
      email: this.currentUser?.email || '',
      department: this.currentUser?.department || '',
      mobile: this.currentUser?.mobile || ''
    };
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
  }

  cancelEditProfile(): void {
    this.profileEditMode = false;
    this.profileFormData = {};
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
  }

  saveProfile(): void {
    if (!this.currentUser?.id) {
      this.profileUpdateError = 'User ID not found';
      return;
    }

    const profileData = {
      name: this.profileFormData.name,
      email: this.profileFormData.email,
      department: this.profileFormData.department
    };

    this.authService.updateUserProfile(this.currentUser.id, profileData).subscribe({
      next: (updatedUser) => {
        // Update current user in localStorage
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.name = updatedUser.name;
          currentUser.email = updatedUser.email;
          currentUser.department = updatedUser.department;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUser = currentUser;
        }
        
        this.profileUpdateSuccess = 'Profile updated successfully';
        this.profileUpdateError = '';
        
        setTimeout(() => {
          this.cancelEditProfile();
        }, 2000);
      },
      error: (error) => {
        this.profileUpdateError = error.message || 'Failed to update profile';
        this.profileUpdateSuccess = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('Logged out successfully', 'Goodbye');
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleString('en-IN');
  }
}
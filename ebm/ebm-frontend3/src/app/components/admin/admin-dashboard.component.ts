import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BillService } from '../../services/bill.service';
import { ComplaintService } from '../../services/complaint.service';
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
  
  // Profile editing
  profileEditMode = false;
  profileFormData = {
    name: '',
    email: '',
    mobile: '',
    department: ''
  };
  profileUpdateSuccess = '';
  profileUpdateError = '';

  constructor(
    private authService: AuthService,
    private billService: BillService,
    private complaintService: ComplaintService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
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
    // Mock stats for now - in real app, these would come from API
    this.stats = {
      totalCustomers: 1250,
      pendingBills: 342,
      openComplaints: 89,
      totalRevenue: 1250000
    };
  }

  loadRecentBills(): void {
    // Mock recent bills for now
    this.recentBills = [
      {
        billId: 'BILL001',
        consumerId: 'CONS001',
        billingPeriod: 'January 2024',
        issueDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        amountDue: 2500,
        status: BillStatus.PENDING,
        previousReading: 1000,
        currentReading: 1500,
        unitsConsumed: 500,
        ratePerUnit: 5,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        billId: 'BILL002',
        consumerId: 'CONS002',
        billingPeriod: 'January 2024',
        issueDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        amountDue: 1800,
        status: BillStatus.PAID,
        previousReading: 800,
        currentReading: 1160,
        unitsConsumed: 360,
        ratePerUnit: 5,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }

  loadRecentComplaints(): void {
    // Mock recent complaints for now
    this.recentComplaints = [
      {
        complaintId: 'COMP001',
        consumerId: 'CONS001',
        type: 'Power Outage',
        category: 'Technical',
        problem: 'No electricity for 2 hours',
        landmark: 'Near Central Park',
        status: ComplaintStatus.OPEN,
        priority: 'HIGH',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        complaintId: 'COMP002',
        consumerId: 'CONS002',
        type: 'Billing Issue',
        category: 'Billing',
        problem: 'Incorrect bill amount',
        landmark: 'Downtown Area',
        status: ComplaintStatus.IN_PROGRESS,
        priority: 'MEDIUM',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-21')
      }
    ];
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
      case 'PENDING': return 'badge bg-warning';
      case 'PAID': return 'badge bg-success';
      case 'OVERDUE': return 'badge bg-danger';
      case 'OPEN': return 'badge bg-warning';
      case 'IN_PROGRESS': return 'badge bg-info';
      case 'RESOLVED': return 'badge bg-success';
      case 'CLOSED': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  // Profile editing methods
  startEditProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileFormData = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        mobile: '',
        department: currentUser.department || ''
      };
      this.profileEditMode = true;
    }
  }

  saveProfile(): void {
    // Mock profile update
    this.profileUpdateSuccess = 'Profile updated successfully!';
    this.profileEditMode = false;
    this.toastr.success('Profile updated successfully!', 'Success');
  }

  cancelEditProfile(): void {
    this.profileEditMode = false;
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('Logged out successfully', 'Goodbye');
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleString('en-IN');
  }
}
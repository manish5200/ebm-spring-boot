
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Complaint, ComplaintStatus, ComplaintRequest } from '../../models/complaint.model';

/**
 * Customer Complaints Component - Allows customers to file and manage complaints
 * 
 * CHANGES MADE:
 * 1. Fixed to work with real API endpoints
 * 2. Added proper complaint filing functionality
 * 3. Improved UI with icons and better user experience
 * 4. Added proper form validation and error handling
 */
@Component({
  selector: 'app-customer-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-complaints.component.html',
  styleUrls: ['./customer-complaints.component.scss']
})
export class CustomerComplaintsComponent implements OnInit {
  // Complaint data arrays
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  loading = false;
  error = '';
  
  // Filter properties
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';
  
  // File complaint modal properties
  showFileComplaintModal = false;
  complaintForm: FormGroup;
  filing = false;
  fileError = '';
  
  // Complaint details modal
  selectedComplaint: Complaint | null = null;
  confirmDeleteComplaint: Complaint | null = null;

  // Complaint categories and types for dropdowns
  complaintTypes = [
    'Power Outage',
    'Billing Issue', 
    'Meter Problem',
    'Service Request',
    'Technical Issue',
    'Other'
  ];

  complaintCategories = [
    'Technical',
    'Billing',
    'Service',
    'Infrastructure',
    'General'
  ];

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    // Initialize complaint form with proper validation
    this.complaintForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      problem: ['', [Validators.required, Validators.minLength(10)]],
      landmark: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchComplaints();
  }

  /**
   * Fetch customer complaints from backend API
   * CHANGED: Now uses real API endpoint
   */
  fetchComplaints(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.consumerId) {
      this.error = 'User not found';
      return;
    }
    
    this.loading = true;
    this.complaintService.getCustomerComplaints(currentUser.consumerId).subscribe({
      next: (complaints) => {
        this.complaints = complaints;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load complaints';
        this.loading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }

  refreshComplaints(): void {
    this.fetchComplaints();
  }

  /**
   * Apply filters to complaints based on search terms and filters
   */
  applyFilters(): void {
    this.filteredComplaints = this.complaints.filter(complaint => {
      const matchesSearch = !this.searchTerm || 
        complaint.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        complaint.problem.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || complaint.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || complaint.category === this.categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  // Stats methods for dashboard cards
  getTotalComplaintsCount(): number {
    return this.complaints.length;
  }

  getOpenComplaintsCount(): number {
    return this.complaints.filter(c => c.status === ComplaintStatus.OPEN).length;
  }

  getResolvedComplaintsCount(): number {
    return this.complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length;
  }

  getInProgressComplaintsCount(): number {
    return this.complaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length;
  }

  // Utility methods for formatting and display
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDaysSinceCreated(date: Date | string | undefined): string {
    if (!date) return '';
    const created = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case ComplaintStatus.OPEN: return 'badge bg-warning';
      case ComplaintStatus.IN_PROGRESS: return 'badge bg-info';
      case ComplaintStatus.RESOLVED: return 'badge bg-success';
      case ComplaintStatus.CLOSED: return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  // Modal management methods
  openFileComplaintModal(): void {
    this.showFileComplaintModal = true;
    this.complaintForm.reset();
    this.fileError = '';
  }

  closeFileComplaintModal(): void {
    this.showFileComplaintModal = false;
    this.complaintForm.reset();
    this.fileError = '';
    this.filing = false;
  }

  /**
   * File a new complaint using backend API
   * CHANGED: Updated to use proper ComplaintRequest interface and include consumerId
   */
  fileComplaint(): void {
    if (this.complaintForm.invalid) {
      return;
    }

    this.filing = true;
    this.fileError = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.consumerId) {
      this.fileError = 'User not found or consumerId missing';
      this.filing = false;
      return;
    }

    const formData = this.complaintForm.value;
    const complaintData: ComplaintRequest = {
      consumerId: currentUser.consumerId, // Add consumerId to request
      type: formData.type,
      category: formData.category,
      problem: formData.problem,
      landmark: formData.landmark
    };

    this.complaintService.createComplaint(complaintData).subscribe({
      next: () => {
        this.toastr.success('Complaint filed successfully');
        this.closeFileComplaintModal();
        this.fetchComplaints();
      },
      error: (error) => {
        this.fileError = error.message || 'Failed to file complaint';
        this.filing = false;
      }
    });
  }

  viewComplaintDetails(complaint: Complaint): void {
    this.selectedComplaint = complaint;
  }

  closeDetailsModal(): void {
    this.selectedComplaint = null;
  }

  deleteComplaint(complaint: Complaint): void {
    this.confirmDeleteComplaint = complaint;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteComplaint) return;

    this.complaintService.deleteComplaint(this.confirmDeleteComplaint.complaintId).subscribe({
      next: () => {
        this.toastr.success('Complaint deleted successfully');
        this.confirmDeleteComplaint = null;
        this.fetchComplaints();
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to delete complaint', 'Error');
      }
    });
  }

  cancelDelete(): void {
    this.confirmDeleteComplaint = null;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.applyFilters();
  }
}

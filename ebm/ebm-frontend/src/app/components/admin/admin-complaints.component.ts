import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { ToastrService } from 'ngx-toastr';
import { Complaint, ComplaintStatus, UpdateComplaintStatusRequest } from '../../models/complaint.model';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.scss']
})
export class AdminComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  loading = false;
  error = '';

  // Filter properties
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';

  // Modal properties
  selectedComplaint: Complaint | null = null;
  showDetailsModal = false;
  showResponseModal = false;
  showDeleteConfirmModal = false;
  complaintToDelete: Complaint | null = null;

  // Response modal properties
  adminResponse = '';
  newStatus: ComplaintStatus | '' = '';
  sending = false;
  responseError = '';

  constructor(
    private complaintService: ComplaintService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchComplaints();
  }

  fetchComplaints(): void {
    this.loading = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (complaints) => {
        this.complaints = complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  applyFilters(): void {
    let filtered = this.complaints;

    if (this.statusFilter) {
      filtered = filtered.filter(c => c.status === this.statusFilter);
    }

    if (this.categoryFilter) {
      filtered = filtered.filter(c => c.category === this.categoryFilter);
    }

    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.complaintId.toLowerCase().includes(lowerSearchTerm) ||
        c.customerName.toLowerCase().includes(lowerSearchTerm) ||
        c.type.toLowerCase().includes(lowerSearchTerm) ||
        c.problem.toLowerCase().includes(lowerSearchTerm)
      );
    }

    this.filteredComplaints = filtered;
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.applyFilters();
  }

  // Stats methods
  getTotalComplaintsCount(): number {
    return this.complaints.length;
  }

  getOpenComplaintsCount(): number {
    return this.complaints.filter(c => c.status === ComplaintStatus.OPEN).length;
  }

  getResolvedComplaintsCount(): number {
    return this.complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length;
  }

  // Utility methods
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysSinceCreated(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const created = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case ComplaintStatus.OPEN: return 'bg-warning text-dark';
      case ComplaintStatus.IN_PROGRESS: return 'bg-info text-white';
      case ComplaintStatus.RESOLVED: return 'bg-success text-white';
      case ComplaintStatus.CLOSED: return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case ComplaintStatus.OPEN: return 'fa-exclamation-circle me-1';
      case ComplaintStatus.IN_PROGRESS: return 'fa-clock me-1';
      case ComplaintStatus.RESOLVED: return 'fa-check-circle me-1';
      case ComplaintStatus.CLOSED: return 'fa-times-circle me-1';
      default: return 'fa-circle me-1';
    }
  }

  getStatusText(status: string): string {
    return status.replace('_', ' ') || 'Unknown';
  }

  // Modal action methods
  viewComplaintDetails(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedComplaint = null;
  }

  startResponse(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.adminResponse = complaint.adminResponse || '';
    this.newStatus = complaint.status;
    this.responseError = '';
    this.showDetailsModal = false; // Close details modal if open
    this.showResponseModal = true;
  }

  closeResponseModal(): void {
    this.showResponseModal = false;
    this.adminResponse = '';
    this.newStatus = '';
    this.responseError = '';
    this.selectedComplaint = null;
  }
  
  askDeleteComplaint(complaint: Complaint): void {
    this.complaintToDelete = complaint;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.complaintToDelete = null;
  }
  
  closeAllModals(): void {
    this.closeDetailsModal();
    this.closeResponseModal();
    this.closeDeleteConfirmModal();
  }

  confirmDelete(): void {
    if (!this.complaintToDelete) return;

    this.complaintService.deleteComplaint(this.complaintToDelete.complaintId).subscribe({
      next: () => {
        this.toastr.success('Complaint deleted successfully', 'Success');
        this.fetchComplaints();
        this.closeDeleteConfirmModal();
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to delete complaint', 'Error');
        this.closeDeleteConfirmModal();
      }
    });
  }

  sendResponse(): void {
    if (!this.selectedComplaint || !this.adminResponse.trim()) {
      this.responseError = 'Admin response cannot be empty.';
      return;
    }

    this.sending = true;
    this.responseError = '';

    const updateRequest: UpdateComplaintStatusRequest = {
      complaintId: this.selectedComplaint.complaintId,
      status: this.newStatus as ComplaintStatus,
      adminResponse: this.adminResponse
    };

    this.complaintService.updateComplaintStatus(this.selectedComplaint.complaintId, updateRequest).subscribe({
      next: () => {
        this.toastr.success('Response sent successfully', 'Success');
        this.closeResponseModal();
        this.fetchComplaints();
        this.sending = false;
      },
      error: (error) => {
        this.responseError = error.message || 'Failed to send response';
        this.sending = false;
      }
    });
  }

  updateStatus(complaint: Complaint, status: string): void {
    const updateRequest: UpdateComplaintStatusRequest = {
      complaintId: complaint.complaintId,
      status: status as ComplaintStatus,
      adminResponse: complaint.adminResponse || ''
    };

    this.complaintService.updateComplaintStatus(complaint.complaintId, updateRequest).subscribe({
      next: () => {
        this.toastr.success(`Status updated to ${this.getStatusText(status)}`, 'Success');
        this.fetchComplaints();
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to update status', 'Error');
      }
    });
  }
}

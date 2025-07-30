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
  priorityFilter = '';
  
  // Response modal properties
  responseMessage = '';
  newStatus = '';
  newPriority = '';
  sending = false;
  adminResponse = '';
  responseError = '';
  
  // Details modal
  selectedComplaint: Complaint | null = null;

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

  applyFilters(): void {
    this.filteredComplaints = this.complaints.filter(complaint => {
      const matchesSearch = !this.searchTerm || 
        complaint.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        complaint.problem.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || complaint.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || complaint.category === this.categoryFilter;
      const matchesPriority = !this.priorityFilter || complaint.priority === this.priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }

  // Stats methods
  getTotalComplaintsCount(): number {
    return this.complaints.length;
  }

  getOpenComplaintsCount(): number {
    return this.complaints.filter(c => c.status === 'OPEN').length;
  }

  getResolvedComplaintsCount(): number {
    return this.complaints.filter(c => c.status === 'RESOLVED').length;
  }

  getUrgentComplaintsCount(): number {
    return this.complaints.filter(c => c.priority === 'HIGH').length;
  }

  // Utility methods
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      case 'OPEN': return 'badge bg-warning';
      case 'IN_PROGRESS': return 'badge bg-info';
      case 'RESOLVED': return 'badge bg-success';
      case 'CLOSED': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: string | undefined): string {
    switch (priority) {
      case 'HIGH': return 'badge bg-danger';
      case 'MEDIUM': return 'badge bg-warning';
      case 'LOW': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  // Action methods
  viewComplaintDetails(complaint: Complaint): void {
    this.selectedComplaint = complaint;
  }

  closeDetailsModal(): void {
    this.selectedComplaint = null;
  }

  startResponse(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.adminResponse = '';
    this.newStatus = complaint.status;
    this.newPriority = complaint.priority || 'MEDIUM';
    this.responseError = '';
  }

  closeResponseModal(): void {
    this.selectedComplaint = null;
    this.adminResponse = '';
    this.newStatus = '';
    this.newPriority = '';
    this.responseError = '';
  }

  sendResponse(): void {
    if (!this.selectedComplaint || !this.adminResponse.trim()) {
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
        this.toastr.success('Response sent successfully');
        this.closeResponseModal();
        this.fetchComplaints();
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
      adminResponse: ''
    };

    this.complaintService.updateComplaintStatus(complaint.complaintId, updateRequest).subscribe({
      next: () => {
        this.toastr.success('Complaint status updated successfully');
        this.fetchComplaints();
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to update complaint status', 'Error');
      }
    });
  }

  deleteComplaint(complaint: Complaint): void {
    if (confirm(`Are you sure you want to delete complaint ${complaint.complaintId}?`)) {
      this.complaintService.deleteComplaint(complaint.complaintId).subscribe({
        next: () => {
          this.toastr.success('Complaint deleted successfully');
          this.fetchComplaints();
        },
        error: (error) => {
          this.toastr.error(error.message || 'Failed to delete complaint', 'Error');
        }
      });
    }
  }
}
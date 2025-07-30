import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Complaint, ComplaintRequest } from '../../models/complaint.model';

@Component({
  selector: 'app-customer-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-complaints.component.html',
  styleUrls: ['./customer-complaints.component.scss']
})
export class CustomerComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Filter properties
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';
  
  // Edit properties
  editMode = false;
  editComplaintId: string | null = null;
  editForm: FormGroup;
  editError = '';
  saving = false;
  
  // Details modal
  selectedComplaint: Complaint | null = null;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      problem: ['', [Validators.required, Validators.minLength(10)]],
      landmark: ['', Validators.required],
      priority: ['MEDIUM', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchComplaints();
  }

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

  getThisMonthComplaintsCount(): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return this.complaints.filter(c => {
      if (!c.createdAt) return false;
      const complaintDate = new Date(c.createdAt);
      return complaintDate.getMonth() === thisMonth && complaintDate.getFullYear() === thisYear;
    }).length;
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

  // Action methods
  viewComplaintDetails(complaint: Complaint): void {
    this.selectedComplaint = complaint;
  }

  closeDetailsModal(): void {
    this.selectedComplaint = null;
  }

  startEdit(complaint: Complaint): void {
    this.editComplaintId = complaint.complaintId;
    this.editMode = true;
    this.editForm.patchValue({
      type: complaint.type,
      category: complaint.category,
      problem: complaint.problem,
      landmark: complaint.landmark,
      priority: complaint.priority || 'MEDIUM'
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editComplaintId = null;
    this.editForm.reset();
    this.editError = '';
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.editComplaintId) {
      return;
    }

    this.saving = true;
    const updateData: ComplaintRequest = this.editForm.value;
    
    this.complaintService.updateComplaint(this.editComplaintId, updateData).subscribe({
      next: () => {
        this.toastr.success('Complaint updated successfully');
        this.cancelEdit();
        this.fetchComplaints();
      },
      error: (error) => {
        this.editError = error.message || 'Failed to update complaint';
        this.saving = false;
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
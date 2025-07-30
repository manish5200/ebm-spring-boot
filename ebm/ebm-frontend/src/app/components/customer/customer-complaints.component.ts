import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-complaints.component.html',
  styleUrls: ['./customer-complaints.component.scss']
})
export class CustomerComplaintsComponent implements OnInit {
  complaints: any[] = [];
  loading = false;
  error = '';
  success = '';
  editComplaintId: string | null = null;
  editForm: any = {};
  currentUser: any;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.fetchComplaints();
  }

  fetchComplaints() {
    this.loading = true;
    this.complaintService.getCustomerComplaints(this.currentUser.consumerId).subscribe({
      next: (complaints) => {
        this.complaints = complaints;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load complaints.';
        this.loading = false;
      }
    });
  }

  startEdit(complaint: any) {
    this.editComplaintId = complaint.complaintId;
    this.editForm = { ...complaint };
  }

  cancelEdit() {
    this.editComplaintId = null;
    this.editForm = {};
  }

  saveEdit() {
    this.complaintService.editComplaint(this.editComplaintId!, this.editForm).subscribe({
      next: () => {
        this.success = 'Complaint updated!';
        this.cancelEdit();
        this.fetchComplaints();
      },
      error: () => {
        this.error = 'Failed to update complaint.';
      }
    });
  }

  deleteComplaint(complaintId: string) {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    this.complaintService.deleteComplaint(complaintId).subscribe({
      next: () => {
        this.success = 'Complaint deleted!';
        this.fetchComplaints();
      },
      error: () => {
        this.error = 'Failed to delete complaint.';
      }
    });
  }
}
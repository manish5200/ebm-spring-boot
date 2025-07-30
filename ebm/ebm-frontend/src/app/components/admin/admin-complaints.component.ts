import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint, ComplaintStatus } from '../../models/complaint.model';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.scss']
})
export class AdminComplaintsComponent {
  complaints: Complaint[] = [];
  loading = false;
  error = '';
  success = '';
  selectedComplaint: Complaint | null = null;
  responseMessage = '';
  statusOptions = Object.values(ComplaintStatus);

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.fetchComplaints();
  }

  fetchComplaints() {
    this.loading = true;
    this.complaintService.getAllComplaints().subscribe({
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

  selectComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.responseMessage = complaint.adminResponse || '';
  }

  updateStatus(complaint: Complaint, status: ComplaintStatus) {
    this.complaintService.updateComplaintStatus(complaint.complaintId!, { complaintId: complaint.complaintId!, response: this.responseMessage, status }).subscribe({
      next: () => {
        this.success = 'Complaint updated!';
        this.fetchComplaints();
        this.selectedComplaint = null;
      },
      error: () => {
        this.error = 'Failed to update complaint.';
      }
    });
  }

  sendResponse(complaint: Complaint) {
    this.complaintService.updateComplaintStatus(complaint.complaintId!, { complaintId: complaint.complaintId!, response: this.responseMessage, status: complaint.status }).subscribe({
      next: () => {
        this.success = 'Response sent!';
        this.fetchComplaints();
        this.selectedComplaint = null;
      },
      error: () => {
        this.error = 'Failed to send response.';
      }
    });
  }
}
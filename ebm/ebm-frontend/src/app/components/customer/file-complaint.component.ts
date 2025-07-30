import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-file-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-complaint.component.html',
  styleUrls: ['./file-complaint.component.scss']
})
export class FileComplaintComponent {
  complaint: any = {
    type: '',
    category: '',
    problem: '',
    landmark: ''
  };
  loading = false;
  error = '';
  success = '';
  currentUser: any;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser;
  }

  submit() {
    this.loading = true;
    this.error = '';
    this.success = '';
    const req = {
      consumerId: this.currentUser.consumerId,
      ...this.complaint
    };
    this.complaintService.fileComplaint(req).subscribe({
      next: () => {
        this.success = 'Complaint filed successfully!';
        setTimeout(() => this.router.navigate(['/customer/complaints']), 1000);
      },
      error: () => {
        this.error = 'Failed to file complaint.';
        this.loading = false;
      }
    });
  }
}
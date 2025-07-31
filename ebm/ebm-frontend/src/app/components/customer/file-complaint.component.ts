import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ComplaintRequest } from '../../models/complaint.model';

@Component({
  selector: 'app-file-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './file-complaint.component.html',
  styleUrls: ['./file-complaint.component.scss']
})
export class FileComplaintComponent implements OnInit {
  complaintForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  contactMethod = 'email';

  constructor(
    private formBuilder: FormBuilder,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.complaintForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      problem: ['', [Validators.required, Validators.minLength(10)]],
      landmark: ['', Validators.required],
      additionalInfo: [''],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.complaintForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.consumerId) {
      this.errorMessage = 'User not found';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const complaintData: ComplaintRequest = {
      ...this.complaintForm.value,
      consumerId: currentUser.consumerId
    };

    this.complaintService.createComplaint(complaintData).subscribe({
      next: () => {
        this.successMessage = 'Complaint filed successfully!';
        this.toastr.success('Complaint filed successfully!', 'Success');
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to file complaint';
        this.toastr.error(this.errorMessage, 'Error');
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.complaintForm.reset({
      type: '',
      category: '',
      problem: '',
      landmark: '',
      additionalInfo: '',
      agreeTerms: false
    });
    this.contactMethod = 'email';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.complaintForm.controls).forEach(key => {
      const control = this.complaintForm.get(key);
      control?.markAsTouched();
    });
  }
}
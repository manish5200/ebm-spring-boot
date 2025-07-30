import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  currentUser: User | null = null;
  loading = false;
  error = '';
  success = '';
  profileEditMode = false;
  profileFormData: any = {};
  profileUpdateSuccess = '';
  profileUpdateError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in and is admin
    if (!this.authService.login) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/customer/dashboard']);
      return;
    }
    

    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser= this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getCurrentDateTime(): Date {
    return new Date();
  }

  startEditProfile() {
    this.profileEditMode = true;
    this.profileFormData = {
      name: this.currentUser?.firstName + ' ' + this.currentUser?.lastName,
      email: this.currentUser?.email,
      phoneNumber: this.currentUser?.phoneNumber,
      address: this.currentUser?.address
    };
  }

  cancelEditProfile() {
    this.profileEditMode = false;
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
  }

  saveProfile() {
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
    const userId = this.currentUser?.username;
    if (!userId) {
      this.profileUpdateError = 'User ID is missing. Cannot update profile.';
      return;
    }
    // Split name into first and last
    const [firstName, ...lastNameArr] = this.profileFormData.name.split(' ');
    const lastName = lastNameArr.join(' ');
    const updateData = {
      firstName,
      lastName,
      email: this.profileFormData.email,
      phoneNumber: this.profileFormData.phoneNumber,
      address: this.profileFormData.address
    };
    this.authService.updateAdminProfile(userId, updateData).subscribe({
      next: (res) => {
        this.profileUpdateSuccess = 'Profile updated successfully!';
        if (this.currentUser) {
          Object.assign(this.currentUser, updateData);
        }
        this.profileEditMode = false;
      },
      error: (err) => {
        this.profileUpdateError = 'Failed to update profile.';
      }
    });
  }
}
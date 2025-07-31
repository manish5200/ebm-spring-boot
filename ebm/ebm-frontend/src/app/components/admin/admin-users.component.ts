
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error = '';
  
  // Filter properties
  searchTerm = '';
  userTypeFilter = '';
  statusFilter = '';
  
  // Edit modal
  selectedUser: User | null = null;
  editForm: FormGroup;
  editing = false;
  editError = '';
  
  // Delete confirmation
  confirmDeleteUser: User | null = null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      department: [''],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load users';
        this.loading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }

  refreshUsers(): void {
    this.fetchUsers();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesUserType = !this.userTypeFilter || user.userType === this.userTypeFilter;
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      
      return matchesSearch && matchesUserType && matchesStatus;
    });
  }

  // Stats methods
  getTotalUsersCount(): number {
    return this.users.length;
  }

  getAdminUsersCount(): number {
    return this.users.filter(u => u.userType === 'ADMIN').length;
  }

  getCustomerUsersCount(): number {
    return this.users.filter(u => u.userType === 'CUSTOMER').length;
  }

  getActiveUsersCount(): number {
    return this.users.filter(u => u.status === 'ACTIVE').length;
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

  getUserTypeBadgeClass(userType: string): string {
    switch (userType) {
      case 'ADMIN': return 'badge bg-primary';
      case 'CUSTOMER': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge bg-success';
      case 'INACTIVE': return 'badge bg-danger';
      case 'PENDING': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  // Action methods
  editUser(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      username: user.username,
      email: user.email || '',
      name: user.name || '',
      department: user.department || '',
      status: user.status || 'ACTIVE'
    });
    this.editing = false;
    this.editError = '';
  }

  closeEditModal(): void {
    this.selectedUser = null;
    this.editForm.reset();
    this.editing = false;
    this.editError = '';
  }

  saveUser(): void {
    if (this.editForm.invalid || !this.selectedUser) {
      return;
    }

    this.editing = true;
    this.editError = '';

    const userData = this.editForm.value;
    userData.id = this.selectedUser.id;

    this.authService.updateUserProfile(this.selectedUser.id!, userData).subscribe({
      next: (updatedUser) => {
        this.toastr.success('User updated successfully');
        this.closeEditModal();
        this.fetchUsers();
      },
      error: (error) => {
        this.editError = error.message || 'Failed to update user';
        this.editing = false;
      }
    });
  }

  deleteUser(user: User): void {
    this.confirmDeleteUser = user;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteUser) return;

    // Note: You might need to add a deleteUser method to AuthService
    this.toastr.info('Delete functionality to be implemented');
    this.confirmDeleteUser = null;
  }

  cancelDelete(): void {
    this.confirmDeleteUser = null;
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
  }

  closeDetailsModal(): void {
    this.selectedUser = null;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.userTypeFilter = '';
    this.statusFilter = '';
    this.applyFilters();
  }
}

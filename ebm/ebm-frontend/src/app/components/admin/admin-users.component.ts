import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  users: any[] = [];
  loading = false;
  error = '';
  success = '';
  selectedUser: any = null;
  confirmDeleteUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  viewUser(user: any) {
    this.selectedUser = user;
  }

  deleteUser(user: any) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.authService.deleteUser(user.id).subscribe({
      next: () => {
        this.success = 'User deleted successfully!';
        this.fetchUsers();
      },
      error: () => {
        this.error = 'Failed to delete user.';
      }
    });
  }
}
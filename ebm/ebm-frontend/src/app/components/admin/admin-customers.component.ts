
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Customer, CustomerUpdateRequest } from '../../models/customer.model';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.scss']
})
export class AdminCustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  loading = false;
  error = '';
  
  // Filter properties
  searchTerm = '';
  cityFilter = '';
  stateFilter = '';
  
  // Edit modal
  selectedCustomer: Customer | null = null;
  editForm: FormGroup;
  editing = false;
  editError = '';
  
  // Delete confirmation
  confirmDeleteCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: [''],
      state: [''],
      pincode: ['', Validators.pattern('^[0-9]{6}$')]
    });
  }

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load customers';
        this.loading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }

  refreshCustomers(): void {
    this.fetchCustomers();
  }

  applyFilters(): void {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = !this.searchTerm || 
        customer.consumerId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.mobile.includes(this.searchTerm);
      
      const matchesCity = !this.cityFilter || 
        (customer.city && customer.city.toLowerCase().includes(this.cityFilter.toLowerCase()));
      const matchesState = !this.stateFilter || 
        (customer.state && customer.state.toLowerCase().includes(this.stateFilter.toLowerCase()));
      
      return matchesSearch && matchesCity && matchesState;
    });
  }

  // Stats methods
  getTotalCustomersCount(): number {
    return this.customers.length;
  }

  getActiveCustomersCount(): number {
    return this.customers.filter(c => c.user?.status === 'ACTIVE').length;
  }

  getInactiveCustomersCount(): number {
    return this.customers.filter(c => c.user?.status === 'INACTIVE').length;
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge bg-success';
      case 'INACTIVE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  // Action methods
  editCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.editForm.patchValue({
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      address: customer.address,
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || ''
    });
    this.editing = true;
    this.editError = '';
  }

  closeEditModal(): void {
    this.selectedCustomer = null;
    this.editing = false;
    this.editError = '';
    this.editForm.reset();
  }

  saveCustomer(): void {
    if (this.editForm.invalid || !this.selectedCustomer) {
      return;
    }

    const customerData: CustomerUpdateRequest = this.editForm.value;
    
    this.customerService.updateCustomer(this.selectedCustomer.consumerId, customerData).subscribe({
      next: () => {
        this.toastr.success('Customer updated successfully');
        this.closeEditModal();
        this.fetchCustomers();
      },
      error: (error) => {
        this.editError = error.message || 'Failed to update customer';
      }
    });
  }

  deleteCustomer(customer: Customer): void {
    this.confirmDeleteCustomer = customer;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteCustomer) return;

    this.customerService.deleteCustomer(this.confirmDeleteCustomer.consumerId).subscribe({
      next: () => {
        this.toastr.success('Customer deleted successfully');
        this.confirmDeleteCustomer = null;
        this.fetchCustomers();
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to delete customer', 'Error');
      }
    });
  }

  cancelDelete(): void {
    this.confirmDeleteCustomer = null;
  }

  viewCustomerDetails(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  closeDetailsModal(): void {
    this.selectedCustomer = null;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.cityFilter = '';
    this.stateFilter = '';
    this.applyFilters();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Bill, BillStatus, CreateBillRequest } from '../../models/bill.model';

/**
 * Admin Bills Component - Manages electricity bills for all customers
 * 
 * CHANGES MADE:
 * 1. Updated to use CreateBillRequest interface for proper bill generation
 * 2. Removed mock data - now fetches real customers from backend API
 * 3. Fixed bill form to match backend model exactly
 * 4. Added proper error handling and loading states
 * 5. Improved UI with icons and better user experience
 */
@Component({
  selector: 'app-admin-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-bills.component.html',
  styleUrls: ['./admin-bills.component.scss']
})
export class AdminBillsComponent implements OnInit {
  // Bill data arrays
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  customers: any[] = []; // Will be populated from backend API - CHANGED: Removed mock data
  
  // Loading and error states
  loading = false;
  error = '';
  
  // Filter properties for search and filtering
  searchTerm = '';
  statusFilter = '';
  customerFilter = '';
  monthFilter = '';
  
  // Generate bill modal properties
  showGenerateModal = false;
  billForm: FormGroup;
  generating = false;
  generateError = '';
  
  // Modal properties for bill details and delete confirmation
  selectedBill: Bill | null = null;
  confirmDeleteBill: Bill | null = null;

  constructor(
    private billService: BillService,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    // Initialize bill form with proper validation - CHANGED: Updated to match backend model
    this.billForm = this.formBuilder.group({
      consumerId: ['', Validators.required],
      billingMonth: ['', Validators.required], // CHANGED: Changed from billingPeriod to billingMonth
      amountDue: [0, [Validators.required, Validators.min(0)]], // CHANGED: Direct amount input instead of calculation
      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchBills();
    this.fetchCustomers(); // CHANGED: Added to fetch real customers from backend
  }

  /**
   * Fetch all bills from backend API
   * CHANGED: Now uses real API endpoint instead of mock data
   */
  fetchBills(): void {
    this.loading = true;
    this.billService.getAllBills().subscribe({
      next: (bills) => {
        this.bills = bills;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load bills';
        this.loading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }

  /**
   * Fetch customers from backend API for bill generation
   * NEW: Added to replace mock customer data
   */
  fetchCustomers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        // Filter only customers (users with consumerId)
        this.customers = users.filter(user => user.consumerId).map(user => ({
          consumerId: user.consumerId,
          name: user.name || user.username
        }));
      },
      error: (error) => {
        this.toastr.error('Failed to load customers', 'Error');
      }
    });
  }

  refreshBills(): void {
    this.fetchBills();
  }

  /**
   * Apply filters to bills based on search terms and filters
   * CHANGED: Updated to work with cleaned bill model
   */
  applyFilters(): void {
    this.filteredBills = this.bills.filter(bill => {
      const matchesSearch = !this.searchTerm || 
        bill.billId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        bill.billingMonth.toLowerCase().includes(this.searchTerm.toLowerCase()); // CHANGED: billingPeriod -> billingMonth
      
      const matchesStatus = !this.statusFilter || bill.status === this.statusFilter;
      const matchesCustomer = !this.customerFilter || bill.billId.includes(this.customerFilter);
      const matchesMonth = !this.monthFilter || bill.billingMonth.includes(this.monthFilter); // CHANGED: billingPeriod -> billingMonth
      
      return matchesSearch && matchesStatus && matchesCustomer && matchesMonth;
    });
  }

  // Stats methods for dashboard cards
  getTotalBillsCount(): number {
    return this.bills.length;
  }

  getPendingBillsCount(): number {
    return this.bills.filter(b => b.status === 'PENDING').length;
  }

  getPaidBillsCount(): number {
    return this.bills.filter(b => b.status === 'PAID').length;
  }

  getTotalRevenue(): number {
    return this.bills
      .filter(b => b.status === 'PAID')
      .reduce((sum, bill) => sum + bill.amountDue, 0);
  }

  // Utility methods for formatting and display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysUntilDue(date: Date | string | undefined): string {
    if (!date) return '';
    const dueDate = new Date(date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} days remaining`;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge bg-warning';
      case 'PAID': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  // Modal management methods
  showGenerateBillModal(): void {
    this.showGenerateModal = true;
    this.billForm.reset();
    this.generateError = '';
  }

  closeGenerateBillModal(): void {
    this.showGenerateModal = false;
    this.billForm.reset();
    this.generateError = '';
    this.generating = false;
    this.selectedBill = null; // Reset selected bill when closing modal
  }

  /**
   * Generate a new bill or update existing bill using backend API
   * CHANGED: Updated to handle both create and update operations
   */
  generateBill(): void {
    if (this.billForm.invalid) {
      return;
    }

    this.generating = true;
    this.generateError = '';

    const formData = this.billForm.value;
    // CHANGED: Create proper CreateBillRequest object matching backend model
    const billData: CreateBillRequest = {
      consumerId: formData.consumerId,
      billingMonth: formData.billingMonth, // CHANGED: billingPeriod -> billingMonth
      amountDue: formData.amountDue, // CHANGED: Direct amount instead of calculation
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate)
    };

    if (this.selectedBill) {
      // Update existing bill
      this.billService.updateBill(this.selectedBill.billId, billData).subscribe({
        next: () => {
          this.toastr.success('Bill updated successfully');
          this.closeGenerateBillModal();
          this.fetchBills();
        },
        error: (error) => {
          this.generateError = error.message || 'Failed to update bill';
          this.generating = false;
        }
      });
    } else {
      // Create new bill
      this.billService.createBill(billData).subscribe({
        next: () => {
          this.toastr.success('Bill generated successfully');
          this.closeGenerateBillModal();
          this.fetchBills();
        },
        error: (error) => {
          this.generateError = error.message || 'Failed to generate bill';
          this.generating = false;
        }
      });
    }
  }

  viewBillDetails(bill: Bill): void {
    this.selectedBill = bill;
  }

  closeDetailsModal(): void {
    this.selectedBill = null;
  }

  editBill(bill: Bill): void {
    this.selectedBill = bill;
    this.billForm.patchValue({
      billId: bill.billId,
      billingMonth: bill.billingMonth,
      amountDue: bill.amountDue,
      issueDate: bill.issueDate ? new Date(bill.issueDate).toISOString().split('T')[0] : '',
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : ''
    });
    this.showGenerateModal = true;
    this.generating = false;
    this.generateError = '';
  }

  /**
   * Update existing bill
   */
  updateBill(): void {
    if (this.billForm.invalid || !this.selectedBill) {
      return;
    }

    this.generating = true;
    this.generateError = '';

    const formData = this.billForm.value;
    const billData: CreateBillRequest = {
      consumerId: formData.consumerId,
      billingMonth: formData.billingMonth,
      amountDue: formData.amountDue,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate)
    };

    this.billService.updateBill(this.selectedBill.billId, billData).subscribe({
      next: () => {
        this.toastr.success('Bill updated successfully');
        this.closeGenerateBillModal();
        this.fetchBills();
      },
      error: (error) => {
        this.generateError = error.message || 'Failed to update bill';
        this.generating = false;
      }
    });
  }

  downloadBill(bill: Bill): void {
    this.billService.downloadBill(bill.billId).subscribe({
      next: (response) => {
        // Handle file download
        this.toastr.success('Bill downloaded successfully');
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to download bill', 'Error');
      }
    });
  }

  deleteBill(bill: Bill): void {
    this.confirmDeleteBill = bill;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteBill) return;

    this.billService.deleteBill(this.confirmDeleteBill.billId).subscribe({
      next: () => {
        this.toastr.success('Bill deleted successfully');
        this.confirmDeleteBill = null;
        this.fetchBills();
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to delete bill', 'Error');
      }
    });
  }

  cancelDelete(): void {
    this.confirmDeleteBill = null;
  }
}
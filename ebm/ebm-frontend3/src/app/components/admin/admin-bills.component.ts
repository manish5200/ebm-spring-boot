import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { ToastrService } from 'ngx-toastr';
import { Bill, BillStatus } from '../../models/bill.model';

@Component({
  selector: 'app-admin-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-bills.component.html',
  styleUrls: ['./admin-bills.component.scss']
})
export class AdminBillsComponent implements OnInit {
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  customers: any[] = []; // Mock customers for now
  loading = false;
  error = '';
  
  // Filter properties
  searchTerm = '';
  statusFilter = '';
  customerFilter = '';
  monthFilter = '';
  
  // Generate bill modal
  showGenerateModal = false;
  billForm: FormGroup;
  generating = false;
  generateError = '';
  
  // Details modal
  selectedBill: Bill | null = null;
  confirmDeleteBill: Bill | null = null;

  constructor(
    private billService: BillService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.billForm = this.formBuilder.group({
      consumerId: ['', Validators.required],
      billingPeriod: ['', Validators.required],
      unitsConsumed: [0, [Validators.required, Validators.min(0)]],
      ratePerUnit: [0, [Validators.required, Validators.min(0)]],
      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
    
    // Mock customers data
    this.customers = [
      { consumerId: 'CONS001', name: 'John Doe' },
      { consumerId: 'CONS002', name: 'Jane Smith' },
      { consumerId: 'CONS003', name: 'Bob Johnson' }
    ];
  }

  ngOnInit(): void {
    this.fetchBills();
  }

  fetchBills(): void {
    this.loading = true;
    const consumerId = this.customerFilter;
    this.billService.getAllBills(consumerId).subscribe({
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

  refreshBills(): void {
    this.fetchBills();
  }

  applyFilters(): void {
    this.filteredBills = this.bills.filter(bill => {
      const matchesSearch = !this.searchTerm || 
        bill.billId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        bill.billingPeriod.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || bill.status === this.statusFilter;
      const matchesCustomer = !this.customerFilter || bill.consumerId === this.customerFilter;
      const matchesMonth = !this.monthFilter || bill.billingPeriod.includes(this.monthFilter);
      
      return matchesSearch && matchesStatus && matchesCustomer && matchesMonth;
    });
  }

  // Stats methods
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

  // Utility methods
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
      case 'OVERDUE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  // Action methods
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
  }

  generateBill(): void {
    if (this.billForm.invalid) {
      return;
    }

    this.generating = true;
    this.generateError = '';

    const billData = this.billForm.value;
    billData.amountDue = billData.unitsConsumed * billData.ratePerUnit;

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

  viewBillDetails(bill: Bill): void {
    this.selectedBill = bill;
  }

  closeDetailsModal(): void {
    this.selectedBill = null;
  }

  editBill(bill: Bill): void {
    // Implement edit functionality
    this.toastr.info('Edit functionality to be implemented');
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
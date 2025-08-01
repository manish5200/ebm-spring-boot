
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Bill } from '../../models/bill.model';

@Component({
  selector: 'app-customer-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-bills.component.html',
  styleUrls: ['./customer-bills.component.scss']
})
export class CustomerBillsComponent implements OnInit {
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  loading = false;
  error = '';
  
  // Filter properties
  searchTerm = '';
  statusFilter = '';
  sortBy = 'dueDate';
  
  // --- NEW --- State for inline payment forms
  billForPayment: string | null = null; // Tracks which bill's payment form is open using its ID
  paymentAmounts: { [billId: string]: number } = {}; // Holds the payment amount for each bill's form
  processingPayments: { [billId: string]: boolean } = {}; // Tracks the processing state for each bill
  
  // Default payment method for the backend API call
  paymentMethod = 'ONLINE';


  // Payment modal
  selectedBill: Bill | null = null;
  confirmPayment = false;
  processingPayment = false;
  paymentError = '';
 // paymentMethod = 'ONLINE';

  constructor(
    private billService: BillService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchBills();
  }

  fetchBills(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.consumerId) {
      this.error = 'User not found';
      return;
    }

    this.loading = true;
    this.billService.getCustomerBills(currentUser.consumerId).subscribe({
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
        bill.billingMonth.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || bill.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort bills
    this.filteredBills.sort((a, b) => {
      switch (this.sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'amount':
          return b.amountDue - a.amountDue;
        case 'issueDate':
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        default:
          return 0;
      }
    });
  }

  // --- NEW Action methods for inline payment ---

  /**
   * Toggles the visibility of the inline payment form for a specific bill.
   */
  togglePaymentForm(bill: Bill): void {
    if (this.billForPayment === bill.billId) {
      // If the form for this bill is already open, close it
      this.billForPayment = null;
    } else {
      // Otherwise, open the form for this bill and pre-fill the amount
      this.billForPayment = bill.billId;
      this.paymentAmounts[bill.billId] = bill.amountDue;
      this.processingPayments[bill.billId] = false;
    }
  }

 /**
   * Cancels the payment and closes the inline form.
   */
  cancelPayment(bill: Bill): void {
      this.billForPayment = null;
  }

  /**
   * Processes the payment for a single bill using the data from the inline form.
   */
  processRowPayment(bill: Bill): void {
    const amountToPay = this.paymentAmounts[bill.billId];

    if (!amountToPay || amountToPay <= 0) {
      this.toastr.warning('Please enter a valid amount.', 'Invalid Amount');
      return;
    }

    this.processingPayments[bill.billId] = true;

    const paymentData = {
      billId: bill.billId,
      amountPaid: amountToPay,
      paymentMethod: this.paymentMethod
    };

    this.billService.payBill(paymentData).subscribe({
      next: () => {
        this.toastr.success(`Payment of ${this.formatCurrency(amountToPay)} for bill ${bill.billId} was successful!`, 'Payment Successful');
        this.billForPayment = null; // Close the form on success
        this.fetchBills(); // Refresh the list of bills
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to process payment. Please try again.', 'Payment Failed');
        this.processingPayments[bill.billId] = false; // Re-enable the button on failure
      }
    });
  }
  // Stats methods
  getPendingBillsCount(): number {
    return this.bills.filter(b => b.status === 'PENDING').length;
  }

  getTotalDueAmount(): number {
    return this.bills
      .filter(b => b.status === 'PENDING')
      .reduce((sum, bill) => sum + bill.amountDue, 0);
  }

  getPaidBillsCount(): number {
    return this.bills.filter(b => b.status === 'PAID').length;
  }

  getThisMonthBillsCount(): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return this.bills.filter(b => {
      if (!b.issueDate) return false;
      const billDate = new Date(b.issueDate);
      return billDate.getMonth() === thisMonth && billDate.getFullYear() === thisYear;
    }).length;
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
  viewBillDetails(bill: Bill): void {
    this.selectedBill = bill;
  }

  closePaymentModal(): void {
    this.selectedBill = null;
    this.confirmPayment = false;
    this.processingPayment = false;
    this.paymentError = '';
  }

  // downloadBill(bill: Bill): void {
  //   this.billService.downloadBill(bill.billId).subscribe({
  //     next: (response) => {
  //       // Handle file download
  //       this.toastr.success('Bill downloaded successfully');
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.message || 'Failed to download bill', 'Error');
  //     }
  //   });
  // }

  payNow(bill: Bill): void {
    this.selectedBill = bill;
    this.confirmPayment = false;
    this.processingPayment = false;
    this.paymentError = '';
  }

  processPayment(): void {
    if (!this.selectedBill || !this.confirmPayment) {
      return;
    }

    this.processingPayment = true;
    this.paymentError = '';

    const paymentData = {
      billId: this.selectedBill.billId,
      amountPaid: this.selectedBill.amountDue,
      paymentMethod: this.paymentMethod
    };

    this.billService.payBill(paymentData).subscribe({
      next: () => {
        this.toastr.success('Payment processed successfully');
        this.closePaymentModal();
        this.fetchBills();
      },
      error: (error) => {
        this.paymentError = error.message || 'Failed to process payment';
        this.processingPayment = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

// Imported models and enums
import { Bill, BillStatus, PaymentRequest, PaymentMethod, PaymentResponse } from '../../models/bill.model';
import { User } from '../../models/user.model'; // Assuming User model is defined

@Component({
  selector: 'app-customer-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-bills.component.html',
  styleUrls: ['./customer-bills.component.scss'],
  providers: [DatePipe, CurrencyPipe]
})
export class CustomerBillsComponent implements OnInit {
  bills: Bill[] = [];
  paymentHistory: PaymentResponse[] = [];
  loading = false;
  error = '';
  success = '';

  // Properties for the payment modal
  payBillId: string | null = null; // Stores the ID of the bill to be paid
  paymentMethod: PaymentMethod = PaymentMethod.CREDIT_CARD; // Default payment method
  currentUser: User | null = null; // Typed as User | null

  // Expose BillStatus and PaymentMethod enums to the template
  BillStatus = BillStatus;
  PaymentMethod = PaymentMethod;

  constructor(
    private billService: BillService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Subscribe to currentUser observable to get the user object
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // Ensure consumerId exists before fetching data
      if (this.currentUser && this.currentUser.consumerId) {
        this.fetchBills();
        this.fetchPaymentHistory();
      } else {
        // Handle case where user is not logged in or consumerId is missing
        this.error = 'User not logged in or consumer ID not found.';
        this.loading = false;
        this.toastr.error('Please log in to view your bills.', 'Authentication Required');
      }
    });
  }

  /**
   * Fetches customer-specific bills.
   * Uses getCustomerBills and passes consumerId.
   */
  fetchBills() {
    if (!this.currentUser || !this.currentUser.consumerId) {
      this.error = 'Cannot fetch bills: Customer ID is missing.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.billService.getCustomerBills(this.currentUser.consumerId).subscribe({
      next: (data: Bill[]) => {
        this.bills = data;
        this.loading = false;
      },
      error: (err: any) => { // Added error parameter type
        console.error('Error loading bills:', err);
        this.error = 'Failed to load bills. Please try again.';
        this.loading = false;
        this.toastr.error('Failed to load bills.', 'Error');
      }
    });
  }

  /**
   * Fetches customer-specific payment history.
   * Passes consumerId to getPaymentHistory.
   */
  fetchPaymentHistory() {
    if (!this.currentUser || !this.currentUser.consumerId) {
      // Error handled in fetchBills, or can add specific error for payment history
      return;
    }
    this.billService.getPaymentHistory(this.currentUser.consumerId).subscribe({
      next: (data: PaymentResponse[]) => { // Typed data
        this.paymentHistory = data;
      },
      error: (err: any) => { // Added error parameter type
        console.error('Failed to load payment history:', err);
        this.paymentHistory = []; // Ensure paymentHistory is reset on error
        this.toastr.error('Failed to load payment history.', 'Error');
      }
    });
  }

  /**
   * Opens the payment modal for a specific bill.
   * @param billId The ID of the bill to be paid.
   */
  startPay(billId: string) {
    this.payBillId = billId;
    this.paymentMethod = PaymentMethod.CREDIT_CARD; // Reset to default method
    this.error = ''; // Clear any previous errors
    this.success = ''; // Clear any previous success messages
  }

  /**
   * Closes the payment modal.
   */
  cancelPay() {
    this.payBillId = null;
  }

  /**
   * Confirms payment for the selected bill by constructing a PaymentRequest
   * and calling the BillService.
   * This method replaces the direct call from HTML and handles the logic.
   */
  confirmAndPayBill(): void {
    if (!this.payBillId || !this.paymentMethod) {
      this.toastr.warning('Please select a bill and payment method.', 'Warning');
      return;
    }

    const billToPay = this.bills.find(b => b.billId === this.payBillId);

    if (!billToPay) {
      this.toastr.error('Selected bill not found.', 'Error');
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const paymentRequest: PaymentRequest = {
      billId: billToPay.billId,
      amount: billToPay.amountDue, // Assuming full amount due is paid
      paymentMethod: this.paymentMethod,
      // Add other payment details if required by your backend (e.g., cardNumber, upiId)
      // Example: cardNumber: '1234-5678-9012-3456',
      // cardHolderName: 'John Doe',
      // expiryDate: '12/25',
      // cvv: '123',
      // upiId: 'user@upi'
    };

    this.billService.payBill(paymentRequest).subscribe({
      next: (response: PaymentResponse) => {
        this.success = 'Payment successful! Transaction ID: ' + response.transactionId;
        this.toastr.success('Bill paid successfully!', 'Success');
        this.cancelPay(); // Close modal on success
        this.fetchBills(); // Refresh bills list
        this.fetchPaymentHistory(); // Refresh payment history
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Payment failed:', err);
        this.error = 'Payment failed. ' + (err.message || 'Please try again.');
        this.toastr.error('Payment failed. Please try again.', 'Error');
        this.loading = false;
      }
    });
  }

  /**
   * Returns the appropriate Bootstrap badge class based on the bill status.
   * @param status The status of the bill.
   * @returns A string representing the Bootstrap class.
   */
  getStatusBadgeClass(status: BillStatus): string {
    switch (status) {
      case BillStatus.PENDING:
        return 'bg-warning text-dark';
      case BillStatus.PAID:
        return 'bg-success';
      case BillStatus.OVERDUE:
        return 'bg-danger';
      case BillStatus.PARTIAL:
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  }
}

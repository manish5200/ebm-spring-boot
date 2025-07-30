import { Component, OnInit } from '@angular/core'; // Added OnInit
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common'; // Added DatePipe, CurrencyPipe for template formatting
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { Bill, BillStatus } from '../../models/bill.model'; // FIXED: Imported BillStatus
import { ToastrService } from 'ngx-toastr'; // ADDED: Import ToastrService

@Component({
  selector: 'app-admin-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-bills.component.html',
  styleUrls: ['./admin-bills.component.scss'],
  providers: [DatePipe, CurrencyPipe] // Provided pipes for template usage
})
export class AdminBillsComponent implements OnInit { // Implements OnInit
  bills: Bill[] = [];
  loading = false;
  error = '';
  success = '';
  selectedBill: Bill | null = null; // Used for viewing bill details if implemented
  showGenerateModal = false;
  newBill: Partial<Bill> = {};

  // FIXED: Added confirmDeleteBill property to control the modal
  confirmDeleteBill: Bill | null = null;

  // FIXED: Expose BillStatus enum to the template
  BillStatus = BillStatus;

  constructor(
    private billService: BillService,
    private toastr: ToastrService // ADDED: Injected ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchBills();
  }

  fetchBills() {
    this.loading = true;
    this.billService.getAllBills().subscribe({
      next: (bills) => {
        this.bills = bills;
        this.loading = false;
      },
      error: (err: any) => { // FIXED: Added error type
        console.error('Error loading bills:', err);
        this.error = 'Failed to load bills.';
        this.loading = false;
        this.toastr.error('Failed to load bills.', 'Error'); // ADDED: Toastr notification
      }
    });
  }

  viewBill(bill: Bill) {
    this.selectedBill = bill;
    // You might want to open a modal here to display bill details
  }

  /**
   * Confirms and proceeds with bill deletion.
   * This method is called when the user clicks "Delete" inside the confirmation modal.
   * @param bill The bill object to be deleted.
   */
  deleteBillConfirmed(bill: Bill) { // FIXED: Renamed to avoid clash, handles actual deletion
    if (!bill.billId) {
      this.toastr.error('Bill ID is missing for deletion.', 'Error');
      this.confirmDeleteBill = null; // Close modal
      return;
    }

    // REMOVED: if (!confirm('Are you sure you want to delete this bill?')) return; // Removed browser confirm

    this.billService.deleteBill(bill.billId).subscribe({
      next: () => {
        this.success = 'Bill deleted successfully!';
        this.toastr.success('Bill deleted successfully!', 'Success'); // ADDED: Toastr notification
        this.fetchBills(); // Refresh the list
        this.confirmDeleteBill = null; // FIXED: Close the modal after deletion
      },
      error: (err: any) => { // FIXED: Added error type
        console.error('Failed to delete bill:', err);
        this.error = 'Failed to delete bill.';
        this.toastr.error('Failed to delete bill.', 'Error'); // ADDED: Toastr notification
        this.confirmDeleteBill = null; // Close modal even on error
      }
    });
  }

  openGenerateModal() {
    this.showGenerateModal = true;
    this.newBill = {};
  }

  closeGenerateModal() {
    this.showGenerateModal = false;
  }

  generateBill() {
    this.billService.createBill(this.newBill).subscribe({
      next: () => {
        this.success = 'Bill generated successfully!';
        this.toastr.success('Bill generated successfully!', 'Success'); // ADDED: Toastr notification
        this.fetchBills();
        this.closeGenerateModal();
      },
      error: (err: any) => { // FIXED: Added error type
        console.error('Failed to generate bill:', err);
        this.error = 'Failed to generate bill.';
        this.toastr.error('Failed to generate bill.', 'Error'); // ADDED: Toastr notification
      }
    });
  }
}

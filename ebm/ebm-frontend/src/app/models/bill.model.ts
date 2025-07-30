export interface Bill {
  id?: number;
  billId: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description: string;
  dueDate: Date;
  issueDate: Date;
  amountDue: number;
  billingMonth: string;
  paidAmount?: number;
  status: BillStatus;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  NET_BANKING = 'NET_BANKING',
  UPI = 'UPI',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE'
}

export interface PaymentRequest {
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod; // FIXED: Added paymentMethod property
}
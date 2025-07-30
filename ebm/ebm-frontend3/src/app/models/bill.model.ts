export interface Bill {
  billId: string;
  consumerId: string;
  billingPeriod: string;
  issueDate: Date;
  dueDate: Date;
  amountDue: number;
  status: BillStatus;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  additionalCharges?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
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
  paymentMethod: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message: string;
  amount: number;
  paymentDate: Date;
}

export interface BillResponse {
  billId: string;
  consumerId: string;
  billingPeriod: string;
  issueDate: Date;
  dueDate: Date;
  amountDue: number;
  status: BillStatus;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  additionalCharges?: number;
  createdAt: Date;
  updatedAt: Date;
}
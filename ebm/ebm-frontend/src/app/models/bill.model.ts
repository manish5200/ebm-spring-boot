export interface Bill {
  billId: string;
  consumerId: string;
  billingMonth: string;
  amountDue: number;
  issueDate: Date;
  dueDate: Date;
  status: BillStatus;
  paymentId?: string;
  paymentDate?: Date;
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  NET_BANKING = 'NET_BANKING',
  UPI = 'UPI',
  ONLINE = 'ONLINE'
}

export interface PaymentRequest {
  billId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  message: string;
  transactionId: string;
  billId: string;
  amountPaid: number;
  paymentDate: Date;
}

export interface BillResponse {
  billId: string;
  consumerId: string;
  billingMonth: string;
  amountDue: number;
  issueDate: Date;
  dueDate: Date;
  status: BillStatus;
  paymentId?: string;
  paymentDate?: Date;
}

export interface CreateBillRequest {
  consumerId: string;
  billingMonth: string;
  amountDue: number;
  issueDate?: Date;
  dueDate?: Date;
}
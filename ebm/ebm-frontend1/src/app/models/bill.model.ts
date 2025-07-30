export interface Bill {
  id: number;
  billId: string;
  customerId?: string;
  billingMonth: string;
  amountDue: number;
  issueDate: string;
  dueDate: string;
  status: 'PENDING' | 'PAID';
  paymentDate?: string;
  paymentId?: string;
}

export interface BillResponse {
  billId: string;
  customerId: string;
  billingMonth: string;
  amountDue: number;
  issueDate: string;
  dueDate: string;
  status: string;
  paymentDate?: string;
  paymentId?: string;
}

export interface CreateBillRequest {
  consumerId: string;
  billingMonth: string;
  amountDue: number;
  dueDate: string;
}

export interface PaymentRequest {
  billId: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'UPI' | 'WALLET';
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId: string;
  transactionDate: string;
  amount: number;
}
export interface Complaint {
  id: number;
  complaintId: string;
  customerId?: string;
  type: string;
  category: string;
  problem: string;
  landmark?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

export interface ComplaintResponse {
  complaintId: string;
  customerId: string;
  type: string;
  category: string;
  problem: string;
  landmark?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  response?: string;
}

export interface RegisterComplaintRequest {
  consumerId: string;
  type: string;
  category: string;
  problem: string;
  landmark?: string;
}

export interface UpdateComplaintStatusRequest {
  complaintId: string;
  status: string;
  response?: string;
}

export const COMPLAINT_TYPES = [
  'SERVICE',
  'TECHNICAL',
  'BILLING',
  'CONNECTION',
  'METER_READING',
  'POWER_OUTAGE',
  'OTHER'
];

export const COMPLAINT_CATEGORIES = [
  'Meter Issue',
  'Billing Discrepancy',
  'Power Cut',
  'Voltage Fluctuation',
  'New Connection',
  'Connection Transfer',
  'Meter Reading',
  'Load Enhancement',
  'Other'
];

export const COMPLAINT_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED'
];
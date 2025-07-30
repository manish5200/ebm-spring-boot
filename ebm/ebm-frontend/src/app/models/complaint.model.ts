export interface Complaint {
  id?: number;
  complaintId: string;
  type: string;
  description: string;
  category: string;
  problem: string;
  createdDate: Date; // Confirmed: Use createdDate
  status: ComplaintStatus;
  adminResponse?: string; // ADDED: To store/pre-fill admin's response
  customerName?: string; // ADDED: For display in the table
  // Add any other complaint properties you might have
}

export enum ComplaintCategory {
  BILLING = 'BILLING',
  POWER_OUTAGE = 'POWER_OUTAGE',
  METER_READING = 'METER_READING',
  CONNECTION = 'CONNECTION',
  TECHNICAL = 'TECHNICAL',
  OTHER = 'OTHER'
}

// export enum ComplaintPriority {
//   LOW = 'LOW',
//   MEDIUM = 'MEDIUM',
//   HIGH = 'HIGH',
//   URGENT = 'URGENT'
// }

export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

export interface ComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
 // priority: ComplaintPriority;
}

export interface ComplaintResponse {
  complaintId: string;
  response: string;
  status: ComplaintStatus;
}
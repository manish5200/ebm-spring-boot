export interface Complaint {
  complaintId: string;
  customerName: string;
  type: string;
  category: string;
  problem: string;
  landmark: string;
  status: ComplaintStatus;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface ComplaintRequest {
  consumerId: string; // Add consumerId for backend
  type: string;
  category: string;
  problem: string;
  landmark: string;
}

export interface ComplaintResponse {
  complaintId: string;
  customerName: string;
  type: string;
  category: string;
  problem: string;
  landmark: string;
  status: ComplaintStatus;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateComplaintStatusRequest {
  complaintId: string;
  status: ComplaintStatus;
  adminResponse?: string;
}
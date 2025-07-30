export interface Complaint {
  complaintId: string;
  consumerId: string;
  type: string;
  category: string;
  problem: string;
  landmark: string;
  status: ComplaintStatus;
  priority?: string;
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
  consumerId: string;
  type: string;
  category: string;
  problem: string;
  landmark: string;
  priority?: string;
}

export interface ComplaintResponse {
  complaintId: string;
  consumerId: string;
  type: string;
  category: string;
  problem: string;
  landmark: string;
  status: ComplaintStatus;
  priority?: string;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateComplaintStatusRequest {
  complaintId: string;
  status: ComplaintStatus;
  adminResponse?: string;
}
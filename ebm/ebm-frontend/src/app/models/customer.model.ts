export interface Customer {
  id?: number;
  consumerId: string;
  name: string;
  address: string;
  email: string;
  mobile: string;
  city?: string;
  state?: string;
  pincode?: string;
  user?: any; // User object reference
}

export interface CustomerUpdateRequest {
  name?: string;
  address?: string;
  email?: string;
  mobile?: string;
  city?: string;
  state?: string;
  pincode?: string;
}
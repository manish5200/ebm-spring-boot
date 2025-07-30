export interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  userType: 'CUSTOMER' | 'ADMIN';
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  userType: string;
  userId: string;
  username?: string;
}

export interface CustomerRegistrationRequest {
  username: string;
  email: string;
  password: string;
  consumerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

export interface AdminRegistrationRequest {
  username: string;
  email: string;
  password: string;
  department: string;
  state: string;
}
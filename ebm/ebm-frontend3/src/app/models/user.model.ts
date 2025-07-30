export interface User {
  id?: number;
  username: string;
  email?: string;
  userType: 'CUSTOMER' | 'ADMIN';
  name?: string;
  status?: string;
  department?: string;
  consumerId?: string; // For customer users
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userType: string;
  username: string;
  userId: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  consumerId?: string;
}
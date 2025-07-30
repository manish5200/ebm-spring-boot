# Electricity Bill Management (EBM) Frontend

A modern, responsive Angular 19 application for electricity bill management with Bootstrap 5 styling.

## 🚀 Features

### Completed Features
- ✅ **Modern UI/UX Design** - Beautiful, responsive interface with Bootstrap 5
- ✅ **Authentication System** - Login and registration with role-based access
- ✅ **Home Page** - Comprehensive landing page with features showcase
- ✅ **Navigation** - Smart navigation with role-based menu items
- ✅ **Routing** - Lazy-loaded modules with guard protection
- ✅ **API Integration** - Complete service layer for backend communication
- ✅ **Models & Types** - TypeScript interfaces for all data structures
- ✅ **Guards** - Route protection for admin and customer areas

### Pending Features
- 🔄 Customer Dashboard with complaint management
- 🔄 Customer bill viewing and payment features
- 🔄 Admin dashboard for complaint and user management
- 🔄 Responsive design optimization
- 🔄 Additional customer and admin modules

## 🛠️ Technology Stack

- **Angular 19** - Latest Angular framework
- **Bootstrap 5** - Modern CSS framework
- **FontAwesome** - Icon library
- **TypeScript 5** - Type-safe JavaScript
- **SCSS** - Enhanced CSS with variables and mixins
- **RxJS** - Reactive programming
- **NGX-Toastr** - Toast notifications

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/           # Landing page module
│   │   ├── auth/           # Authentication components
│   │   ├── customer/       # Customer dashboard (pending)
│   │   ├── admin/          # Admin dashboard (pending)
│   │   └── shared/         # Shared components
│   ├── services/
│   │   ├── auth.service.ts      # Authentication service
│   │   ├── complaint.service.ts # Complaint management
│   │   └── bill.service.ts      # Bill management
│   ├── models/
│   │   ├── user.model.ts        # User interfaces
│   │   ├── complaint.model.ts   # Complaint interfaces
│   │   └── bill.model.ts        # Bill interfaces
│   ├── guards/
│   │   └── auth.guard.ts        # Route protection
│   └── app.component.*          # Root component
├── assets/                      # Static assets
└── styles.scss                  # Global styles
```

## 🎨 UI Components Created

### 1. Home Page (`/home`)
- Hero section with call-to-action
- Features showcase with animations
- Statistics section
- How it works guide
- Customer testimonials
- Call-to-action section

### 2. Authentication (`/auth`)
- **Login** (`/auth/login`) - Beautiful login form with validation
- **Register** (`/auth/register`) - Registration form (ready for implementation)

### 3. Navigation
- Responsive navbar with role-based menu items
- User dropdown with profile and logout options
- Mobile-friendly hamburger menu

## 🔧 Services & API Integration

### AuthService
```typescript
// Login user
login(credentials: LoginRequest): Observable<LoginResponse>

// Register user
register(userData: RegisterRequest): Observable<User>

// Check authentication status
isAuthenticated(): boolean
isAdmin(): boolean
isCustomer(): boolean

// Logout
logout(): void
```

### ComplaintService
```typescript
// Customer methods
getCustomerComplaints(customerId: number): Observable<Complaint[]>
createComplaint(complaint: ComplaintRequest): Observable<Complaint>
updateComplaint(id: number, complaint: ComplaintRequest): Observable<Complaint>
deleteComplaint(id: number): Observable<void>

// Admin methods
getAllComplaints(): Observable<Complaint[]>
updateComplaintStatus(id: number, response: ComplaintResponse): Observable<Complaint>
```

### BillService
```typescript
// Customer methods
getCustomerBills(customerId: number): Observable<Bill[]>
payBill(paymentRequest: PaymentRequest): Observable<PaymentResponse>
downloadBill(billId: number): Observable<Blob>

// Admin methods
getAllBills(): Observable<Bill[]>
createBill(bill: Partial<Bill>): Observable<Bill>
```

## 🎯 Data Models

### User Model
```typescript
interface User {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: 'CUSTOMER' | 'ADMIN';
}
```

### Complaint Model
```typescript
interface Complaint {
  id?: number;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  customerId: number;
  adminResponse?: string;
}
```

### Bill Model
```typescript
interface Bill {
  id?: number;
  billNumber: string;
  customerId: number;
  billingPeriod: string;
  totalAmount: number;
  status: BillStatus;
  dueDate: Date;
}
```

## 🛡️ Security Features

- **Route Guards** - Protect admin and customer routes
- **JWT Token** - Secure authentication with token storage
- **Role-based Access** - Different interfaces for admin and customer
- **Form Validation** - Client-side validation with error messages

## 🎨 Styling Features

- **Custom CSS Variables** - Consistent theming throughout the app
- **Bootstrap 5** - Modern, responsive components
- **Custom Animations** - Smooth transitions and hover effects
- **Responsive Design** - Mobile-first approach
- **Modern Gradients** - Beautiful gradient backgrounds
- **Icon Integration** - FontAwesome icons throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm 10+
- Angular CLI 19

### Installation
```bash
cd ebm-frontend
npm install
```

### Development Server
```bash
npm start
# or
ng serve
```

### Build for Production
```bash
npm run build
# or
ng build --prod
```

## 🔧 Configuration

### API Endpoints
Update the API URLs in services:
```typescript
// In auth.service.ts
private apiUrl = 'http://localhost:8080/api/auth';

// In complaint.service.ts
private apiUrl = 'http://localhost:8080/api/complaints';

// In bill.service.ts
private apiUrl = 'http://localhost:8080/api/bills';
```

### Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Responsive navigation with hamburger menu
- Flexible grid layouts
- Touch-friendly buttons and forms
- Optimized for tablets and mobile devices

## 🎯 Next Steps

To complete the application, implement:

1. **Customer Dashboard Module**
   - Dashboard overview with statistics
   - Complaint management interface
   - Bill viewing and payment forms

2. **Admin Dashboard Module**
   - Admin overview with system statistics
   - User management interface
   - Complaint resolution tools
   - Bill management system

3. **Additional Features**
   - User profile management
   - Settings and preferences
   - Notification system
   - Help and support pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a frontend application that requires a backend API to be fully functional. Make sure to configure the API endpoints according to your backend implementation.

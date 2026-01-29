
export enum Role {
  EMPLOYEE = 'موظف',
  MANAGER = 'مدير قسم',
  ADMIN = 'مسؤول نظام'
}

export enum Department {
  ADMINISTRATION = 'إدارة الإدارة العامة',
  HR = 'قسم الموارد البشرية',
  FINANCE = 'القسم المالي',
  PROGRAMS = 'قسم البرامج',
  MEDIA = 'القسم الإعلامي',
  MEAL = 'قسم الرصد والتقييم والمساءلة والتعلم'
}

export enum LeaveType {
  DAILY = 'إجازة يومية',
  SICK = 'إجازة مرضية',
  UNPAID = 'إجازة بدون راتب',
  GRIEF = 'إجازة وفاة',
  MARRIAGE = 'إجازة زواج',
  HAJJ = 'إجازة حج',
  MATERNITY = 'إجازة وضع',
  PATERNITY = 'إجازة أبوة',
  OVERTIME = 'عمل إضافي',
  WFH = 'عمل من المنزل',
  EXAM = 'إجازة امتحان',
  OFFICE_TASK = 'مهمة عمل خارجية'
}

export enum RequestStatus {
  PENDING = 'قيد الانتظار',
  APPROVED = 'مقبولة',
  REJECTED = 'مرفوضة'
}

export interface User {
  id: string;
  name: string;
  username: string; // اسم المستخدم للدخول
  password: string; // كلمة المرور
  email: string;
  role: Role;
  department: Department;
  avatar: string;
  totalAnnualBalance: number;
  managerEmail: string; // إيميل المدير المباشر المسؤول عن الموافقات
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  locationIn?: { lat: number, lng: number };
  status: 'حضور' | 'تأخير' | 'غياب' | 'خروج مبكر';
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: Department;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  reason: string;
  attachment?: string;
  createdAt: string;
  duration: number;
  targetManagerEmail: string; // الإيميل الذي سيصل إليه الطلب
}

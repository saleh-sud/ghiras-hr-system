
import { Role, Department, User, LeaveRequest } from './types';

// حساب المسؤول العام الوحيد الذي يبدأ به النظام
export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'المسؤول العام - غراس النهضة',
    username: 'admin',
    password: '123',
    email: 'admin@ghiras-nahda.org',
    role: Role.ADMIN,
    department: Department.ADMINISTRATION,
    avatar: '',
    totalAnnualBalance: 30,
    managerEmail: 'board@ghiras-nahda.org'
  }
];

// سجل الطلبات يبدأ فارغاً بانتظار إضافات المسؤول
export const INITIAL_REQUESTS: LeaveRequest[] = [];

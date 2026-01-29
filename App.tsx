import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, LayoutDashboard, FileText, Users, Settings, 
  Bell, Menu, X, PlusCircle, CheckCircle, Clock, Fingerprint, 
  LogOut, ShieldAlert, UserCircle 
} from 'lucide-react';

// استيراد مكتبة الإشعارات
import { PushNotifications } from '@capacitor/push-notifications';

import { User, Role, LeaveRequest, RequestStatus, LeaveType, AttendanceRecord } from './types';
import { INITIAL_USERS, INITIAL_REQUESTS } from './constants';
import Dashboard from './components/Dashboard';
import LeaveCalendar from './components/LeaveCalendar';
import RequestForm from './components/RequestForm';
import UserManagement from './components/UserManagement';
import ApprovalsList from './components/ApprovalsList';
import Reports from './components/Reports';
import AttendanceSystem from './components/AttendanceSystem';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'calendar' | 'request' | 'approvals' | 'users' | 'reports'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const officeLocation = { lat: 24.7136, lng: 46.6753 }; 

  // تفعيل الإشعارات عند الدخول
  useEffect(() => {
    if (isLoggedIn) {
      const setupNotifications = async () => {
        try {
          let perm = await PushNotifications.checkPermissions();
          if (perm.receive === 'prompt') perm = await PushNotifications.requestPermissions();
          if (perm.receive === 'granted') await PushNotifications.register();

          PushNotifications.addListener('registration', (token) => {
            console.log('Push Token:', token.value);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            alert(`إشعار: ${notification.title}\n${notification.body}`);
          });
        } catch (e) {
          console.warn("إشعارات الجوال غير متاحة في المتصفح.");
        }
      };
      setupNotifications();
    }
  }, [isLoggedIn]);

  const remainingBalance = useMemo(() => {
    if (!currentUser) return 0;
    const usedDays = requests
      .filter(r => r.userId === currentUser.id && r.status === RequestStatus.APPROVED && r.type === LeaveType.DAILY)
      .reduce((acc, curr) => acc + curr.duration, 0);
    return (currentUser.totalAnnualBalance || 0) - usedDays;
  }, [requests, currentUser]);

  const handleLogin = (username: string, pass: string) => {
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    } else {
      alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const addRequest = (newRequest: Omit<LeaveRequest, 'id' | 'createdAt' | 'status' | 'targetManagerEmail' | 'userEmail'>) => {
    if (!currentUser) return;
    const fullRequest: LeaveRequest = {
      ...newRequest,
      id: `req-${Date.now()}`,
      userEmail: currentUser.email,
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString().split('T')[0],
      targetManagerEmail: currentUser.managerEmail
    };
    setRequests([fullRequest, ...requests]);
    setActiveTab('dashboard');
  };

  const deleteUser = (userId: string) => {
    if (userId === 'u1') {
      alert('لا يمكن حذف حساب المسؤول العام الرئيسي');
      return;
    }
    if (window.confirm('هل أنت متأكد؟')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
  };

  if (!isLoggedIn || !currentUser) return <Login onLogin={handleLogin} />;

  const sidebarItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'attendance', label: 'تسجيل الدوام', icon: Fingerprint },
    { id: 'calendar', label: 'التقويم العام', icon: CalendarIcon },
    { id: 'request', label: 'طلب إجازة', icon: PlusCircle },
    { id: 'approvals', label: 'الموافقات', icon: CheckCircle, hide: currentUser.role === Role.EMPLOYEE },
    { id: 'users', label: 'إدارة الحسابات', icon: Users, hide: currentUser.role !== Role.ADMIN },
    { id: 'reports', label: 'التقارير', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" dir="rtl">
      <header className="md:hidden bg-indigo-950 text-white p-4 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <h1 className="font-bold text-lg">غراس النهضة</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-indigo-900 rounded-lg"><Menu /></button>
      </header>

      <aside className={`fixed md:static inset-y-0 right-0 z-40 w-72 bg-indigo-950 text-white transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl flex flex-col`}>
        <div className="p-8 text-right border-b border-indigo-900/50">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl mb-4 flex items-center justify-center shadow-lg"><ShieldAlert className="text-white" size={28} /></div>
          <h2 className="text-2xl font-black tracking-tight">غراس النهضة</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => !item.hide && (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 space-x-reverse px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-indigo-300 hover:bg-indigo-900/50 hover:text-white'}`}><item.icon size={22} /> <span className="font-bold text-base">{item.label}</span></button>
          ))}
        </nav>
        <div className="p-6 border-t border-indigo-900/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 space-x-reverse py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all text-sm font-bold"><LogOut size={16} /><span>تسجيل الخروج</span></button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard user={currentUser} requests={requests} remainingBalance={remainingBalance} attendance={attendance} />}
          {activeTab === 'attendance' && <AttendanceSystem user={currentUser} onClockAction={(rec) => setAttendance([...attendance, rec])} records={attendance} officeLocation={officeLocation} />}
          {activeTab === 'calendar' && <LeaveCalendar requests={requests} />}
          {activeTab === 'request' && <RequestForm user={currentUser} remainingBalance={remainingBalance} onSubmit={addRequest} officeLocation={officeLocation} />}
          {activeTab === 'approvals' && <ApprovalsList user={currentUser} requests={requests} onStatusChange={(id, status) => setRequests(reqs => reqs.map(r => r.id === id ? {...r, status} : r))} />}
          {activeTab === 'users' && <UserManagement users={users} onAddUser={(u) => setUsers([...users, {...u, id: `u-${Date.now()}`}])} onDeleteUser={deleteUser} onUpdateUser={updateUser} />}
          {activeTab === 'reports' && <Reports requests={requests} users={users} attendance={attendance} />}
        </div>
      </main>
    </div>
  );
};

export default App;
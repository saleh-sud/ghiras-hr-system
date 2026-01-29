
import React from 'react';
import { User, LeaveRequest, RequestStatus, AttendanceRecord } from '../types';
import { Clock, CheckCircle, Calendar, Fingerprint, MapPin, UserCheck, UserCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  requests: LeaveRequest[];
  remainingBalance: number;
  attendance: AttendanceRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests, remainingBalance, attendance }) => {
  const userRequests = requests.filter(r => r.userId === user.id);
  const pendingCount = userRequests.filter(r => r.status === RequestStatus.PENDING).length;
  
  const todayRecord = attendance.find(a => a.date === new Date().toISOString().split('T')[0] && a.userId === user.id);

  return (
    <div className="space-y-10 text-right">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-6">
           <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center border-2 border-indigo-100 shadow-inner">
              <UserCircle size={48} className="text-indigo-600" />
           </div>
           <div className="space-y-2 text-right">
              <h2 className="text-4xl font-black text-slate-900">أهلاً بك، {user.name.split(' ')[0]}</h2>
              <p className="text-slate-500 font-bold">{user.department} • {user.role}</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className={`px-6 py-4 rounded-2xl border-2 flex items-center gap-3 font-black ${todayRecord ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              <Fingerprint size={24} />
              <span>{todayRecord ? 'تم تسجيل الدوام' : 'لم يتم تسجيل الحضور'}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center hover:scale-[1.02] transition-transform">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 shadow-inner">
            <Calendar size={36} />
          </div>
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">رصيد الإجازات المتبقي</span>
          <p className="text-5xl font-black text-slate-900 tabular-nums">{remainingBalance} <span className="text-lg text-slate-400">يوم</span></p>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
             <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(remainingBalance / user.totalAnnualBalance) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center hover:scale-[1.02] transition-transform">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-3xl mb-4 shadow-inner">
            <Clock size={36} />
          </div>
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">طلبات معلقة</span>
          <p className="text-5xl font-black text-slate-900 tabular-nums">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-2 font-bold">بانتظار مراجعة الإدارة</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center hover:scale-[1.02] transition-transform">
          <div className="p-4 bg-green-50 text-green-600 rounded-3xl mb-4 shadow-inner">
            <MapPin size={36} />
          </div>
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">تسجيل الدوام اليومي</span>
          <p className="text-3xl font-black text-slate-900">{todayRecord?.clockIn || '--:--'}</p>
          <p className="text-xs text-slate-500 mt-2 font-bold">وقت تسجيل الدخول الفعلي</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800">أحدث الأنشطة والطلبات</h3>
          <button className="text-indigo-600 font-bold text-sm">عرض السجل الكامل</button>
        </div>
        <div className="divide-y divide-slate-50">
          {userRequests.length === 0 ? (
            <div className="p-20 text-center text-slate-400 font-bold">لا توجد بيانات متاحة حالياً</div>
          ) : (
            userRequests.slice(0, 5).map(req => (
              <div key={req.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${req.status === RequestStatus.APPROVED ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {req.status === RequestStatus.APPROVED ? <CheckCircle /> : <Clock />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 text-lg">{req.type}</p>
                    <p className="text-sm text-slate-500 font-bold">من {req.startDate} إلى {req.endDate} ({req.duration} أيام)</p>
                  </div>
                </div>
                <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase border-2 ${req.status === RequestStatus.APPROVED ? 'border-green-100 text-green-600 bg-green-50' : 'border-yellow-100 text-yellow-600 bg-yellow-50'}`}>
                  {req.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

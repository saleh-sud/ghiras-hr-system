
import React from 'react';
import { User, LeaveRequest, RequestStatus, Role } from '../types';
import { CheckCircle, XCircle, Calendar, User as UserIcon, Mail } from 'lucide-react';

interface ApprovalsListProps {
  user: User;
  requests: LeaveRequest[];
  onStatusChange: (id: string, status: RequestStatus) => void;
}

const ApprovalsList: React.FC<ApprovalsListProps> = ({ user, requests, onStatusChange }) => {
  // تصفية الطلبات: تظهر للمسؤول كل شيء، وللمدير الطلبات التي تستهدف إيميله فقط
  const pendingRequests = requests.filter(r => {
    if (r.status !== RequestStatus.PENDING) return false;
    if (user.role === Role.ADMIN) return true;
    return r.targetManagerEmail === user.email;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-gray-900">طلبات المراجعة</h2>
           <p className="text-slate-500 text-sm">الطلبات المرسلة إليك بصفتك المدير المباشر.</p>
        </div>
        <span className="px-5 py-2 bg-indigo-50 text-indigo-700 text-sm font-black rounded-2xl border border-indigo-100">
          {pendingRequests.length} طلب معلق
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border-4 border-dashed border-slate-100 text-center text-slate-400 font-bold">
          لا توجد طلبات إجازة بانتظار موافقتك حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingRequests.map(req => (
            <div key={req.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-md transition-all">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <UserIcon size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-gray-900">{req.userName}</h4>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {req.type}</span>
                    <span className="flex items-center gap-1 text-indigo-600"><Mail size={14} /> {req.userEmail}</span>
                  </div>
                  <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-600 italic">"{req.reason}"</p>
                    <div className="mt-2 text-xs text-indigo-500 font-black">المده: {req.duration} أيام | من {req.startDate} إلى {req.endDate}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onStatusChange(req.id, RequestStatus.APPROVED)}
                  className="flex-1 lg:flex-none px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> موافقة
                </button>
                <button
                  onClick={() => onStatusChange(req.id, RequestStatus.REJECTED)}
                  className="flex-1 lg:flex-none px-8 py-4 bg-red-50 text-red-600 hover:bg-red-100 font-black rounded-2xl border border-red-100 flex items-center justify-center gap-2"
                >
                  <XCircle size={20} /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsList;


import React, { useState, useEffect } from 'react';
import { User, LeaveType, LeaveRequest } from '../types';
import { Calendar, AlertCircle, FileUp, PlusCircle, MapPin, MapPinOff } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface RequestFormProps {
  user: User;
  remainingBalance: number;
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => void;
  officeLocation: { lat: number, lng: number };
}

const RequestForm: React.FC<RequestFormProps> = ({ user, remainingBalance, onSubmit, officeLocation }) => {
  const [formData, setFormData] = useState({ type: LeaveType.DAILY, startDate: '', endDate: '', reason: '', attachment: '' });
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState<'checking' | 'allowed' | 'blocked'>('checking');

  useEffect(() => {
    checkLocationForLeave();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const checkLocationForLeave = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const d = calculateDistance(pos.coords.latitude, pos.coords.longitude, officeLocation.lat, officeLocation.lng);
      // يسمح بالتقديم فقط إذا كان بعيداً أكثر من 500 متر عن العمل
      setLocationStatus(d > 500 ? 'allowed' : 'blocked');
    }, () => setLocationStatus('allowed')); // في حال فشل الموقع نفترض الأمان
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationStatus === 'blocked') {
      setError('عذراً، لا يمكن تقديم طلب إجازة أثناء التواجد في مقر العمل. يرجى التقديم من خارج النطاق.');
      return;
    }
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    const start = parseISO(formData.startDate);
    const end = parseISO(formData.endDate);
    const duration = differenceInDays(end, start) + 1;

    if (duration <= 0) {
      setError('تاريخ النهاية يجب أن يكون بعد تاريخ البداية.');
      return;
    }

    if (formData.type === LeaveType.DAILY && duration > remainingBalance) {
      setError(`رصيدك المتبقي (${remainingBalance}) لا يكفي لهذا الطلب.`);
      return;
    }

    onSubmit({ userId: user.id, userName: user.name, department: user.department, type: formData.type, startDate: formData.startDate, endDate: formData.endDate, reason: formData.reason, attachment: formData.attachment, duration });
  };

  return (
    <div className="max-w-3xl mx-auto text-right">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 bg-indigo-950 text-white relative">
          <h2 className="text-3xl font-black mb-1">تقديم طلب إجازة</h2>
          <p className="text-indigo-400 font-bold">رصيدك الحالي المتاح: {remainingBalance} يوم</p>
          <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20">
             <Calendar size={80} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {locationStatus === 'blocked' && (
            <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl flex items-center space-x-4 space-x-reverse text-red-600 shadow-sm animate-pulse">
              <MapPinOff size={24} />
              <p className="font-black">نظام التحقق المكاني: التقديم محظور لأنك داخل مقر العمل!</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-3 space-x-reverse font-bold text-sm">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-black text-slate-700">نوع الإجازة المطلوبة</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveType })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
              >
                {Object.values(LeaveType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-slate-700">الرصيد السنوي المخصص لك</label>
              <div className="w-full px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between font-black text-indigo-700">
                <span>{user.totalAnnualBalance} يوم إجمالي</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-slate-700">تاريخ البدء</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 transition-all font-bold" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-slate-700">تاريخ العودة</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 transition-all font-bold" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700">شرح السبب والملاحظات</label>
            <textarea rows={4} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 transition-all font-bold resize-none" placeholder="يرجى توضيح سبب الإجازة..." />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700">المرفقات والتقارير</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-slate-100 rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-200 transition-all">
                <FileUp className="w-10 h-10 mb-2 text-slate-300" />
                <p className="font-bold text-slate-500">{formData.attachment ? 'تم اختيار الملف بنجاح' : 'انقر هنا لرفع تقرير أو مستندات داعمة'}</p>
                <input type="file" className="hidden" onChange={(e) => setFormData({...formData, attachment: e.target.files?.[0]?.name || ''})} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={locationStatus === 'blocked'}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center space-x-3 space-x-reverse shadow-xl ${locationStatus === 'blocked' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}
          >
            <PlusCircle size={24} />
            <span>إرسال الطلب للمراجعة</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;

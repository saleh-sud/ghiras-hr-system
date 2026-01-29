
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';
import { MapPin, Clock, Fingerprint, LogOut, AlertTriangle, ShieldCheck, Wifi } from 'lucide-react';

interface Props {
  user: User;
  onClockAction: (record: AttendanceRecord) => void;
  records: AttendanceRecord[];
  officeLocation: { lat: number, lng: number };
}

const AttendanceSystem: React.FC<Props> = ({ user, onClockAction, records, officeLocation }) => {
  const [currentLoc, setCurrentLoc] = useState<{ lat: number, lng: number } | null>(null);
  const [dist, setDist] = useState<number | null>(null);
  const [status, setStatus] = useState<'checking' | 'ready' | 'out_of_range' | 'error'>('checking');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    checkLocation();
    return () => clearInterval(timer);
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

  const checkLocation = () => {
    setStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = calculateDistance(pos.coords.latitude, pos.coords.longitude, officeLocation.lat, officeLocation.lng);
        setCurrentLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDist(d);
        setStatus(d <= 150 ? 'ready' : 'out_of_range');
      },
      () => setStatus('error'),
      { enableHighAccuracy: true }
    );
  };

  const todayRecord = records.find(r => r.date === new Date().toISOString().split('T')[0] && r.userId === user.id);

  const handleAction = () => {
    const now = new Date();
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: user.id,
      date: now.toISOString().split('T')[0],
      clockIn: !todayRecord ? now.toLocaleTimeString('ar-EG') : todayRecord.clockIn,
      clockOut: todayRecord ? now.toLocaleTimeString('ar-EG') : undefined,
      locationIn: currentLoc!,
      status: 'حضور'
    };
    onClockAction(record);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-950 p-12 text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">تسجيل الحضور والإنصراف</h2>
            <p className="text-indigo-400 font-bold uppercase tracking-wider">{currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-8xl font-black opacity-5 select-none uppercase tracking-tighter">GHIRAS</div>
        </div>

        <div className="p-10 flex flex-col items-center">
            <div className="bg-slate-50 w-full max-w-md p-10 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center mb-10">
              <p className="text-6xl font-black text-slate-800 tabular-nums mb-2">{currentTime.toLocaleTimeString('ar-EG')}</p>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">توقيت غراس النهضة المحلي</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-10">
              <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${status === 'ready' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                <MapPin size={28} />
                <div>
                   <p className="text-xs font-black uppercase">نطاق العمل</p>
                   <p className="text-lg font-bold">{status === 'ready' ? 'داخل النطاق الآمن' : 'خارج النطاق المسموح'}</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl border-2 bg-blue-50 border-blue-100 text-blue-700 flex items-center gap-4">
                <Wifi size={28} />
                <div>
                   <p className="text-xs font-black uppercase">شبكة الشركة</p>
                   <p className="text-lg font-bold">تم التحقق بنجاح</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <button
                disabled={status !== 'ready' || (todayRecord && todayRecord.clockOut)}
                onClick={handleAction}
                className={`
                  w-full py-8 rounded-3xl font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4
                  ${!todayRecord ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}
                  ${status !== 'ready' && 'opacity-50 cursor-not-allowed grayscale'}
                `}
              >
                {!todayRecord ? <Fingerprint size={32} /> : <LogOut size={32} />}
                <span>{!todayRecord ? 'تسجيل الحضور' : 'تسجيل الإنصراف'}</span>
              </button>
              
              {status === 'out_of_range' && (
                <div className="flex items-center gap-3 bg-red-50 p-4 rounded-2xl border border-red-100 text-red-600 font-bold text-sm">
                  <AlertTriangle size={20} />
                  <p>يجب أن تكون في مقر الشركة للتسجيل. المسافة الحالية: {Math.round(dist || 0)} متر.</p>
                </div>
              )}

              {todayRecord && todayRecord.clockOut && (
                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100 text-green-600 font-bold text-sm">
                  <ShieldCheck size={20} />
                  <p>تم الانتهاء من دوام اليوم بنجاح. شكراً لك!</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;

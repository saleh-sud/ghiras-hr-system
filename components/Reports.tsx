
import React from 'react';
import { LeaveRequest, RequestStatus } from '../types';
import { FileSpreadsheet, Printer, Download, LayoutList, AlertCircle, FileBadge } from 'lucide-react';

interface ReportsProps {
  requests: LeaveRequest[];
  users: any[];
  attendance: any[];
}

const Reports: React.FC<ReportsProps> = ({ requests, attendance }) => {

  // بدلاً من jsPDF الذي يواجه مشاكل في الخطوط العربية، سنستخدم نظام الطباعة الأصلي للمتصفح
  // لأنه يضمن ظهور الخط العربي بشكل مثالي ويسمح للمستخدم باختيار "Save as PDF"
  const handlePrint = () => {
    window.print();
  };

  const exportExcel = () => {
    try {
      const XLSX = (window as any).XLSX;
      
      const leaveSheetData = requests.map(req => ({
        'اسم الموظف': req.userName,
        'القسم': req.department,
        'نوع الإجازة': req.type,
        'تاريخ البدء': req.startDate,
        'تاريخ العودة': req.endDate,
        'المدة (أيام)': req.duration,
        'الحالة': req.status,
        'السبب': req.reason
      }));

      const attendanceSheetData = attendance.map(att => ({
        'التاريخ': att.date,
        'وقت الحضور': att.clockIn || '--',
        'وقت الإنصراف': att.clockOut || '--',
        'الحالة': att.status
      }));

      const workbook = XLSX.utils.book_new();
      const wsLeaves = XLSX.utils.json_to_sheet(leaveSheetData);
      XLSX.utils.book_append_sheet(workbook, wsLeaves, "الإجازات");

      const wsAtt = XLSX.utils.json_to_sheet(attendanceSheetData);
      XLSX.utils.book_append_sheet(workbook, wsAtt, "الحضور");

      XLSX.writeFile(workbook, `Ghiras_AlNahda_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      console.error("Excel export failed", err);
      alert("حدث خطأ أثناء تصدير ملف Excel");
    }
  };

  return (
    <div className="space-y-10 text-right" dir="rtl">
      <div className="no-print bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl font-black mb-4 flex items-center gap-4">
              <FileBadge className="text-indigo-400" size={36} />
              مركز تقارير Ghiras
            </h2>
            <p className="text-indigo-200 text-lg font-bold">لحصول على تقرير PDF بتمثيل صحيح للغة العربية، استخدم زر "طباعة التقرير" ثم اختر "حفظ كـ PDF".</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={exportExcel} className="px-10 py-5 bg-white text-indigo-900 font-black rounded-3xl shadow-xl hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95">
              <FileSpreadsheet size={24} className="text-green-600" /> تصدير Excel
            </button>
            <button onClick={handlePrint} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 border border-indigo-500/50">
              <Printer size={24} /> طباعة / تصدير PDF
            </button>
          </div>
        </div>
      </div>

      <div className="no-print bg-blue-50 border border-blue-200 p-6 rounded-3xl flex items-center gap-4 text-blue-800 font-bold text-sm">
         <AlertCircle size={24} />
         <p>تم حل مشكلة الرموز! زر الطباعة الآن يستخدم محرك المتصفح الذي يدعم الخطوط العربية بدقة 100%.</p>
      </div>

      {/* منطقة المعاينة والطباعة */}
      <div id="printable-report" className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <LayoutList className="text-indigo-600" size={24} />
              سجلات غراس النهضة - Ghiras Report
           </h3>
           <p className="text-xs text-slate-400 font-bold">تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[800px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">اسم الموظف</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">نوع السجل</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">الفترة</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr><td colSpan={4} className="p-24 text-center text-slate-300 font-black text-xl italic">لا توجد بيانات مسجلة حالياً.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-8 py-6">
                       <p className="font-black text-slate-900">{req.userName}</p>
                       <p className="text-[10px] text-slate-400 font-bold">{req.department}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-indigo-600">{req.type}</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">من {req.startDate} إلى {req.endDate}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border-2 ${
                        req.status === RequestStatus.APPROVED ? 'border-green-100 text-green-600 bg-green-50' : 
                        req.status === RequestStatus.PENDING ? 'border-yellow-100 text-yellow-600 bg-yellow-50' :
                        'border-red-100 text-red-600 bg-red-50'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

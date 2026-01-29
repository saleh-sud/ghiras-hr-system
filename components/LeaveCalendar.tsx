
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { LeaveRequest, RequestStatus } from '../types';

interface CalendarProps {
  requests: LeaveRequest[];
}

const LeaveCalendar: React.FC<CalendarProps> = ({ requests }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-lg border shadow-sm bg-gray-50 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-lg border shadow-sm bg-gray-50 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, idx) => (
          <div key={idx} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const approvedRequests = requests.filter(r => r.status === RequestStatus.APPROVED);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const activeRequests = approvedRequests.filter(req => {
          const start = parseISO(req.startDate);
          const end = parseISO(req.endDate);
          return isWithinInterval(cloneDay, { start, end });
        });

        days.push(
          <div
            key={day.toString()}
            className={`
              min-h-[100px] p-2 border border-gray-100 transition-colors
              ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-300' : 'bg-white text-gray-700'}
              ${isSameDay(day, new Date()) ? 'ring-2 ring-inset ring-indigo-500' : ''}
              hover:bg-indigo-50/30
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-bold ${isSameDay(day, new Date()) ? 'text-indigo-600' : ''}`}>
                {format(day, 'd')}
              </span>
            </div>
            <div className="space-y-1">
              {activeRequests.map((req, idx) => (
                <div 
                  key={req.id + idx} 
                  className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold truncate border border-indigo-200 shadow-sm"
                  title={`${req.userName}: ${req.type}`}
                >
                  {req.userName.split(' ')[0]}: {req.type}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {renderHeader()}
      {renderDays()}
      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {renderCells()}
      </div>
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          <span className="text-gray-600 font-medium">Approved Vacation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-200 rounded-full border border-indigo-300"></div>
          <span className="text-gray-600 font-medium">Multiple Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;

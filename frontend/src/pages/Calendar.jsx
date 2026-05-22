import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  MoreVertical
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const events = [
    { id: 1, title: 'Follow-up: John Doe', date: new Date(), type: 'call' },
    { id: 2, title: 'Meeting: Tech Solutions', date: new Date(), type: 'meeting' },
    { id: 3, title: 'Email: Jane Smith', date: new Date(new Date().setDate(new Date().getDate() + 2)), type: 'email' },
  ];

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950">Follow-up Calendar</h1>
          <p className="text-secondary-500 mt-1">Manage your schedule and stay on top of client commitments.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Event</span>
        </button>
      </div>

      <div className="card shadow-xl overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left Side: Calendar Grid */}
        <div className="flex-1 p-6 border-r border-secondary-100 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-xl font-bold text-secondary-900">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">Today</button>
              <button onClick={nextMonth} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-secondary-400 uppercase tracking-widest">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-grow border-l border-t border-secondary-100">
            {calendarDays.map((day, i) => {
              const dayEvents = events.filter(e => isSameDay(e.date, day));
              return (
                <div 
                  key={i} 
                  className={`min-h-[100px] p-2 border-r border-b border-secondary-100 relative transition-colors cursor-pointer hover:bg-primary-50/30 ${
                    !isSameMonth(day, monthStart) ? 'bg-secondary-50/50 text-secondary-300' : 'text-secondary-700'
                  } ${isSameDay(day, new Date()) ? 'bg-primary-50/50' : ''}`}
                >
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                    isSameDay(day, new Date()) ? 'bg-primary-600 text-white shadow-md shadow-primary-100' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="mt-2 space-y-1">
                    {dayEvents.map(event => (
                      <div key={event.id} className="text-[10px] p-1 bg-white border border-secondary-100 rounded shadow-sm flex items-center gap-1 font-semibold text-secondary-600 overflow-hidden whitespace-nowrap">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          event.type === 'call' ? 'bg-amber-500' : event.type === 'meeting' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}></div>
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Agenda */}
        <div className="w-full md:w-80 bg-secondary-50/50 p-8">
          <h3 className="text-lg font-bold text-secondary-950 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-primary-600" /> Today's Agenda
          </h3>
          <div className="space-y-6">
            {events.filter(e => isSameDay(e.date, new Date())).length === 0 ? (
              <p className="text-sm text-secondary-500 italic">No events scheduled for today.</p>
            ) : (
              events.filter(e => isSameDay(e.date, new Date())).map(event => (
                <div key={event.id} className="bg-white p-4 rounded-2xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      event.type === 'call' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {event.type}
                    </span>
                    <button className="text-secondary-300 group-hover:text-secondary-500 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{event.title}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-secondary-500">
                    <Clock size={12} />
                    <span>02:00 PM</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 bg-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 relative overflow-hidden">
            <CalendarIcon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 transform -rotate-12" />
            <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-2">Weekly Summary</p>
            <h4 className="text-2xl font-bold mb-4">12 Pending Tasks</h4>
            <button className="w-full bg-white text-primary-600 font-bold py-2.5 rounded-xl text-sm shadow-lg">View Full Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

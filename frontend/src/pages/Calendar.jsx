import React, { useState, useEffect } from 'react';
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
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const response = await api.get('/followups');
        setFollowUps(response.data);
      } catch (error) {
        toast.error('Failed to load follow-up schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, []);

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950">Follow-up Calendar</h1>
          <p className="text-secondary-500 mt-1">Manage your schedule and stay on top of client commitments.</p>
        </div>
        <button 
          onClick={() => navigate('/leads')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Schedule New Follow-up</span>
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

          <div className="grid grid-cols-7 flex-grow border-l border-t border-secondary-100 overflow-y-auto">
            {loading ? (
              <div className="col-span-7 h-full flex items-center justify-center text-secondary-500 font-medium">
                Loading schedule...
              </div>
            ) : (
              calendarDays.map((day, i) => {
                const dayEvents = followUps.filter(e => isSameDay(new Date(e.dueDate), day));
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
                    
                    <div className="mt-2 space-y-1 max-h-[60px] overflow-y-auto">
                      {dayEvents.map(event => (
                        <div 
                          key={event._id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (event.leadId?._id) {
                              navigate(`/leads/${event.leadId._id}`);
                            }
                          }}
                          className={`text-[10px] p-1 bg-white border border-secondary-100 rounded shadow-sm flex items-center gap-1 font-semibold text-secondary-600 overflow-hidden whitespace-nowrap hover:border-primary-300 transition-colors ${
                            event.status === 'Completed' ? 'opacity-60 line-through' : ''
                          }`}
                          title={`${event.title} (${event.status})`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            event.status === 'Completed' 
                              ? 'bg-emerald-500' 
                              : event.status === 'Overdue' 
                              ? 'bg-rose-500' 
                              : 'bg-amber-500'
                          }`}></div>
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Agenda */}
        <div className="w-full md:w-80 bg-secondary-50/50 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-secondary-950 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-primary-600" /> Today's Agenda
            </h3>
            <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-secondary-500 italic">Loading...</p>
              ) : followUps.filter(e => isSameDay(new Date(e.dueDate), new Date())).length === 0 ? (
                <p className="text-sm text-secondary-500 italic">No events scheduled for today.</p>
              ) : (
                followUps.filter(e => isSameDay(new Date(e.dueDate), new Date())).map(event => (
                  <div 
                    key={event._id} 
                    onClick={() => event.leadId?._id && navigate(`/leads/${event.leadId._id}`)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        event.status === 'Completed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : event.status === 'Overdue' 
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">{event.title}</p>
                    {event.leadId && (
                      <p className="text-xs text-secondary-500 font-medium truncate mt-0.5">
                        Client: {event.leadId.name} · {event.leadId.company}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-secondary-500">
                      <Clock size={12} />
                      <span>{format(new Date(event.dueDate), 'hh:mm a')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 bg-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 relative overflow-hidden shrink-0">
            <CalendarIcon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 transform -rotate-12" />
            <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-2">Summary</p>
            <h4 className="text-2xl font-bold mb-4">
              {loading ? '...' : followUps.filter(e => e.status === 'Pending').length} Pending Tasks
            </h4>
            <button 
              onClick={() => navigate('/leads')}
              className="w-full bg-white hover:bg-secondary-50 active:bg-secondary-100 text-primary-600 font-bold py-2.5 rounded-xl text-sm shadow-lg transition-colors"
            >
              Manage All Leads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

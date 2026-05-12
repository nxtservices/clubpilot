import React, { useState } from 'react';
import { CalendarEvent, EventTypeColors } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface AgendaMonthViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function AgendaMonthView({ events, onSelectEvent }: AgendaMonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString('nl-NL', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    return events.filter((event) => event.starts_at.split('T')[0] === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-brand-navy capitalize">{monthName}</h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="border border-brand-border rounded-lg overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-brand-light border-b border-brand-border">
            {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
              <div key={day} className="p-3 text-center font-semibold text-sm text-brand-navy">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-brand-border">
            {[...emptyDays, ...days].map((day, idx) => (
              <div
                key={idx}
                className={`min-h-24 p-2 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}`}
              >
                {day && (
                  <div className="space-y-1 h-full flex flex-col">
                    <div className="text-sm font-medium text-brand-navy">{day}</div>
                    <div className="space-y-1 flex-1 overflow-y-auto">
                      {getEventsForDate(day).slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => onSelectEvent(event)}
                          className={`w-full text-left text-xs px-1.5 py-1 rounded ${EventTypeColors[event.event_type]} hover:opacity-80 transition cursor-pointer truncate`}
                          title={event.title}
                        >
                          <div className="flex items-center gap-1">
                            {event.needs_attention && (
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            )}
                            <span className="truncate">{event.title}</span>
                          </div>
                        </button>
                      ))}
                      {getEventsForDate(day).length > 2 && (
                        <div className="text-xs text-gray-600 px-1.5">
                          +{getEventsForDate(day).length - 2} meer
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

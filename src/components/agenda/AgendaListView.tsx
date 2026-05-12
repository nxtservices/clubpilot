import React from 'react';
import { CalendarEvent, EventStatusLabels, EventStatusColors, EventTypeLabels, EventTypeColors } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

interface AgendaListViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function AgendaListView({ events, onSelectEvent }: AgendaListViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };

  const groupedByDate = events.reduce(
    (acc, event) => {
      const date = formatDate(event.starts_at);
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>,
  );

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-brand-navy mb-3">{date}</h3>
          <div className="space-y-2">
            {groupedByDate[date].map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectEvent(event)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Title and type */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-brand-navy">{event.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{EventTypeLabels[event.event_type]}</p>
                      </div>
                      {event.needs_attention && (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Status and time */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${EventStatusColors[event.status]}`}>
                        {EventStatusLabels[event.status]}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(event.starts_at)}
                          {event.ends_at && ` - ${formatTime(event.ends_at)}`}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    {(event.location || event.online_url) && (
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <div>
                          {event.location && <div>{event.location}</div>}
                          {event.online_url && (
                            <a
                              href={event.online_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Online link
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Attention reason */}
                    {event.needs_attention && event.attention_reason && (
                      <div className="text-xs bg-red-50 border border-red-200 rounded p-2 text-red-700">
                        {event.attention_reason}
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { EventFilter, EventTypeLabels, EventStatusLabels, EventType, EventStatus } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface AgendaFiltersProps {
  filters: EventFilter;
  onFiltersChange: (filters: EventFilter) => void;
}

export function AgendaFilters({ filters, onFiltersChange }: AgendaFiltersProps) {
  const handleToggleEventType = (type: EventType) => {
    if (filters.event_type === type) {
      onFiltersChange({ ...filters, event_type: undefined });
    } else {
      onFiltersChange({ ...filters, event_type: type });
    }
  };

  const handleToggleStatus = (status: EventStatus) => {
    if (filters.status === status) {
      onFiltersChange({ ...filters, status: undefined });
    } else {
      onFiltersChange({ ...filters, status: status });
    }
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Event Type Filters */}
          <div>
            <h3 className="text-sm font-semibold text-brand-navy mb-2">Type</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EventTypeLabels) as EventType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleToggleEventType(type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.event_type === type
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-brand-navy hover:bg-gray-200'
                  }`}
                >
                  {EventTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-semibold text-brand-navy mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EventStatusLabels) as EventStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleToggleStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.status === status
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-brand-navy hover:bg-gray-200'
                  }`}
                >
                  {EventStatusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-sm text-brand-primary hover:text-blue-700 transition"
            >
              <X className="w-4 h-4" />
              Filters wissen
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

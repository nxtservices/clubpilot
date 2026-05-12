'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useTenant } from '@/lib/tenant-context';
import { useAuth } from '@/lib/auth-context';
import { calendarService } from '@/lib/calendar-service';
import { CalendarEvent, EventFilter } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Plus, AlertCircle, Calendar, ListIcon, Eye, EyeOff } from 'lucide-react';
import { AgendaListView } from '@/components/agenda/AgendaListView';
import { AgendaMonthView } from '@/components/agenda/AgendaMonthView';
import { CreateEventDialog } from '@/components/agenda/CreateEventDialog';
import { EventDetailDrawer } from '@/components/agenda/EventDetailDrawer';
import { AgendaFilters } from '@/components/agenda/AgendaFilters';

type ViewType = 'list' | 'month' | 'week' | 'my-agenda' | 'needs-attention';

export default function AgendaPage() {
  const { activeTenant } = useTenant();
  const { user } = useAuth();

  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [showEventDetail, setShowEventDetail] = useState(false);

  const [filters, setFilters] = useState<EventFilter>({});

  useEffect(() => {
    if (activeTenant?.id) {
      loadEvents();
    }
  }, [activeTenant?.id]);

  useEffect(() => {
    applyFilters();
  }, [events, filters, view]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(undefined);

      if (!activeTenant?.id) return;

      const tenantEvents = await calendarService.getTenantEvents(activeTenant.id);
      setEvents(tenantEvents);

      // Apply smart signals
      await calendarService.applySmartSignals(activeTenant.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden agenda');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    // View-specific filtering
    if (view === 'my-agenda' && user?.id) {
      filtered = filtered.filter((event) => event.owner_user_id === user.id);
    } else if (view === 'needs-attention') {
      filtered = filtered.filter((event) => event.needs_attention);
    }

    // Apply other filters
    if (filters.event_type) {
      filtered = filtered.filter((e) => e.event_type === filters.event_type);
    }
    if (filters.status) {
      filtered = filtered.filter((e) => e.status === filters.status);
    }
    if (filters.visibility) {
      filtered = filtered.filter((e) => e.visibility === filters.visibility);
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async (data: any) => {
    try {
      if (!activeTenant?.id) return;
      await calendarService.createEvent(activeTenant.id, data);
      await loadEvents();
      setShowCreateDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij maken event');
    }
  };

  const handleUpdateEvent = async (eventId: string, data: any) => {
    try {
      await calendarService.updateEvent(eventId, data);
      await loadEvents();
      setShowEventDetail(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij updaten event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      if (confirm('Zeker weten? Deze actie kan niet ongedaan gemaakt worden.')) {
        await calendarService.deleteEvent(eventId);
        await loadEvents();
        setShowEventDetail(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij verwijderen event');
    }
  };

  if (!activeTenant?.id) {
    return (
      <AppLayout>
        <Alert variant="info">
          Selecteer een organisatie om de agenda te zien.
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-brand-navy mb-2">Agenda</h1>
            <p className="text-gray-600">
              Centrale planning voor activiteiten, diensten, vergaderingen, deadlines en stemrondes.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nieuw agenda-item
          </Button>
        </div>

        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {/* View Tabs */}
        <div className="flex gap-2 border-b border-brand-border">
          {[
            { id: 'month', label: 'Maand', icon: Calendar },
            { id: 'week', label: 'Week', icon: Calendar },
            { id: 'list', label: 'Lijst', icon: ListIcon },
            { id: 'my-agenda', label: 'Mijn agenda', icon: Eye },
            { id: 'needs-attention', label: 'Actie nodig', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as ViewType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-600 hover:text-brand-navy'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <AgendaFilters filters={filters} onFiltersChange={setFilters} />

        {/* Content */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-600">Laden...</div>
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-600">
                {view === 'needs-attention'
                  ? 'Geen agenda-items die aandacht nodig hebben.'
                  : 'Geen agenda-items gevonden.'}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {(view === 'month' || view === 'week') && (
              <AgendaMonthView
                events={filteredEvents}
                onSelectEvent={(event) => {
                  setSelectedEvent(event);
                  setShowEventDetail(true);
                }}
              />
            )}

            {(view === 'list' || view === 'my-agenda' || view === 'needs-attention') && (
              <AgendaListView
                events={filteredEvents}
                onSelectEvent={(event) => {
                  setSelectedEvent(event);
                  setShowEventDetail(true);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateEvent}
      />

      {/* Event Detail Drawer */}
      {selectedEvent && (
        <EventDetailDrawer
          event={selectedEvent}
          isOpen={showEventDetail}
          onClose={() => setShowEventDetail(false)}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </AppLayout>
  );
}

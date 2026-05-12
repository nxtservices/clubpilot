'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/lib/auth-context';
import { useTenant } from '@/lib/tenant-context';
import { calendarService } from '@/lib/calendar-service';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Users, Zap, Calendar, Vote, Gavel, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CockpitPage() {
  const { user } = useAuth();
  const { activeTenant } = useTenant();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [eventsNeedingAttention, setEventsNeedingAttention] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTenant?.id) {
      loadAgendaData();
    }
  }, [activeTenant?.id]);

  const loadAgendaData = async () => {
    try {
      setLoading(true);
      if (!activeTenant?.id) return;

      const [upcoming, needsAttention] = await Promise.all([
        calendarService.getUpcomingEvents(activeTenant.id, 5),
        calendarService.getEventsNeedingAttention(activeTenant.id),
      ]);

      setUpcomingEvents(upcoming);
      setEventsNeedingAttention(needsAttention);
    } catch (err) {
      console.error('Error loading agenda data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Vandaag';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen';
    } else {
      return date.toLocaleDateString('nl-NL', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-brand-navy mb-2">
                {getGreeting()}
              </h1>
              <p className="text-gray-600">
                Welkom terug in je cockpit. Hier zie je de vitaalste informatie op één plek.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand-light rounded-lg">
              <Zap className="w-5 h-5 text-brand-accent" />
              <span className="text-sm font-medium text-brand-navy">Alles in orde</span>
            </div>
          </div>
        </div>

        {/* Smart Signals - Prominent */}
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-brand-navy">Smart Signals</CardTitle>
              </div>
              <span className="bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">2 alerts</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white border border-yellow-200 rounded-lg hover:border-yellow-400 transition-colors">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brand-navy">Shift onderbezet</p>
                <p className="text-xs text-gray-600 mt-1">Zaterdag kantinedienst - nog 2 vrijwilligers nodig</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white border border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brand-navy">Taak vervallen</p>
                <p className="text-xs text-gray-600 mt-1">Uitnodigingen versturen - deadline verstreken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Tasks Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  Mijn Taken
                </CardTitle>
                <span className="bg-brand-light text-brand-primary text-xs font-bold px-2 py-1 rounded">0</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Geen taken toegewezen. Taken die je krijgen zullen hier verschijnen.
              </p>
            </CardContent>
          </Card>

          {/* My Shifts Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-accent" />
                  Mijn Vrijwilligerswerk
                </CardTitle>
                <span className="bg-brand-light text-brand-accent text-xs font-bold px-2 py-1 rounded">0</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Geen shifts aangekozen. Schrijf je in bij beschikbare vrijwilligerspunten.
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Aankomende Agenda
                </CardTitle>
                <Link href="/agenda" className="text-xs text-brand-primary hover:underline">
                  Bekijk alles
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <p className="text-sm text-gray-600">Laden...</p>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-600">Geen aankomende agenda-items.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm"
                  >
                    <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-brand-navy truncate">{event.title}</p>
                      <p className="text-xs text-gray-600">{formatEventDate(event.starts_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Events Needing Attention */}
          {eventsNeedingAttention.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Agenda - Actie nodig
                  </CardTitle>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {eventsNeedingAttention.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {eventsNeedingAttention.slice(0, 3).map((event) => (
                  <div key={event.id} className="text-xs p-2 bg-white rounded border border-red-200">
                    <p className="font-medium text-red-900">{event.title}</p>
                    {event.attention_reason && (
                      <p className="text-red-700 mt-1">{event.attention_reason}</p>
                    )}
                  </div>
                ))}
                {eventsNeedingAttention.length > 3 && (
                  <Link href="/agenda?view=needs-attention" className="text-xs text-red-600 hover:underline block">
                    +{eventsNeedingAttention.length - 3} meer
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Voting Rounds */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Vote className="w-5 h-5 text-purple-500" />
                  Stemmingen
                </CardTitle>
                <span className="bg-purple-50 text-purple-600 text-xs font-bold px-2 py-1 rounded">0</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Geen actieve stemmingen. Jouw stem is belangrijk.
              </p>
            </CardContent>
          </Card>

          {/* Recent Decisions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-green-500" />
                  Besluiten
                </CardTitle>
                <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded">0</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Geen recente besluiten. Besluiten verschijnen hier na vergaderingen.
              </p>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Punten
                </CardTitle>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded">0 pts</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Verdien punten door vrijwilligerswerk. Je balans hier zichtbaar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

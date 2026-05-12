import React, { useState } from 'react';
import { CalendarEvent, EventStatusLabels, EventStatusColors, EventTypeLabels, EventTypeColors } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, AlertCircle, Trash2, X, Edit2 } from 'lucide-react';

interface EventDetailDrawerProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (eventId: string, data: any) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
}

export function EventDetailDrawer({
  event,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: EventDetailDrawerProps) {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(event.id);
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNeedsAttention = async () => {
    setLoading(true);
    try {
      await onUpdate(event.id, {
        needs_attention: !event.needs_attention,
      });
    } catch (err) {
      console.error('Error updating event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center lg:justify-end">
      <Card className="w-full lg:w-96 max-h-[90vh] rounded-b-none lg:rounded-b rounded-t-2xl lg:rounded-r-none overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <h2 className="text-xl font-bold text-brand-navy">Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CardContent className="pt-6 space-y-6">
          {/* Title and type */}
          <div>
            <h3 className="text-2xl font-bold text-brand-navy mb-2">{event.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${EventTypeColors[event.event_type]} inline-block`}>
              {EventTypeLabels[event.event_type]}
            </span>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
            <span className={`text-xs px-3 py-1 rounded-full ${EventStatusColors[event.status]} inline-block`}>
              {EventStatusLabels[event.status]}
            </span>
          </div>

          {/* Date and time */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Datum & tijd
            </label>
            <p className="text-sm text-brand-navy">{formatDate(event.starts_at)}</p>
            {event.ends_at && (
              <p className="text-sm text-gray-600">
                tot {new Date(event.ends_at).toLocaleTimeString('nl-NL', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>

          {/* Location */}
          {(event.location || event.online_url) && (
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Locatie
              </label>
              {event.location && <p className="text-sm text-brand-navy">{event.location}</p>}
              {event.online_url && (
                <a
                  href={event.online_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-primary hover:underline"
                >
                  Online link
                </a>
              )}
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2">Beschrijving</label>
              <p className="text-sm text-brand-navy">{event.description}</p>
            </div>
          )}

          {/* Attention */}
          {event.needs_attention && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Actie nodig</p>
                  {event.attention_reason && (
                    <p className="text-sm text-red-700 mt-1">{event.attention_reason}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-brand-border">
            <p>Aangemaakt: {new Date(event.created_at).toLocaleDateString('nl-NL')}</p>
            {event.updated_at !== event.created_at && (
              <p>Bijgewerkt: {new Date(event.updated_at).toLocaleDateString('nl-NL')}</p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-brand-border">
            {!event.needs_attention && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleToggleNeedsAttention}
                disabled={loading}
              >
                <AlertCircle className="w-4 h-4" />
                Markeer als actie nodig
              </Button>
            )}

            {event.needs_attention && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleToggleNeedsAttention}
                disabled={loading}
              >
                <AlertCircle className="w-4 h-4" />
                Verwijder markering
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleDelete}
              disabled={loading}
              isLoading={loading}
            >
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

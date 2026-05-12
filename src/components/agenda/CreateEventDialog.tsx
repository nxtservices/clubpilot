import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateEventData, EventType, EventTypeLabels, EventStatus, EventStatusLabels, EventVisibility } from '@/types/calendar';
import { X } from 'lucide-react';

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateEventData) => Promise<void>;
}

export function CreateEventDialog({ isOpen, onClose, onCreate }: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    event_type: 'general' as EventType,
    status: 'scheduled' as EventStatus,
    starts_at: '',
    ends_at: '',
    all_day: false,
    location: '',
    online_url: '',
    visibility: 'tenant_all' as EventVisibility,
    needs_attention: false,
    attention_reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!formData.title || !formData.starts_at) {
      setError('Titel en startdatum zijn verplicht');
      return;
    }

    try {
      setLoading(true);
      await onCreate(formData);
      setFormData({
        title: '',
        description: '',
        event_type: 'general' as EventType,
        status: 'scheduled' as EventStatus,
        starts_at: '',
        ends_at: '',
        all_day: false,
        location: '',
        online_url: '',
        visibility: 'tenant_all' as EventVisibility,
        needs_attention: false,
        attention_reason: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij aanmaken event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Nieuw agenda-item</CardTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Titel *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Bijv. Teamvergadering"
              disabled={loading}
            />

            <TextArea
              label="Beschrijving"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Meer details..."
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2">Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value as EventType })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary"
                >
                  {(Object.keys(EventTypeLabels) as EventType[]).map((type) => (
                    <option key={type} value={type}>
                      {EventTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary"
                >
                  {(Object.keys(EventStatusLabels) as EventStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {EventStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Startdatum en -tijd *"
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                disabled={loading}
              />

              <Input
                label="Einddatum en -tijd"
                type="datetime-local"
                value={formData.ends_at || ''}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all_day"
                checked={formData.all_day}
                onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                disabled={loading}
                className="rounded"
              />
              <label htmlFor="all_day" className="text-sm text-brand-navy">
                Hele dag
              </label>
            </div>

            <Input
              label="Locatie"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Bijv. Sporthal Oost"
              disabled={loading}
            />

            <Input
              label="Online link"
              type="url"
              value={formData.online_url || ''}
              onChange={(e) => setFormData({ ...formData, online_url: e.target.value })}
              placeholder="https://..."
              disabled={loading}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="needs_attention"
                checked={formData.needs_attention}
                onChange={(e) => setFormData({ ...formData, needs_attention: e.target.checked })}
                disabled={loading}
                className="rounded"
              />
              <label htmlFor="needs_attention" className="text-sm text-brand-navy">
                Actie nodig
              </label>
            </div>

            {formData.needs_attention && (
              <Input
                label="Reden actie nodig"
                value={formData.attention_reason || ''}
                onChange={(e) => setFormData({ ...formData, attention_reason: e.target.value })}
                placeholder="Waarom is actie nodig?"
                disabled={loading}
              />
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
              >
                Aanmaken
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

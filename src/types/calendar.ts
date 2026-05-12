// Calendar event types
export type EventType = 
  | 'general' 
  | 'activity' 
  | 'meeting' 
  | 'volunteer_shift' 
  | 'task_deadline' 
  | 'voting_round' 
  | 'reading_period' 
  | 'committee_moment' 
  | 'board_moment' 
  | 'team_assignment_deadline' 
  | 'maintenance' 
  | 'training';

export type EventStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'needs_attention' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

export type EventVisibility = 
  | 'private' 
  | 'board' 
  | 'committee' 
  | 'team' 
  | 'volunteers' 
  | 'members' 
  | 'tenant_all';

export interface CalendarEvent {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  event_type: EventType;
  status: EventStatus;
  starts_at: string;
  ends_at?: string;
  all_day: boolean;
  location?: string;
  online_url?: string;
  owner_user_id?: string;
  committee_id?: string;
  team_id?: string;
  visibility: EventVisibility;
  linked_entity_type?: string;
  linked_entity_id?: string;
  needs_attention: boolean;
  attention_reason?: string;
  color_key?: string;
  recurrence_rule?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  event_type: EventType;
  status?: EventStatus;
  starts_at: string;
  ends_at?: string;
  all_day?: boolean;
  location?: string;
  online_url?: string;
  owner_user_id?: string;
  committee_id?: string;
  team_id?: string;
  visibility?: EventVisibility;
  needs_attention?: boolean;
  attention_reason?: string;
  color_key?: string;
  recurrence_rule?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export type EventFilter = {
  event_type?: EventType;
  status?: EventStatus;
  visibility?: EventVisibility;
  needs_attention?: boolean;
  owner_user_id?: string;
  start_date?: string;
  end_date?: string;
};

export const EventTypeLabels: Record<EventType, string> = {
  general: 'Algemeen',
  activity: 'Activiteit',
  meeting: 'Vergadering',
  volunteer_shift: 'Vrijwilligersdienst',
  task_deadline: 'Deadline',
  voting_round: 'Stemronde',
  reading_period: 'Inleesperiode',
  committee_moment: 'Commissiemoment',
  board_moment: 'Bestuursmoment',
  team_assignment_deadline: 'Teamdeadline',
  maintenance: 'Onderhoud',
  training: 'Training',
};

export const EventStatusLabels: Record<EventStatus, string> = {
  draft: 'Concept',
  scheduled: 'Gepland',
  needs_attention: 'Actie nodig',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
  completed: 'Afgerond',
};

export const EventStatusColors: Record<EventStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  scheduled: 'bg-blue-100 text-blue-800',
  needs_attention: 'bg-red-100 text-red-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-300 text-gray-700',
  completed: 'bg-green-200 text-green-900',
};

export const EventTypeColors: Record<EventType, string> = {
  general: 'bg-gray-100',
  activity: 'bg-blue-100',
  meeting: 'bg-purple-100',
  volunteer_shift: 'bg-orange-100',
  task_deadline: 'bg-red-100',
  voting_round: 'bg-indigo-100',
  reading_period: 'bg-yellow-100',
  committee_moment: 'bg-pink-100',
  board_moment: 'bg-rose-100',
  team_assignment_deadline: 'bg-cyan-100',
  maintenance: 'bg-slate-100',
  training: 'bg-lime-100',
};

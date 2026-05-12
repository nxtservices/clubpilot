-- ClubPilot Row-Level Security (RLS) Policies
-- All data access is restricted by tenant_id

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_intake_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_suggestions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES - Users can only read their own profile
-- ============================================================================

CREATE POLICY profiles_self_read ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY profiles_self_update ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY profiles_insert ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TENANT MEMBERSHIPS - Users can only see their own memberships
-- ============================================================================

CREATE POLICY tenant_memberships_user_read ON tenant_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY tenant_memberships_tenant_read ON tenant_memberships FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM tenant_memberships WHERE tenant_id = tenant_memberships.tenant_id
    )
  );

-- ============================================================================
-- TENANT-SCOPED DATA - All require tenant membership
-- ============================================================================

-- Helper function to check if user is a tenant member
CREATE OR REPLACE FUNCTION is_tenant_member(tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_memberships 
    WHERE tenant_memberships.tenant_id = $1 
    AND tenant_memberships.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROLES
-- ============================================================================

CREATE POLICY roles_tenant_read ON roles FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY roles_admin_write ON roles FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY roles_admin_update ON roles FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- SEASONS
-- ============================================================================

CREATE POLICY seasons_tenant_read ON seasons FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY seasons_admin_write ON seasons FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY seasons_admin_update ON seasons FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE POLICY audit_logs_tenant_read ON audit_logs FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- ============================================================================
-- COMMITTEES
-- ============================================================================

CREATE POLICY committees_tenant_read ON committees FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY committees_admin_write ON committees FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY committees_admin_update ON committees FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- COMMITTEE MEMBERS
-- ============================================================================

CREATE POLICY committee_members_read ON committee_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM committees 
      WHERE committees.id = committee_members.committee_id
      AND is_tenant_member(committees.tenant_id)
    )
  );

CREATE POLICY committee_members_insert ON committee_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM committees 
      WHERE committees.id = committee_members.committee_id
      AND is_tenant_member(committees.tenant_id)
    )
  );

-- ============================================================================
-- TEAMS
-- ============================================================================

CREATE POLICY teams_tenant_read ON teams FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY teams_admin_write ON teams FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY teams_admin_update ON teams FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- TEAM MEMBERS
-- ============================================================================

CREATE POLICY team_members_read ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id
      AND is_tenant_member(teams.tenant_id)
    )
  );

CREATE POLICY team_members_insert ON team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id
      AND is_tenant_member(teams.tenant_id)
    )
  );

-- ============================================================================
-- VOLUNTEER PROFILES
-- ============================================================================

CREATE POLICY volunteer_profiles_self_read ON volunteer_profiles FOR SELECT
  USING (auth.uid() = user_id OR is_tenant_member(tenant_id));

CREATE POLICY volunteer_profiles_self_write ON volunteer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_tenant_member(tenant_id));

CREATE POLICY volunteer_profiles_self_update ON volunteer_profiles FOR UPDATE
  USING (auth.uid() = user_id OR is_tenant_member(tenant_id));

-- ============================================================================
-- VOLUNTEER INTAKE ANSWERS
-- ============================================================================

CREATE POLICY volunteer_intake_answers_self_read ON volunteer_intake_answers FOR SELECT
  USING (auth.uid() = user_id OR is_tenant_member(tenant_id));

CREATE POLICY volunteer_intake_answers_self_write ON volunteer_intake_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_tenant_member(tenant_id));

CREATE POLICY volunteer_intake_answers_self_update ON volunteer_intake_answers FOR UPDATE
  USING (auth.uid() = user_id OR is_tenant_member(tenant_id));

-- ============================================================================
-- VOLUNTEER TASK TEMPLATES
-- ============================================================================

CREATE POLICY volunteer_task_templates_tenant_read ON volunteer_task_templates FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY volunteer_task_templates_admin_write ON volunteer_task_templates FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY volunteer_task_templates_admin_update ON volunteer_task_templates FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- VOLUNTEER SHIFTS
-- ============================================================================

CREATE POLICY volunteer_shifts_tenant_read ON volunteer_shifts FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY volunteer_shifts_admin_write ON volunteer_shifts FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY volunteer_shifts_admin_update ON volunteer_shifts FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- VOLUNTEER SHIFT ASSIGNMENTS
-- ============================================================================

CREATE POLICY volunteer_shift_assignments_read ON volunteer_shift_assignments FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM volunteer_shifts 
      WHERE volunteer_shifts.id = volunteer_shift_assignments.shift_id
      AND is_tenant_member(volunteer_shifts.tenant_id)
    )
  );

CREATE POLICY volunteer_shift_assignments_insert ON volunteer_shift_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM volunteer_shifts 
      WHERE volunteer_shifts.id = volunteer_shift_assignments.shift_id
      AND is_tenant_member(volunteer_shifts.tenant_id)
    )
  );

CREATE POLICY volunteer_shift_assignments_update ON volunteer_shift_assignments FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM volunteer_shifts 
      WHERE volunteer_shifts.id = volunteer_shift_assignments.shift_id
      AND is_tenant_member(volunteer_shifts.tenant_id)
    )
  );

-- ============================================================================
-- VOLUNTEER POINTS LEDGER
-- ============================================================================

CREATE POLICY volunteer_points_ledger_read ON volunteer_points_ledger FOR SELECT
  USING (auth.uid() = user_id OR is_tenant_member(tenant_id));

CREATE POLICY volunteer_points_ledger_insert ON volunteer_points_ledger FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- ============================================================================
-- CALENDAR EVENTS
-- ============================================================================

CREATE POLICY calendar_events_tenant_read ON calendar_events FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY calendar_events_admin_write ON calendar_events FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY calendar_events_admin_update ON calendar_events FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- TASKS
-- ============================================================================

CREATE POLICY tasks_tenant_read ON tasks FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY tasks_admin_write ON tasks FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY tasks_admin_update ON tasks FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- TASK COMMENTS
-- ============================================================================

CREATE POLICY task_comments_read ON task_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_comments.task_id
      AND is_tenant_member(tasks.tenant_id)
    )
  );

CREATE POLICY task_comments_insert ON task_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_comments.task_id
      AND is_tenant_member(tasks.tenant_id)
    )
  );

-- ============================================================================
-- DOCUMENTS
-- ============================================================================

CREATE POLICY documents_tenant_read ON documents FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY documents_insert ON documents FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_tenant_member(tenant_id));

CREATE POLICY documents_update ON documents FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- MEETINGS
-- ============================================================================

CREATE POLICY meetings_tenant_read ON meetings FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY meetings_insert ON meetings FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY meetings_update ON meetings FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- MEETING AGENDA ITEMS
-- ============================================================================

CREATE POLICY meeting_agenda_items_read ON meeting_agenda_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meetings 
      WHERE meetings.id = meeting_agenda_items.meeting_id
      AND is_tenant_member(meetings.tenant_id)
    )
  );

CREATE POLICY meeting_agenda_items_insert ON meeting_agenda_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meetings 
      WHERE meetings.id = meeting_agenda_items.meeting_id
      AND is_tenant_member(meetings.tenant_id)
    )
  );

-- ============================================================================
-- DECISIONS
-- ============================================================================

CREATE POLICY decisions_tenant_read ON decisions FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY decisions_insert ON decisions FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY decisions_update ON decisions FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- VOTING ROUNDS
-- ============================================================================

CREATE POLICY voting_rounds_tenant_read ON voting_rounds FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY voting_rounds_insert ON voting_rounds FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY voting_rounds_update ON voting_rounds FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ============================================================================
-- VOTING OPTIONS
-- ============================================================================

CREATE POLICY voting_options_read ON voting_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voting_rounds 
      WHERE voting_rounds.id = voting_options.voting_round_id
      AND is_tenant_member(voting_rounds.tenant_id)
    )
  );

CREATE POLICY voting_options_insert ON voting_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voting_rounds 
      WHERE voting_rounds.id = voting_options.voting_round_id
      AND is_tenant_member(voting_rounds.tenant_id)
    )
  );

-- ============================================================================
-- VOTES
-- ============================================================================

CREATE POLICY votes_user_read ON votes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY votes_tenant_read ON votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voting_rounds 
      WHERE voting_rounds.id = votes.voting_round_id
      AND is_tenant_member(voting_rounds.tenant_id)
    )
  );

CREATE POLICY votes_insert ON votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM voting_rounds 
      WHERE voting_rounds.id = votes.voting_round_id
      AND is_tenant_member(voting_rounds.tenant_id)
    )
  );

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE POLICY notifications_user_read ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY notifications_insert ON notifications FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SMART SIGNALS
-- ============================================================================

CREATE POLICY smart_signals_tenant_read ON smart_signals FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY smart_signals_insert ON smart_signals FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- ============================================================================
-- SMART SUGGESTIONS
-- ============================================================================

CREATE POLICY smart_suggestions_tenant_read ON smart_suggestions FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY smart_suggestions_insert ON smart_suggestions FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY smart_suggestions_update ON smart_suggestions FOR UPDATE
  USING (is_tenant_member(tenant_id));

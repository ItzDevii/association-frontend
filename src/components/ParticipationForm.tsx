'use client';

import { useEffect, useState } from 'react';
import { Participation } from '@/types/participation';
import { Member } from '@/types/member';
import { Activity } from '@/types/activity';

import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface ParticipationFormProps {
  participation?: Participation;
  onSubmit: (data: Participation | Omit<Participation, 'id'>) => Promise<void>;
  onCancel: () => void;
  members: Member[];
  activities: Activity[];
}

const formatDateToLocalString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDateFromString = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function ParticipationForm({
  participation,
  onSubmit,
  onCancel,
  members,
  activities,
}: ParticipationFormProps) {
  const [memberId, setMemberId] = useState<number | null>(null);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [signupDate, setSignupDate] = useState<Date>(new Date());
  const [memberError, setMemberError] = useState(false);
  const [activityError, setActivityError] = useState(false);

  useEffect(() => {
    if (participation) {
      setMemberId(participation.memberId);
      setActivityId(participation.activityId);
      setSignupDate(parseDateFromString(participation.signupDate));
    } else {
      setMemberId(members.length > 0 ? members[0].id! : null);
      setActivityId(activities.length > 0 ? activities[0].id! : null);
    }
  }, [participation, members, activities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (memberId === null) setMemberError(true);
    if (activityId === null) setActivityError(true);
    if (memberId === null || activityId === null) return;

    const payload: Participation | Omit<Participation, 'id'> = {
      ...(participation || {}),
      memberId,
      activityId,
      signupDate: formatDateToLocalString(signupDate),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="dialog-form">
      <div className="form-group">
        <label htmlFor="member">Member</label>
        <Dropdown
          id="member"
          value={memberId}
          options={members}
          optionValue="id"
          optionLabel="firstName"
          onChange={(e) => {
            setMemberId(e.value);
            setMemberError(false);
          }}
          itemTemplate={(m: Member) => (
            <span>{m.firstName} {m.lastName}</span>
          )}
          valueTemplate={() => {
            const selected = members.find((m) => m.id === memberId);
            return selected ? (
              <span>{selected.firstName} {selected.lastName}</span>
            ) : (
              <span>Select Member</span>
            );
          }}
          placeholder="Select Member"
          filter
          className={`w-full ${memberError ? 'p-invalid' : ''}`}
          required
        />
        {memberError && <small className="p-error">Member is required</small>}
      </div>

      <div className="form-group">
        <label htmlFor="activity">Activity</label>
        <Dropdown
          id="activity"
          value={activityId}
          options={activities}
          optionValue="id"
          optionLabel="name"
          onChange={(e) => {
            setActivityId(e.value);
            setActivityError(false);
          }}
          placeholder="Select Activity"
          filter
          className={`w-full ${activityError ? 'p-invalid' : ''}`}
          required
        />
        {activityError && <small className="p-error">Activity is required</small>}
      </div>

      <div className="form-group">
        <label htmlFor="signupDate">Signup Date</label>
        <Calendar
          id="signupDate"
          value={signupDate}
          onChange={(e) => setSignupDate(e.value as Date)}
          dateFormat="yy-mm-dd"
          showIcon
          required
          className="w-full"
        />
      </div>

      <div className="dialog-footer">
        <Button
          label="Cancel"
          type="button"
          className="btn btn-cancel"
          onClick={onCancel}
        />
        <Button
          label={participation ? 'Update' : 'Create'}
          type="submit"
          className="btn btn-success"
        />
      </div>
    </form>
  );
}
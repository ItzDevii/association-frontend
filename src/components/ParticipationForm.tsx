'use client';

import { useEffect, useState } from 'react';
import { Participation } from '@/types/participation';
import { Member } from '@/types/member';
import { Activity } from '@/types/activity';
import { getMembers } from '@/services/memberService';
import { getActivities } from '@/services/activityService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

interface Props {
  participation?: Participation;
  onSubmit: (data: Participation | Omit<Participation, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const ParticipationForm: React.FC<Props> = ({ participation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Participation, 'id'>>({
    member: {} as Member,
    activity: {} as Activity,
    signupDate: new Date().toISOString().split('T')[0],
  });

  const [members, setMembers] = useState<{ label: string; value: number; original: Member }[]>([]);
  const [activities, setActivities] = useState<{ label: string; value: number; original: Activity }[]>([]);

  useEffect(() => {
    if (participation) {
      setFormData({
        member: participation.member,
        activity: participation.activity,
        signupDate: participation.signupDate,
      });
    }
  }, [participation]);

  useEffect(() => {
    getMembers().then((data) => {
      const formatted = data.map((m) => ({
        label: `${m.firstName} ${m.lastName}`,
        value: m.id,
        original: m,
      }));
      setMembers(formatted);
    });

    getActivities().then((data) => {
      const formatted = data.map((a) => ({
        label: a.name,
        value: a.id,
        original: a,
      }));
      setActivities(formatted);
    });
  }, []);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (participation) {
      await onSubmit({ ...participation, ...formData });
    } else {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="member">Member</label>
        <Dropdown
          id="member"
          value={formData.member?.id}
          options={members}
          onChange={(e) => {
            const selected = members.find((m) => m.value === e.value);
            if (selected) handleChange('member', selected.original);
          }}
          placeholder="Select Member"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="activity">Activity</label>
        <Dropdown
          id="activity"
          value={formData.activity?.id}
          options={activities}
          onChange={(e) => {
            const selected = activities.find((a) => a.value === e.value);
            if (selected) handleChange('activity', selected.original);
          }}
          placeholder="Select Activity"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="signupDate">Signup Date</label>
        <Calendar
          id="signupDate"
          value={new Date(formData.signupDate)}
          onChange={(e) =>
            handleChange(
              'signupDate',
              (e.value as Date)?.toISOString().split('T')[0] || ''
            )
          }
          showIcon
          dateFormat="yy-mm-dd"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" label="Cancel" severity="secondary" onClick={onCancel} />
        <Button type="submit" label={participation ? 'Update' : 'Create'} />
      </div>
    </form>
  );
};

export default ParticipationForm;
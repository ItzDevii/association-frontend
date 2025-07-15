'use client';

import { useEffect, useState } from 'react';
import { createParticipation, updateParticipation } from '@/services/participationService';
import { getAllMembers } from '@/services/memberService';
import { getAllActivities } from '@/services/activityService';
import { Member } from '@/types/member';
import { Activity } from '@/types/activity';
import { Participation } from '@/types/participation';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
  participation: Participation | null;
  onClose: () => void;
}

const ParticipationForm: React.FC<Props> = ({ participation, onClose }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState<Omit<Participation, 'id'>>({
    participationDate: '',
    member: {} as Member,
    activity: {} as Activity,
  });

  useEffect(() => {
    const fetchData = async () => {
      const membersData = await getAllMembers();
      const activitiesData = await getAllActivities();
      setMembers(membersData);
      setActivities(activitiesData);
    };

    fetchData();

    if (participation) {
      const { id, ...rest } = participation;
      setFormData(rest);
    }
  }, [participation]);

  const handleSubmit = async () => {
    try {
      if (participation) {
        await updateParticipation({ ...participation, ...formData });
      } else {
        await createParticipation(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving participation:', error);
    }
  };

  return (
    <Dialog
      header={participation ? 'Edit Participation' : 'Create Participation'}
      visible
      onHide={onClose}
      style={{ width: '500px' }}
      modal
    >
      <div className="mb-3">
        <label className="form-label">Participation Date</label>
        <Calendar
          value={formData.participationDate ? new Date(formData.participationDate) : null}
          onChange={(e) =>
            setFormData({
              ...formData,
              participationDate: e.value ? e.value.toISOString().split('T')[0] : '',
            })
          }
          showIcon
          dateFormat="yy-mm-dd"
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Member</label>
        <Dropdown
          value={formData.member}
          options={members}
          onChange={(e) => setFormData({ ...formData, member: e.value })}
          itemTemplate={(m: Member) => `${m.firstName} ${m.lastName}`}
          optionLabel="id"
          className="form-control"
          placeholder="Select member"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Activity</label>
        <Dropdown
          value={formData.activity}
          options={activities}
          onChange={(e) => setFormData({ ...formData, activity: e.value })}
          optionLabel="title"
          className="form-control"
          placeholder="Select activity"
        />
      </div>

      <div className="text-end">
        <Button label="Cancel" onClick={onClose} className="me-2" severity="secondary" />
        <Button label="Save" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default ParticipationForm;
'use client';

import { useEffect, useState } from 'react';
import { Activity } from '@/types/activity';
import { createActivity, updateActivity } from '@/services/activityService';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

interface Props {
  activity: Activity | null;
  onClose: () => void;
}

const ActivityForm: React.FC<Props> = ({ activity, onClose }) => {
  const [formData, setFormData] = useState<Omit<Activity, 'id'>>({
    title: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    if (activity) {
      const { id, ...rest } = activity;
      setFormData(rest);
    }
  }, [activity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      date: value ? value.toISOString().split('T')[0] : '',
    }));
  };

  const handleSubmit = async () => {
    try {
      if (activity) {
        await updateActivity({ ...activity, ...formData });
      } else {
        await createActivity(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  return (
    <Dialog
      header={activity ? 'Edit Activity' : 'Create Activity'}
      visible
      onHide={onClose}
      style={{ width: '500px' }}
      modal
    >
      <div className="mb-3">
        <label className="form-label">Title</label>
        <InputText
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <InputText
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Date</label>
        <Calendar
          value={formData.date ? new Date(formData.date) : null}
          onChange={(e) => handleDateChange(e.value as Date)}
          showIcon
          dateFormat="yy-mm-dd"
          className="form-control"
        />
      </div>

      <div className="text-end">
        <Button label="Cancel" onClick={onClose} className="me-2" severity="secondary" />
        <Button label="Save" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default ActivityForm;
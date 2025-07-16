'use client';

import { Activity } from '@/types/activity';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: Omit<Activity, 'id'> | Activity) => Promise<void>;
  onCancel: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Activity, 'id'>>({
    name: '',
    description: '',
    eventDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (activity) {
      setFormData({ ...activity });
    }
  }, [activity]);

  const handleChange = (field: keyof Omit<Activity, 'id'>, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(activity ? { ...activity, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
          autoResize
        />
      </div>

      <div className="mb-3">
        <label htmlFor="eventDate">Event Date</label>
        <Calendar
          id="eventDate"
          value={new Date(formData.eventDate)}
          onChange={(e) =>
            handleChange('eventDate', (e.value as Date)?.toISOString().split('T')[0] || '')
          }
          showIcon
          dateFormat="yy-mm-dd"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button label="Cancel" severity="secondary" type="button" onClick={onCancel} />
        <Button label={activity ? 'Update' : 'Create'} type="submit" />
      </div>
    </form>
  );
};

export default ActivityForm;
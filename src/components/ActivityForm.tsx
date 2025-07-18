'use client';

import { Activity } from '@/types/activity';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import '@/styles/shared/FormButtons.css';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: Omit<Activity, 'id'> | Activity) => Promise<void>;
  onCancel: () => void;
}

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateFromString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState<Date>(new Date());

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setDescription(activity.description);
      setEventDate(parseDateFromString(activity.eventDate));
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<Activity, 'id'> | Activity = {
      ...(activity || {}),
      name,
      description,
      eventDate: formatDateToString(eventDate),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid activity-form">
      <div className="mb-3">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoResize
        />
      </div>

      <div className="mb-3">
        <label htmlFor="eventDate">Event Date</label>
        <Calendar
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.value as Date)}
          showIcon
          dateFormat="yy-mm-dd"
          required
        />
      </div>

      <div className="form-buttons">
        <Button label="Cancel" type="button" className="p-button-danger" onClick={onCancel} />
        <Button label={activity ? 'Update' : 'Create'} type="submit" className="p-button-success" />
      </div>
    </form>
  );
};

export default ActivityForm;
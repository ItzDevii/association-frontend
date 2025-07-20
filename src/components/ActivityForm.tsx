'use client';

import { useEffect, useState } from 'react';
import { Activity } from '@/types/activity';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: Activity | Omit<Activity, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const formatDateToString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDateFromString = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
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
    const payload: Activity | Omit<Activity, 'id'> = {
      ...(activity || {}),
      name,
      description,
      eventDate: formatDateToString(eventDate),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="dialog-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          autoResize
          className="w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="eventDate">Event Date</label>
        <Calendar
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.value as Date)}
          dateFormat="yy-mm-dd"
          showIcon
          required
          className="w-full"
        />
      </div>

      <div className="dialog-footer">
        <Button label="Cancel" type="button" className="btn btn-cancel" onClick={onCancel} />
        <Button label={activity ? 'Update' : 'Create'} type="submit" className="btn btn-success" />
      </div>
    </form>
  );
}
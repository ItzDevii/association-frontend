'use client';

import { useEffect, useState } from 'react';
import { Member } from '@/types/member';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import '@/styles/shared/FormButtons.css';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: Member) => Promise<void>;
  onCancel: () => void;
}

const statusOptions: Member['status'][] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateFromString = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function MemberForm({
  member,
  onSubmit,
  onCancel,
}: MemberFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [joinDate, setJoinDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Member['status']>('ACTIVE');

  useEffect(() => {
    if (member) {
      setFirstName(member.firstName);
      setLastName(member.lastName);
      setJoinDate(parseDateFromString(member.joinDate));
      setStatus(member.status);
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Member = {
      ...(member || {}),
      firstName,
      lastName,
      joinDate: formatDateToLocalString(joinDate),
      status,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="firstName">First Name</label>
        <InputText
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="lastName">Last Name</label>
        <InputText
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="joinDate">Join Date</label>
        <Calendar
          id="joinDate"
          value={joinDate}
          onChange={(e) => setJoinDate(e.value as Date)}
          dateFormat="yy-mm-dd"
          showIcon
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          value={status}
          options={statusOptions}
          onChange={(e) => setStatus(e.value)}
          placeholder="Select Status"
          required
        />
      </div>

      <div className="form-buttons">
        <Button
          label="Cancel"
          type="button"
          className="p-button-danger"
          onClick={onCancel}
        />
        <Button
          label={member ? 'Update' : 'Create'}
          type="submit"
          className="p-button-success"
        />
      </div>
    </form>
  );
}
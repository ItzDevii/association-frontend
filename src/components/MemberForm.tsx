'use client';

import React, { useEffect, useState } from 'react';
import { Member } from '@/types/member';
import { User } from '@/types/user';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { getUsers } from '@/services/userService';
import { classNames } from 'primereact/utils';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: Partial<Member> & { userId: number }) => Promise<void>;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'> & { userId: number | null }>({
    firstName: '',
    lastName: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    user: { id: 0, username: '', role: 'MEMBER' },
    userId: null,
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        userId: member.user?.id || null,
      });
    }
  }, [member]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      setUsers(result);
    };
    fetchUsers();
  }, []);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.userId == null) {
      return alert('Please select a user');
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      joinDate: formData.joinDate,
      status: formData.status,
      userId: formData.userId,
      ...(member?.id && { id: member.id }),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="firstName">First Name</label>
        <InputText
          id="firstName"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="lastName">Last Name</label>
        <InputText
          id="lastName"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="joinDate">Join Date</label>
        <Calendar
          id="joinDate"
          value={new Date(formData.joinDate)}
          onChange={(e) =>
            handleChange('joinDate', (e.value as Date)?.toISOString().split('T')[0] || '')
          }
          dateFormat="yy-mm-dd"
          showIcon
        />
      </div>

      <div className="mb-3">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          value={formData.status}
          options={['ACTIVE', 'INACTIVE', 'SUSPENDED']}
          onChange={(e) => handleChange('status', e.value)}
          placeholder="Select Status"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="userId">User</label>
        <Dropdown
          id="userId"
          value={formData.userId}
          options={users}
          optionLabel="username"
          optionValue="id"
          onChange={(e) => handleChange('userId', e.value)}
          placeholder="Select User"
          filter
          className={classNames({ 'p-invalid': formData.userId === null })}
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button label="Cancel" type="button" severity="secondary" onClick={onCancel} />
        <Button label={member ? 'Update' : 'Create'} type="submit" />
      </div>
    </form>
  );
};

export default MemberForm;
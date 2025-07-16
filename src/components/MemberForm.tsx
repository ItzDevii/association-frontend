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
  onSubmit: (data: Omit<Member, 'id'> | Member) => Promise<void>;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    firstName: '',
    lastName: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    user: { id: 0, username: '', role: 'MEMBER' },
  });

  const [users, setUsers] = useState<User[]>([]);
  const [userInvalid, setUserInvalid] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({ ...member });
    }
  }, [member]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user || !formData.user.id) {
      setUserInvalid(true);
      return;
    }
    await onSubmit(member ? { ...member, ...formData } : formData);
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
          required
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
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="user">User</label>
        <Dropdown
          id="user"
          value={formData.user?.id}
          options={users}
          optionLabel="username"
          optionValue="id"
          onChange={(e) => {
            const selectedUser = users.find((u) => u.id === e.value);
            setUserInvalid(false);
            if (selectedUser) {
              handleChange('user', selectedUser);
            }
          }}
          placeholder="Select User"
          filter
          className={classNames({ 'p-invalid': userInvalid })}
        />
        {userInvalid && (
          <small className="p-error">User is required</small>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button label="Cancel" type="button" severity="secondary" onClick={onCancel} />
        <Button label={member ? 'Update' : 'Create'} type="submit" />
      </div>
    </form>
  );
};

export default MemberForm;
'use client';

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Member } from '@/types/member';
import { createMember, updateMember } from '@/services/memberService';

interface Props {
  member: Member | null;
  onClose: () => void;
}

const MemberForm: React.FC<Props> = ({ member, onClose }) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    firstName: '',
    lastName: '',
    joinDate: '',
    status: 'ACTIVE',
    user: { id: 1, username: '', email: '', role: 'MEMBER' }, // or replace with actual user logic
  });

  useEffect(() => {
    if (member) {
      const { id, ...rest } = member;
      setFormData(rest);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: Date | null) => {
    setFormData(prev => ({
      ...prev,
      joinDate: e ? e.toISOString().split('T')[0] : '',
    }));
  };

  const handleSubmit = async () => {
    try {
      if (member) {
        await updateMember({ ...member, ...formData });
      } else {
        await createMember(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save member', error);
    }
  };

  return (
    <Dialog
      header={member ? 'Edit Member' : 'Create Member'}
      visible
      onHide={onClose}
      style={{ width: '500px' }}
      modal
    >
      <div className="mb-3">
        <label className="form-label">First Name</label>
        <InputText name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <InputText name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Join Date</label>
        <Calendar
          value={formData.joinDate ? new Date(formData.joinDate) : null}
          onChange={(e) => handleDateChange(e.value as Date)}
          dateFormat="yy-mm-dd"
          showIcon
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <Dropdown
          value={formData.status}
          options={['ACTIVE', 'INACTIVE', 'SUSPENDED']}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.value }))}
          className="form-control"
        />
      </div>

      <div className="text-end">
        <Button label="Cancel" className="me-2" onClick={onClose} severity="secondary" />
        <Button label="Save" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default MemberForm;
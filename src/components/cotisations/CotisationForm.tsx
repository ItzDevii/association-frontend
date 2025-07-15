'use client';

import { useEffect, useState } from 'react';
import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/member';
import { createCotisation, updateCotisation } from '@/services/cotisationService';
import { getAllMembers } from '@/services/memberService';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
  cotisation: Cotisation | null;
  onClose: () => void;
}

const CotisationForm: React.FC<Props> = ({ cotisation, onClose }) => {
  const [formData, setFormData] = useState<Omit<Cotisation, 'id'>>({
    amount: 0,
    date: '',
    member: {
      id: 0,
      firstName: '',
      lastName: '',
      joinDate: '',
      status: 'ACTIVE',
      user: { id: 0, username: '', email: '', role: 'MEMBER' },
    },
  });

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await getAllMembers();
      setMembers(data);
    };

    fetchMembers();

    if (cotisation) {
      const { id, ...rest } = cotisation;
      setFormData(rest);
    }
  }, [cotisation]);

  const handleSubmit = async () => {
    try {
      if (cotisation) {
        await updateCotisation({ ...cotisation, ...formData });
      } else {
        await createCotisation(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving cotisation:', error);
    }
  };

  return (
    <Dialog
      header={cotisation ? 'Edit Cotisation' : 'Create Cotisation'}
      visible
      onHide={onClose}
      style={{ width: '500px' }}
      modal
    >
      <div className="mb-3">
        <label className="form-label">Amount</label>
        <InputNumber
          value={formData.amount}
          onValueChange={(e) => setFormData({ ...formData, amount: e.value ?? 0 })}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Date</label>
        <Calendar
          value={formData.date ? new Date(formData.date) : null}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.value ? e.value.toISOString().split('T')[0] : '',
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
          itemTemplate={(member: Member) => `${member.firstName} ${member.lastName}`}
          optionLabel="id"
          className="form-control"
          placeholder="Select a member"
        />
      </div>

      <div className="text-end">
        <Button label="Cancel" onClick={onClose} className="me-2" severity="secondary" />
        <Button label="Save" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default CotisationForm;
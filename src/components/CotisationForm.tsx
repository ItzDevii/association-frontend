'use client';

import { useEffect, useState } from 'react';
import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/member';
import { getMembers } from '@/services/memberService';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
  cotisation?: Cotisation;
  onSubmit: (data: Omit<Cotisation, 'id'> | Cotisation) => Promise<void>;
  onCancel: () => void;
}

const CotisationForm: React.FC<Props> = ({ cotisation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Cotisation, 'id'>>({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    member: {} as Member,
  });

  const [members, setMembers] = useState<{ label: string; value: number; original: Member }[]>([]);

  useEffect(() => {
    if (cotisation) {
      setFormData(cotisation);
    }
  }, [cotisation]);

  useEffect(() => {
    getMembers().then((data) => {
      const formatted = data.map((m) => ({
        label: `${m.firstName} ${m.lastName}`,
        value: m.id,
        original: m,
      }));
      setMembers(formatted);
    });
  }, []);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(cotisation ? { ...cotisation, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="amount">Amount</label>
        <InputNumber
          id="amount"
          value={formData.amount}
          onValueChange={(e) => handleChange('amount', e.value || 0)}
          mode="currency"
          currency="MAD"
          locale="fr-MA"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="paymentDate">Payment Date</label>
        <Calendar
          id="paymentDate"
          value={new Date(formData.paymentDate)}
          onChange={(e) =>
            handleChange('paymentDate', (e.value as Date)?.toISOString().split('T')[0] || '')
          }
          showIcon
          dateFormat="yy-mm-dd"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="member">Member</label>
        <Dropdown
          id="member"
          value={formData.member?.id}
          options={members}
          onChange={(e) => {
            const selected = members.find((m) => m.value === e.value);
            if (selected) handleChange('member', selected.original);
          }}
          placeholder="Select Member"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" label="Cancel" severity="secondary" onClick={onCancel} />
        <Button type="submit" label={cotisation ? 'Update' : 'Create'} />
      </div>
    </form>
  );
};

export default CotisationForm;
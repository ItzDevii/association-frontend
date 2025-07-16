'use client';

import { Cotisation, CotisationRequest } from '@/types/cotisation';
import { Member } from '@/types/member';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useState, useEffect } from 'react';

interface CotisationFormProps {
  cotisation?: Cotisation;
  onSubmit: (data: CotisationRequest) => Promise<void>;
  onCancel: () => void;
  members: Member[];
}

export default function CotisationForm({
  cotisation,
  onSubmit,
  onCancel,
  members,
}: CotisationFormProps) {
  const [formData, setFormData] = useState<CotisationRequest>({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    memberId: 0,
  });

  useEffect(() => {
    if (cotisation) {
      setFormData({
        amount: cotisation.amount,
        paymentDate: cotisation.paymentDate,
        memberId: cotisation.member.id,
      });
    }
  }, [cotisation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="amount">Amount</label>
        <InputNumber
          id="amount"
          value={formData.amount}
          onValueChange={(e) => setFormData({ ...formData, amount: e.value || 0 })}
          mode="decimal"
          currency="MAD"
          locale="en-US"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="paymentDate">Payment Date</label>
        <Calendar
          id="paymentDate"
          value={new Date(formData.paymentDate)}
          onChange={(e) => setFormData({ ...formData, paymentDate: (e.value as Date).toISOString().split('T')[0] })}
          dateFormat="yy-mm-dd"
          showIcon
        />
      </div>

      <div className="mb-3">
        <label htmlFor="member">Member</label>
        <Dropdown
          id="member"
          value={formData.memberId}
          options={members}
          optionLabel={(m) => `${m.firstName} ${m.lastName}`}
          optionValue="id"
          onChange={(e) => setFormData({ ...formData, memberId: e.value })}
          placeholder="Select Member"
          filter
          className={classNames({ 'p-invalid': !formData.memberId })}
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button label="Cancel" type="button" severity="secondary" onClick={onCancel} />
        <Button label={cotisation ? 'Update' : 'Create'} type="submit" />
      </div>
    </form>
  );
}
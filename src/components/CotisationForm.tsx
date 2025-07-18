'use client';

import { useEffect, useState } from 'react';
import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/member';

import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import '@/styles/shared/FormButtons.css';

interface CotisationFormProps {
  cotisation?: Cotisation;
  onSubmit: (data: Cotisation) => Promise<void>;
  onCancel: () => void;
  members: Member[];
}

const formatDateToLocalString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDateFromString = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function CotisationForm({
  cotisation,
  onSubmit,
  onCancel,
  members,
}: CotisationFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [memberId, setMemberId] = useState<number | null>(null);
  const [memberError, setMemberError] = useState(false);

  useEffect(() => {
    if (cotisation) {
      setAmount(cotisation.amount);
      setPaymentDate(parseDateFromString(cotisation.paymentDate));
      setMemberId(cotisation.memberId);
    } else if (members.length > 0) {
      setMemberId(members[0].id!);
    }
  }, [cotisation, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memberId === null) {
      setMemberError(true);
      return;
    }

    const payload: Cotisation = {
      ...(cotisation || {}),
      amount,
      paymentDate: formatDateToLocalString(paymentDate),
      memberId,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="amount">Amount</label>
        <InputNumber
          id="amount"
          value={amount}
          onValueChange={(e) => setAmount(e.value ?? 0)}
          mode="decimal"
          currency="MAD"
          locale="fr-MA"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="paymentDate">Payment Date</label>
        <Calendar
          id="paymentDate"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.value as Date)}
          dateFormat="yy-mm-dd"
          showIcon
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="member">Member</label>
        <Dropdown
          id="member"
          value={memberId}
          options={members}
          optionValue="id"
          optionLabel="firstName"
          onChange={(e) => {
            setMemberId(e.value);
            setMemberError(false);
          }}
          itemTemplate={(m: Member) => <span>{m.firstName} {m.lastName}</span>}
          valueTemplate={() => {
            const selected = members.find((m) => m.id === memberId);
            return selected ? (
              <span>{selected.firstName} {selected.lastName}</span>
            ) : (
              <span>Select Member</span>
            );
          }}
          placeholder="Select Member"
          filter
          className={memberError ? 'p-invalid' : ''}
          required
        />
        {memberError && <small className="p-error">Member is required</small>}
      </div>

      <div className="form-buttons">
        <Button label="Cancel" type="button" className="p-button-danger" onClick={onCancel} />
        <Button label={cotisation ? 'Update' : 'Create'} type="submit" className="p-button-success" />
      </div>
    </form>
  );
}
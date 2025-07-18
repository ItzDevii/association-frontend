'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { Member } from '@/types/member';
import { getMembers } from '@/services/memberService';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface DocumentFormProps {
  document?: Document;
  onSubmit: (data: Document) => void;
  onCancel: () => void;
}

export default function DocumentForm({ document, onSubmit, onCancel }: DocumentFormProps) {
  const [name, setName] = useState(document?.name ?? '');
  const [url, setUrl] = useState(document?.url ?? '');
  const [member, setMember] = useState<Member | null>(document?.member ?? null);
  const [members, setMembers] = useState<(Member & { fullName: string })[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const result = await getMembers();
      const withFullName = result.map((m) => ({
        ...m,
        fullName: `${m.firstName} ${m.lastName}`
      }));
      setMembers(withFullName);
    };

    fetchMembers();
  }, []);

  const handleSubmit = () => {
    if (!member || member.id == null) return;

    const payload: Document = {
      name,
      url,
      memberId: member.id
    };

    if (document?.id != null) {
      payload.id = document.id;
    }

    onSubmit(payload);
  };

  return (
    <div className="card p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="url" className="form-label">URL</label>
        <InputText
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="member" className="form-label">Member</label>
        <Dropdown
          id="member"
          value={member}
          options={members}
          optionLabel="fullName"
          onChange={(e) => setMember(e.value)}
          placeholder="Select a member"
          className="w-full"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          label="Cancel"
          className="p-button-secondary"
          onClick={onCancel}
        />
        <Button
          label="Save"
          onClick={handleSubmit}
          disabled={!member || member.id == null}
        />
      </div>
    </div>
  );
}
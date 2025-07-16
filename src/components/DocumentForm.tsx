'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { Member } from '@/types/member';
import { getMembers } from '@/services/memberService';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
  document?: Document;
  onSubmit: (data: Document | Omit<Document, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const DocumentForm: React.FC<Props> = ({ document, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Document, 'id'>>({
    name: '',
    url: '',
    member: {} as Member,
  });

  const [members, setMembers] = useState<{ label: string; value: number; original: Member }[]>([]);

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name,
        url: document.url,
        member: document.member,
      });
    }
  }, [document]);

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
    if (document) {
      await onSubmit({ ...document, ...formData });
    } else {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="name">Document Name</label>
        <InputText
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="url">Document URL</label>
        <InputText
          id="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          required
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
        <Button type="submit" label={document ? 'Update' : 'Create'} />
      </div>
    </form>
  );
};

export default DocumentForm;
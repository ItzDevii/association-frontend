'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { Member } from '@/types/member';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import '@/styles/shared/FormButtons.css';

interface DocumentFormProps {
  document?: Document;
  onSubmit: (data: Document | Omit<Document, 'id'>) => Promise<void>;
  onCancel: () => void;
  members: Member[];
}

export default function DocumentForm({
  document,
  onSubmit,
  onCancel,
  members,
}: DocumentFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [memberId, setMemberId] = useState<number | null>(null);
  const [memberError, setMemberError] = useState(false);

  useEffect(() => {
    if (document) {
      setName(document.name);
      setUrl(document.url);
      setMemberId(document.memberId ?? document.member?.id ?? null);
    } else if (members.length > 0) {
      setMemberId(members[0].id!);
    }
  }, [document, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memberId === null) {
      setMemberError(true);
      return;
    }

    const payload: Document = {
      ...(document || {}),
      name,
      url,
      memberId,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="mb-3">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="url">URL</label>
        <InputText
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        {url && (
          <div className="mt-2">
            <a
              href={url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0d6efd', textDecoration: 'underline', wordBreak: 'break-word' }}
            >
              {url}
            </a>
          </div>
        )}
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
        <Button label={document ? 'Update' : 'Create'} type="submit" className="p-button-success" />
      </div>
    </form>
  );
}
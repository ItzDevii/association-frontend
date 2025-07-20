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
    <form onSubmit={handleSubmit} className="dialog-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL</label>
        <InputText
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full"
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

      <div className="form-group">
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
          className={`w-full ${memberError ? 'p-invalid' : ''}`}
          required
        />
        {memberError && <small className="p-error">Member is required</small>}
      </div>

      <div className="dialog-footer">
        <Button label="Cancel" type="button" className="btn btn-cancel" onClick={onCancel} />
        <Button label={document ? 'Update' : 'Create'} type="submit" className="btn btn-success" />
      </div>
    </form>
  );
}
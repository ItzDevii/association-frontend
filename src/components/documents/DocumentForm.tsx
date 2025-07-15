'use client';

import { useEffect, useState } from 'react';
import { createDocument, updateDocument } from '@/services/documentService';
import { getAllMembers } from '@/services/memberService';
import { Member } from '@/types/member';
import { Document } from '@/types/document';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
  document: Document | null;
  onClose: () => void;
}

const DocumentForm: React.FC<Props> = ({ document, onClose }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Omit<Document, 'id'>>({
    title: '',
    type: '',
    uploadDate: '',
    member: {
      id: 0,
      firstName: '',
      lastName: '',
      joinDate: '',
      status: 'ACTIVE',
      user: { id: 0, username: '', email: '', role: 'MEMBER' },
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await getAllMembers();
      setMembers(data);
    };

    fetchMembers();

    if (document) {
      const { id, ...rest } = document;
      setFormData(rest);
    }
  }, [document]);

  const handleSubmit = async () => {
    try {
      if (document) {
        await updateDocument({ ...document, ...formData });
      } else {
        await createDocument(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <Dialog
      header={document ? 'Edit Document' : 'Create Document'}
      visible
      onHide={onClose}
      style={{ width: '500px' }}
      modal
    >
      <div className="mb-3">
        <label className="form-label">Title</label>
        <InputText
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Type</label>
        <InputText
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Date</label>
        <Calendar
          value={formData.uploadDate ? new Date(formData.uploadDate) : null}
          onChange={(e) =>
            setFormData({
              ...formData,
              uploadDate: e.value ? e.value.toISOString().split('T')[0] : '',
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

export default DocumentForm;
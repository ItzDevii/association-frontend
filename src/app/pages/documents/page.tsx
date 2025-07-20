'use client';

import { useEffect, useRef, useState } from 'react';
import { Document } from '@/types/document';
import { Member } from '@/types/member';

import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/services/documentService';
import { getMembers } from '@/services/memberService';

import DocumentForm from '@/components/DocumentForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadDocuments();
    loadMembers();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load documents',
      });
    }
  };

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load members',
      });
    }
  };

  const handleCreate = () => {
    setSelectedDocument(null);
    setShowForm(true);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id);
      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Document deleted',
      });
      loadDocuments();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Delete failed',
      });
    }
  };

  const handleSubmit = async (data: Document | Omit<Document, 'id'>) => {
    try {
      if ('id' in data && data.id) {
        await updateDocument(data);
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Document updated',
        });
      } else {
        await createDocument(data as Omit<Document, 'id'>);
        toast.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Document created',
        });
      }
      setShowForm(false);
      loadDocuments();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Submit failed',
      });
    }
  };

  const getMemberName = (memberId: number | undefined): string => {
    if (memberId === undefined) return '—';
    const member = members.find((m) => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : '—';
  };

  const renderUrl = (rowData: Document) => {
    const url = rowData.url;
    const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    return (
      <a href={validUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd' }}>
        {url}
      </a>
    );
  };

  const actionBodyTemplate = (rowData: Document) => (
    <div className="actions-column">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(rowData.id!)} />
    </div>
  );

  return (
    <div className="table-wrapper">
      <Toast ref={toast} />

      <div className="table-header">
        <h2>Documents</h2>
        <Button label="New Document" icon="pi pi-plus" className="btn btn-primary" onClick={handleCreate} />
      </div>

      <DataTable value={documents} paginator rows={10} stripedRows>
        <Column field="name" header="Name" />
        <Column header="URL" body={renderUrl} />
        <Column header="Member" body={(rowData) => getMemberName(rowData.memberId ?? rowData.member?.id)} />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedDocument ? 'Edit Document' : 'New Document'}
        style={{ width: '40rem' }}
        modal
        className="member-dialog"
      >
        <DocumentForm
          document={selectedDocument ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          members={members}
        />
      </Dialog>
    </div>
  );
}
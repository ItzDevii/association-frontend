'use client';

import { useEffect, useState, useRef } from 'react';
import { Document } from '@/types/document';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} from '@/services/documentService';

import DocumentForm from '@/components/DocumentForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load documents' });
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

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
      toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Document deleted' });
      loadDocuments();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
    }
  };

  const handleSubmit = async (data: Document) => {
    try {
      if (data.id !== undefined) {
        await updateDocument(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Document updated' });
      } else {
        await createDocument(data);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Document created' });
      }
      setShowForm(false);
      loadDocuments();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Submit failed' });
    }
  };

  const actionBodyTemplate = (rowData: Document) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" severity="danger" rounded text onClick={() => handleDelete(rowData.id!)} />
    </div>
  );

  const memberNameTemplate = (rowData: Document) =>
    rowData.member ? `${rowData.member.firstName} ${rowData.member.lastName}` : '—';

  const urlTemplate = (rowData: Document) => (
    <a href={rowData.url} target="_blank" rel="noopener noreferrer">
      {rowData.url}
    </a>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Documents</h2>
        <Button label="New Document" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={documents} paginator rows={10} stripedRows>
        <Column field="name" header="Name" />
        <Column header="URL" body={urlTemplate} />
        <Column header="Member" body={memberNameTemplate} />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedDocument ? 'Edit Document' : 'New Document'}
        style={{ width: '40rem' }}
        modal
      >
        <DocumentForm
          document={selectedDocument ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Dialog>
    </div>
  );
}
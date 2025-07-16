'use client';

import { useEffect, useRef, useState } from 'react';
import { Document } from '@/types/document';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/services/documentService';
import DocumentForm from '@/components/DocumentForm';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const DocumentPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState<Document | undefined>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const data = await getDocuments();
    setDocuments(data);
  };

  const handleCreate = () => {
    setSelected(undefined);
    setDialogVisible(true);
  };

  const handleEdit = (document: Document) => {
    setSelected(document);
    setDialogVisible(true);
  };

  const handleSubmit = async (data: Document | Omit<Document, 'id'>) => {
    try {
      if ('id' in data) {
        await updateDocument(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Document updated' });
      } else {
        await createDocument(data);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Document created' });
      }
      setDialogVisible(false);
      fetchDocuments();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save document' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id);
      toast.current?.show({ severity: 'info', summary: 'Deleted', detail: 'Document deleted' });
      fetchDocuments();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not delete document' });
    }
  };

  const renderActions = (rowData: Document) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" rounded severity="danger" onClick={() => handleDelete(rowData.id)} />
    </div>
  );

  return (
    <div className="container">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Documents</h2>
        <Button label="Create" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={documents} paginator rows={10}>
        <Column field="name" header="Name" />
        <Column field="url" header="URL" />
        <Column
          header="Member"
          body={(rowData: Document) => `${rowData.member.firstName} ${rowData.member.lastName}`}
        />
        <Column header="Actions" body={renderActions} />
      </DataTable>

      <Dialog
        header={selected ? 'Edit Document' : 'Create Document'}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: '40rem' }}
        breakpoints={{ '960px': '95vw' }}
      >
        <DocumentForm
          document={selected}
          onSubmit={handleSubmit}
          onCancel={() => setDialogVisible(false)}
        />
      </Dialog>
    </div>
  );
};

export default DocumentPage;
'use client';

import { useEffect, useState } from 'react';
import { getAllDocuments, deleteDocument } from '@/services/documentService';
import { Document } from '@/types/document';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import DocumentForm from './DocumentForm';

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadDocuments = async () => {
    const data = await getAllDocuments();
    setDocuments(data);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteDocument(id);
    await loadDocuments();
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedDocument(null);
    setShowForm(false);
    loadDocuments();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Documents</h2>
        <Button label="Create Document" icon="pi pi-plus" onClick={() => setShowForm(true)} />
      </div>

      <DataTable value={documents} dataKey="id" paginator rows={5}>
        <Column field="name" header="Name" />
        <Column field="uploadDate" header="Upload Date" />
        <Column
          field="member"
          header="Member"
          body={(doc: Document) => `${doc.member.firstName} ${doc.member.lastName}`}
        />
        <Column
          header="Actions"
          body={(doc: Document) => (
            <div className="d-flex gap-2">
              <Button icon="pi pi-pencil" onClick={() => handleEdit(doc)} />
              <Button icon="pi pi-trash" severity="danger" onClick={() => handleDelete(doc.id)} />
            </div>
          )}
        />
      </DataTable>

      {showForm && (
        <DocumentForm
          document={selectedDocument}
          onClose={handleFormClose}
        />
      )}
    </>
  );
};

export default DocumentList;
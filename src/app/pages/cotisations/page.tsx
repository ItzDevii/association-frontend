'use client';

import { useEffect, useRef, useState } from 'react';
import { Cotisation } from '@/types/cotisation';
import {
  getCotisations,
  createCotisation,
  updateCotisation,
  deleteCotisation,
} from '@/services/cotisationService';
import CotisationForm from '@/components/CotisationForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function CotisationsPage() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  const loadCotisations = async () => {
    try {
      const data = await getCotisations();
      setCotisations(data);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load cotisations' });
    }
  };

  useEffect(() => {
    loadCotisations();
  }, []);

  const handleCreate = () => {
    setSelectedCotisation(null);
    setShowForm(true);
  };

  const handleEdit = (cotisation: Cotisation) => {
    setSelectedCotisation(cotisation);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCotisation(id);
      toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Cotisation deleted' });
      loadCotisations();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
    }
  };

  const handleSubmit = async (data: Cotisation | Omit<Cotisation, 'id'>) => {
    try {
      if ('id' in data) {
        await updateCotisation(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Cotisation updated' });
      } else {
        await createCotisation(data);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Cotisation created' });
      }
      setShowForm(false);
      loadCotisations();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Submit failed' });
    }
  };

  const actionTemplate = (row: Cotisation) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(row)} />
      <Button icon="pi pi-trash" severity="danger" rounded text onClick={() => handleDelete(row.id)} />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Cotisations</h2>
        <Button label="Create Cotisation" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={cotisations} paginator rows={10} stripedRows>
        <Column field="amount" header="Amount (MAD)" />
        <Column field="paymentDate" header="Payment Date" />
        <Column
          header="Member"
          body={(row) => `${row.member.firstName} ${row.member.lastName}`}
        />
        <Column body={actionTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedCotisation ? 'Edit Cotisation' : 'New Cotisation'}
        style={{ width: '40rem' }}
        modal
      >
        <CotisationForm
          cotisation={selectedCotisation ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Dialog>
    </div>
  );
}
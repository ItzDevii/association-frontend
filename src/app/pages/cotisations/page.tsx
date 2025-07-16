'use client';

import { useEffect, useRef, useState } from 'react';
import { Cotisation } from '@/types/cotisation';
import { getCotisations, createCotisation, updateCotisation, deleteCotisation } from '@/services/cotisationService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import CotisationForm from '@/components/CotisationForm';

export default function CotisationsPage() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  const loadCotisations = async () => {
    try {
      const data = await getCotisations();
      setCotisations(data);
    } catch (err) {
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

  const handleSubmit = async (data: Partial<Cotisation> & { memberId: number }) => {
    try {
      if ('id' in data && data.id) {
        await updateCotisation(data.id, data);
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

  const actionBodyTemplate = (rowData: Cotisation) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" severity="danger" rounded text onClick={() => handleDelete(rowData.id)} />
    </div>
  );

  const amountTemplate = (rowData: Cotisation) => (
    <span>{Number(rowData.amount).toLocaleString()} MAD</span>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Cotisations</h2>
        <Button label="Create Cotisation" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={cotisations} paginator rows={10} stripedRows>
        <Column field="amount" header="Amount" body={amountTemplate} />
        <Column field="paymentDate" header="Payment Date" />
        <Column field="member.firstName" header="Member First Name" />
        <Column field="member.lastName" header="Member Last Name" />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedCotisation ? 'Edit Cotisation' : 'Create Cotisation'}
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
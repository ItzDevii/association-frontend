'use client';

import { useEffect, useState, useRef } from 'react';
import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/member';

import {
  getCotisations,
  createCotisation,
  updateCotisation,
  deleteCotisation,
} from '@/services/cotisationService';
import { getMembers } from '@/services/memberService';

import CotisationForm from '@/components/CotisationForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function CotisationPage() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadCotisations();
    loadMembers();
  }, []);

  const loadCotisations = async () => {
    try {
      const data = await getCotisations();
      setCotisations(data);
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load cotisations',
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
      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Cotisation deleted',
      });
      loadCotisations();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Delete failed',
      });
    }
  };

  const handleSubmit = async (data: Cotisation | Omit<Cotisation, 'id'>) => {
    try {
      if ('id' in data && data.id) {
        await updateCotisation(data.id, data);
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Cotisation updated',
        });
      } else {
        await createCotisation(data as Omit<Cotisation, 'id'>);
        toast.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Cotisation created',
        });
      }
      setShowForm(false);
      loadCotisations();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Submit failed',
      });
    }
  };

  const getMemberName = (id: number | undefined): string => {
    const member = members.find((m) => m.id === id);
    return member ? `${member.firstName} ${member.lastName}` : '—';
  };

  const actionBodyTemplate = (rowData: Cotisation) => (
    <div className="actions-column">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        onClick={() => handleEdit(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData.id!)}
      />
    </div>
  );

  return (
    <div className="table-wrapper">
      <Toast ref={toast} />

      <div className="table-header">
        <h2>Cotisations</h2>
        <Button
          label="New Cotisation"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={handleCreate}
        />
      </div>

      <DataTable value={cotisations} paginator rows={10} stripedRows>
        <Column field="amount" header="Amount" />
        <Column field="paymentDate" header="Payment Date" />
        <Column
          header="Member"
          body={(rowData) => getMemberName(rowData.memberId)}
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ width: '8rem' }}
        />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedCotisation ? 'Edit Cotisation' : 'New Cotisation'}
        style={{ width: '40rem' }}
        modal
        className="member-dialog"
      >
        <CotisationForm
          cotisation={selectedCotisation ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          members={members}
        />
      </Dialog>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Participation } from '@/types/participation';
import { getParticipations, createParticipation, updateParticipation, deleteParticipation } from '@/services/participationService';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ParticipationForm from '@/components/ParticipationForm';
import { Dialog } from 'primereact/dialog';
import { useRef } from 'react';

const ParticipationPage = () => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [selected, setSelected] = useState<Participation | undefined>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    const data = await getParticipations();
    setParticipations(data);
  };

  const handleCreate = () => {
    setSelected(undefined);
    setDialogVisible(true);
  };

  const handleEdit = (p: Participation) => {
    setSelected(p);
    setDialogVisible(true);
  };

  const handleSubmit = async (data: Participation | Omit<Participation, 'id'>) => {
    try {
      if ('id' in data) {
        await updateParticipation(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Participation updated successfully' });
      } else {
        await createParticipation(data);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Participation created successfully' });
      }
      setDialogVisible(false);
      fetchParticipations();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteParticipation(id);
      toast.current?.show({ severity: 'info', summary: 'Deleted', detail: 'Participation deleted' });
      fetchParticipations();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not delete participation' });
    }
  };

  const renderActions = (rowData: Participation) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" rounded severity="danger" onClick={() => handleDelete(rowData.id)} />
    </div>
  );

  return (
    <div className="container">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Participations</h2>
        <Button label="Create" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={participations} paginator rows={10}>
        <Column field="member.firstName" header="Member First Name" />
        <Column field="member.lastName" header="Member Last Name" />
        <Column field="activity.name" header="Activity" />
        <Column field="signupDate" header="Signup Date" />
        <Column body={renderActions} header="Actions" />
      </DataTable>

      <Dialog
        header={selected ? 'Edit Participation' : 'Create Participation'}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: '40rem' }}
        breakpoints={{ '960px': '95vw' }}
      >
        <ParticipationForm
          participation={selected}
          onSubmit={handleSubmit}
          onCancel={() => setDialogVisible(false)}
        />
      </Dialog>
    </div>
  );
};

export default ParticipationPage;
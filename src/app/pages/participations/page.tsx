'use client';

import { useEffect, useRef, useState } from 'react';
import { Participation } from '@/types/participation';
import { Member } from '@/types/member';
import { Activity } from '@/types/activity';

import {
  getParticipations,
  createParticipation,
  updateParticipation,
  deleteParticipation,
} from '@/services/participationService';

import { getMembers } from '@/services/memberService';
import { getActivities } from '@/services/activityService';

import ParticipationForm from '@/components/ParticipationForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function ParticipationPage() {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadParticipations();
    loadMembers();
    loadActivities();
  }, []);

  const loadParticipations = async () => {
    try {
      const data = await getParticipations();
      setParticipations(data);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load participations' });
    }
  };

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load members' });
    }
  };

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load activities' });
    }
  };

  const handleCreate = () => {
    setSelectedParticipation(null);
    setShowForm(true);
  };

  const handleEdit = (participation: Participation) => {
    setSelectedParticipation(participation);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteParticipation(id);
      toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Participation deleted' });
      loadParticipations();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
    }
  };

  const handleSubmit = async (data: Participation | Omit<Participation, 'id'>) => {
    try {
      if ('id' in data && data.id) {
        await updateParticipation(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Participation updated' });
      } else {
        await createParticipation(data as Omit<Participation, 'id'>);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Participation created' });
      }
      setShowForm(false);
      loadParticipations();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Submit failed' });
    }
  };

  const getMemberName = (id?: number) => {
    if (!id) return '—';
    const member = members.find((m) => m.id === id);
    return member ? `${member.firstName} ${member.lastName}` : '—';
  };

  const getActivityName = (id?: number) => {
    if (!id) return '—';
    const activity = activities.find((a) => a.id === id);
    return activity ? activity.name : '—';
  };

  const actionBodyTemplate = (rowData: Participation) => (
    <div className="actions-column">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(rowData.id!)} />
    </div>
  );

  return (
    <div className="table-wrapper">
      <Toast ref={toast} />

      <div className="table-header">
        <h2>Participations</h2>
        <Button label="New Participation" icon="pi pi-plus" className="btn btn-primary" onClick={handleCreate} />
      </div>

      <DataTable value={participations} paginator rows={10} stripedRows>
        <Column header="Member" body={(row) => getMemberName(row.memberId)} />
        <Column header="Activity" body={(row) => getActivityName(row.activityId)} />
        <Column field="signupDate" header="Signup Date" />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedParticipation ? 'Edit Participation' : 'New Participation'}
        style={{ width: '40rem' }}
        modal
        className="member-dialog"
      >
        <ParticipationForm
          participation={selectedParticipation ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          members={members}
          activities={activities}
        />
      </Dialog>
    </div>
  );
}
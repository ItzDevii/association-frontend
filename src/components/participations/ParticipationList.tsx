'use client';

import { useEffect, useState } from 'react';
import { getAllParticipations, deleteParticipation } from '@/services/participationService';
import { Participation } from '@/types/participation';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ParticipationForm from './ParticipationForm';

const ParticipationList = () => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadParticipations = async () => {
    const data = await getAllParticipations();
    setParticipations(data);
  };

  useEffect(() => {
    loadParticipations();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteParticipation(id);
    await loadParticipations();
  };

  const handleEdit = (p: Participation) => {
    setSelectedParticipation(p);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedParticipation(null);
    setShowForm(false);
    loadParticipations();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Participations</h2>
        <Button label="Create Participation" icon="pi pi-plus" onClick={() => setShowForm(true)} />
      </div>

      <DataTable value={participations} dataKey="id" paginator rows={5}>
        <Column
          field="member"
          header="Member"
          body={(rowData: Participation) => `${rowData.member.firstName} ${rowData.member.lastName}`}
        />
        <Column field="activity.title" header="Activity" body={(rowData: Participation) => rowData.activity.title} />
        <Column field="participationDate" header="Date" />
        <Column
          header="Actions"
          body={(rowData: Participation) => (
            <div className="d-flex gap-2">
              <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />
              <Button icon="pi pi-trash" severity="danger" onClick={() => handleDelete(rowData.id)} />
            </div>
          )}
        />
      </DataTable>

      {showForm && (
        <ParticipationForm
          participation={selectedParticipation}
          onClose={handleFormClose}
        />
      )}
    </>
  );
};

export default ParticipationList;
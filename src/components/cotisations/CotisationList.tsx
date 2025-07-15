'use client';

import { useEffect, useState } from 'react';
import { getAllCotisations, deleteCotisation } from '@/services/cotisationService';
import { Cotisation } from '@/types/cotisation';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CotisationForm from './CotisationForm';

const CotisationList = () => {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadCotisations = async () => {
    const data = await getAllCotisations();
    setCotisations(data);
  };

  useEffect(() => {
    loadCotisations();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteCotisation(id);
    await loadCotisations();
  };

  const handleEdit = (cotisation: Cotisation) => {
    setSelectedCotisation(cotisation);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedCotisation(null);
    setShowForm(false);
    loadCotisations();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Cotisations</h2>
        <Button label="Create Cotisation" icon="pi pi-plus" onClick={() => setShowForm(true)} />
      </div>

      <DataTable value={cotisations} dataKey="id" paginator rows={5}>
        <Column field="amount" header="Amount" />
        <Column field="date" header="Date" />
        <Column
          field="member"
          header="Member"
          body={(rowData: Cotisation) => `${rowData.member.firstName} ${rowData.member.lastName}`}
        />
        <Column
          header="Actions"
          body={(rowData: Cotisation) => (
            <div className="d-flex gap-2">
              <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />
              <Button icon="pi pi-trash" severity="danger" onClick={() => handleDelete(rowData.id)} />
            </div>
          )}
        />
      </DataTable>

      {showForm && (
        <CotisationForm
          cotisation={selectedCotisation}
          onClose={handleFormClose}
        />
      )}
    </>
  );
};

export default CotisationList;
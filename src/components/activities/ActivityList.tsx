'use client';

import { useEffect, useState } from 'react';
import { getAllActivities, deleteActivity } from '@/services/activityService';
import { Activity } from '@/types/activity';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ActivityForm from './ActivityForm';

const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadActivities = async () => {
    const data = await getAllActivities();
    setActivities(data);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteActivity(id);
    await loadActivities();
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedActivity(null);
    setShowForm(false);
    loadActivities();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Activities</h2>
        <Button label="Create Activity" icon="pi pi-plus" onClick={() => setShowForm(true)} />
      </div>

      <DataTable value={activities} dataKey="id" paginator rows={5}>
        <Column field="title" header="Title" />
        <Column field="description" header="Description" />
        <Column field="date" header="Date" />
        <Column
          header="Actions"
          body={(rowData: Activity) => (
            <div className="d-flex gap-2">
              <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />
              <Button icon="pi pi-trash" severity="danger" onClick={() => handleDelete(rowData.id)} />
            </div>
          )}
        />
      </DataTable>

      {showForm && (
        <ActivityForm activity={selectedActivity} onClose={handleFormClose} />
      )}
    </>
  );
};

export default ActivityList;
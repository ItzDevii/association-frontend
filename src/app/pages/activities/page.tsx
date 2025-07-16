'use client';

import { useEffect, useState, useRef } from 'react';
import { Activity } from '@/types/activity';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity
} from '@/services/activityService';

import ActivityForm from '@/components/ActivityForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load activities' });
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleCreate = () => {
    setSelectedActivity(null);
    setShowForm(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteActivity(id);
      toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Activity deleted' });
      loadActivities();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
    }
  };

  const handleSubmit = async (data: Omit<Activity, 'id'> | Activity) => {
    try {
      if ('id' in data) {
        await updateActivity(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Activity updated' });
      } else {
        await createActivity(data);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Activity created' });
      }
      setShowForm(false);
      loadActivities();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Submit failed' });
    }
  };

  const actionBodyTemplate = (rowData: Activity) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" severity="danger" rounded text onClick={() => handleDelete(rowData.id)} />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Activities</h2>
        <Button label="New Activity" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={activities} paginator rows={10} stripedRows>
        <Column field="name" header="Name" />
        <Column field="eventDate" header="Event Date" />
        <Column field="description" header="Description" />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedActivity ? 'Edit Activity' : 'New Activity'}
        style={{ width: '40rem' }}
        modal
      >
        <ActivityForm
          activity={selectedActivity ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Dialog>
    </div>
  );
}
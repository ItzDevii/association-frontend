'use client';

import { useEffect, useRef, useState } from 'react';
import { Activity } from '@/types/activity';
import { getActivities, createActivity, updateActivity, deleteActivity } from '@/services/activityService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import ActivityForm from '@/components/ActivityForm';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const toast = useRef<Toast>(null);

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load activities' });
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleCreate = () => {
    setSelectedActivity(null);
    setFormVisible(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteActivity(id);
      toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Activity deleted successfully' });
      loadActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete activity' });
    }
  };

  const handleSubmit = async (data: Omit<Activity, 'id'> | Activity) => {
    try {
      if ('id' in data) {
        await updateActivity(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Activity updated successfully' });
      } else {
        await createActivity(data);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Activity created successfully' });
      }
      setFormVisible(false);
      loadActivities();
    } catch (error) {
      console.error('Failed to save activity:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save activity' });
    }
  };

  return (
    <div className="container">
      <Toast ref={toast} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0 fw-bold">Activities</h2>
        <Button label="Create Activity" icon="pi pi-plus" className="bg-primary text-white border-0" onClick={handleCreate} />
      </div>

      <DataTable
        value={activities}
        paginator
        rows={5}
        responsiveLayout="scroll"
        emptyMessage="No activities found"
        className="p-datatable-sm"
      >
        <Column field="name" header="Name" sortable />
        <Column field="eventDate" header="Event Date" sortable />
        <Column field="description" header="Description" />
        <Column
          header="Actions"
          body={(rowData: Activity) => (
            <div className="d-flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info"
                onClick={() => handleEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => handleDelete(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={selectedActivity ? 'Edit Activity' : 'Create Activity'}
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        style={{ width: '40vw' }}
      >
        <ActivityForm
          activity={selectedActivity || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormVisible(false)}
        />
      </Dialog>
    </div>
  );
};

export default ActivitiesPage;
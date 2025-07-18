'use client';

import { useEffect, useState, useRef } from 'react';
import { Member } from '@/types/member';
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from '@/services/memberService';

import MemberForm from '@/components/MemberForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load members' });
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleCreate = () => {
    setSelectedMember(null);
    setShowForm(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMember(id);
      toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Member deleted' });
      loadMembers();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
    }
  };

  const handleSubmit = async (data: Omit<Member, 'id'> | Member) => {
    try {
      if ('id' in data && data.id) {
        await updateMember(data);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Member updated' });
      } else {
        await createMember(data as Omit<Member, 'id'>);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Member created' });
      }
      setShowForm(false);
      loadMembers();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Submit failed' });
    }
  };

  const actionBodyTemplate = (rowData: Member) => (
    <div className="d-flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" severity="danger" rounded text onClick={() => handleDelete(rowData.id!)} />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Members</h2>
        <Button label="New Member" icon="pi pi-plus" onClick={handleCreate} />
      </div>

      <DataTable value={members} paginator rows={10} stripedRows>
        <Column field="firstName" header="First Name" />
        <Column field="lastName" header="Last Name" />
        <Column field="joinDate" header="Join Date" />
        <Column field="status" header="Status" />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedMember ? 'Edit Member' : 'New Member'}
        style={{ width: '40rem' }}
        modal
      >
        <MemberForm
          member={selectedMember ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Dialog>
    </div>
  );
}
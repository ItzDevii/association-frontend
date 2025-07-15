'use client';

import { useEffect, useState } from 'react';
import { getAllMembers, deleteMember } from '@/services/memberService';
import { Member } from '@/types/member';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MemberForm from './MemberForm';

const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadMembers = async () => {
    const data = await getAllMembers();
    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteMember(id);
    await loadMembers();
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedMember(null);
    setShowForm(false);
    loadMembers();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Members</h2>
        <Button label="Create Member" icon="pi pi-plus" onClick={() => setShowForm(true)} />
      </div>

      <DataTable value={members} dataKey="id" paginator rows={5}>
        <Column field="firstName" header="First Name" />
        <Column field="lastName" header="Last Name" />
        <Column field="joinDate" header="Join Date" />
        <Column field="status" header="Status" />
        <Column
          header="Actions"
          body={(rowData: Member) => (
            <div className="d-flex gap-2">
              <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />
              <Button icon="pi pi-trash" severity="danger" onClick={() => handleDelete(rowData.id)} />
            </div>
          )}
        />
      </DataTable>

      {showForm && (
        <MemberForm
          member={selectedMember}
          onClose={handleFormClose}
        />
      )}
    </>
  );
};

export default MemberList;
'use client';

import { Member } from '@/types/Member';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Props {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

const MemberTable: React.FC<Props> = ({ members, onEdit, onDelete }) => {
  const actionTemplate = (rowData: Member) => (
    <div className="d-flex gap-2">
      <button className="btn btn-sm btn-warning" onClick={() => onEdit(rowData)}>Edit</button>
      <button className="btn btn-sm btn-danger" onClick={() => onDelete(rowData)}>Delete</button>
    </div>
  );

  return (
    <DataTable
      value={members}
      paginator
      rows={5}
      responsiveLayout="scroll"
      className="mt-3"
      emptyMessage="No members found"
    >
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="status" header="Status" sortable />
      <Column header="Actions" body={actionTemplate} />
    </DataTable>
  );
};

export default MemberTable;
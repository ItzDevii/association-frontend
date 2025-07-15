'use client';

import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/Member';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Props {
  cotisations: Cotisation[];
  members: Member[];
  onEdit: (cotisation: Cotisation) => void;
  onDelete: (cotisation: Cotisation) => void;
}

const CotisationTable: React.FC<Props> = ({ cotisations, members, onEdit, onDelete }) => {
  const getMemberName = (memberId: number) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const actionTemplate = (rowData: Cotisation) => (
    <div className="d-flex gap-2">
      <button className="btn btn-sm btn-warning" onClick={() => onEdit(rowData)}>Edit</button>
      <button className="btn btn-sm btn-danger" onClick={() => onDelete(rowData)}>Delete</button>
    </div>
  );

  return (
    <DataTable
      value={cotisations}
      paginator
      rows={5}
      responsiveLayout="scroll"
      className="mt-3"
      emptyMessage="No cotisations found"
    >
      <Column field="id" header="ID" sortable />
      <Column field="amount" header="Amount (MAD)" sortable />
      <Column field="date" header="Date" sortable />
      <Column header="Member" body={(rowData) => getMemberName(rowData.memberId)} />
      <Column header="Actions" body={actionTemplate} />
    </DataTable>
  );
};

export default CotisationTable;
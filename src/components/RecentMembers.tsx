import { Member } from '@/types/Member';

interface Props {
  members: Member[];
}

const RecentMembers: React.FC<Props> = ({ members }) => {
  const recent = [...members]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()) // ✅ FIXED
    .slice(0, 5);

  return (
    <div className="card shadow-sm border-0 rounded p-4">
      <h5 className="text-secondary mb-3">Recent Members</h5>
      <ul className="list-group list-group-flush">
        {recent.map((m) => (
          <li key={m.id} className="list-group-item">
            {m.firstName} {m.lastName} –{' '}
            <small className="text-muted">{new Date(m.joinDate).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentMembers;
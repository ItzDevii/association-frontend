'use client';

import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/member';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CotisationChartProps {
  cotisations: Cotisation[];
  members: Member[];
}

const CotisationChart: React.FC<CotisationChartProps> = ({ cotisations, members }) => {
  const chartData = useMemo(() => {
    const grouped: { [key: string]: number } = {};

    cotisations.forEach((c) => {
      const member = members.find((m) => m.id === c.memberId);
      const label = member ? `${member.firstName} ${member.lastName}` : 'Unknown';

      if (!grouped[label]) {
        grouped[label] = 0;
      }
      grouped[label] += c.amount;
    });

    return Object.entries(grouped).map(([name, total]) => ({
      name,
      total,
    }));
  }, [cotisations, members]);

  return (
    <div className="card p-4">
      <h5 className="mb-4">Total Cotisations per Member</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CotisationChart;
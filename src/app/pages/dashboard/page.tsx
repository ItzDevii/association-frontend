'use client';

import { useEffect, useState } from 'react';
import { getMembers } from '@/services/memberService';
import { getCotisations } from '@/services/cotisationService';
import { getActivities } from '@/services/activityService';
import { Member } from '@/types/member';
import { Cotisation } from '@/types/cotisation';
import { Activity } from '@/types/activity';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

const DashboardPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const membersData = await getMembers();
      const cotisationsData = await getCotisations();
      const activitiesData = await getActivities();

      setMembers(membersData);
      setCotisations(cotisationsData);
      setActivities(activitiesData);

      const monthlyTotals = Array(12).fill(0);
      cotisationsData.forEach(c => {
        const month = new Date(c.paymentDate).getMonth();
        monthlyTotals[month] += c.amount;
      });
      setMonthlyData(monthlyTotals);
    };

    fetchData();
  }, []);

  const barData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Monthly Cotisations (MAD)',
        backgroundColor: '#0d6efd',
        data: monthlyData,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value.toLocaleString()} MAD`,
        },
      },
    },
  };

  return (
    <div className="container">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <Card title="Total Members" className="text-center">
            <h3>{members.length}</h3>
          </Card>
        </div>
        <div className="col-md-4">
          <Card title="Total Cotisations" className="text-center">
            <h3>
              {cotisations
                .reduce((sum, c) => sum + c.amount, 0)
                .toLocaleString()}{' '}
              MAD
            </h3>
          </Card>
        </div>
        <div className="col-md-4">
          <Card title="Total Activities" className="text-center">
            <h3>{activities.length}</h3>
          </Card>
        </div>
      </div>

      <Card title="Cotisations by Month">
        <Chart type="bar" data={barData} options={barOptions} />
      </Card>
    </div>
  );
};

export default DashboardPage;
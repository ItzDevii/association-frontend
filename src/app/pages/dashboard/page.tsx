'use client';

import { useEffect, useState } from 'react';
import { getCotisations } from '@/services/cotisationService';
import { getMembers } from '@/services/memberService';
import { Cotisation } from '@/types/cotisation';
import { Member } from '@/types/member';
import CotisationChart from '@/components/CotisationChart';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function DashboardPage() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cotisationData, memberData] = await Promise.all([
          getCotisations(),
          getMembers(),
        ]);
        setCotisations(cotisationData);
        setMembers(memberData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <CotisationChart cotisations={cotisations} members={members} />
    </div>
  );
}
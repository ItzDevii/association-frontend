'use client';

import { useEffect, useState } from 'react';
import { getMembers } from '@/services/memberService';
import { getCotisations } from '@/services/cotisationService';
import { Member } from '@/types/member';
import { Cotisation } from '@/types/cotisation';
import { Card } from 'primereact/card';

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const membersData = await getMembers();
      const cotisationsData = await getCotisations();
      setMembers(membersData);
      setCotisations(cotisationsData);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4">
          <Card className="shadow-sm">
            <h5>Total Members</h5>
            <p className="fs-3 fw-semibold text-primary">{members.length}</p>
          </Card>
        </div>

        <div className="col-md-6 col-lg-4">
          <Card className="shadow-sm">
            <h5>Total Cotisations</h5>
            <p className="fs-3 fw-semibold text-success">{cotisations.length}</p>
          </Card>
        </div>

        <div className="col-md-6 col-lg-4">
          <Card className="shadow-sm">
            <h5>Total Amount (MAD)</h5>
            <p className="fs-3 fw-semibold text-dark">
              {cotisations.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      {/* Optional: Recent Cotisations or Activities */}
      <div className="mt-5">
        <h4 className="mb-3">Recent Cotisations</h4>
        <ul className="list-group">
          {cotisations.slice(0, 5).map((c) => {
            const member = members.find((m) => m.id === c.memberId);
            return (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}
                </span>
                <span className="text-muted">{c.amount} MAD</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
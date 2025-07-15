'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/KeycloakContext';
import { getMembers } from '@/services/memberService';
import { getActivities } from '@/services/activityService';
import { getCotisations } from '@/services/cotisationService';
import MonthlyCotisationsChart from '@/components/MonthlyCotisationsChart';
import RecentMembers from '@/components/RecentMembers';

import { Member } from '@/types/Member';
import { Activity } from '@/types/activity';
import { Cotisation } from '@/types/cotisation';

const DashboardPage = () => {
  const { token } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);

  useEffect(() => {
    if (token) {
      getMembers(token)
        .then((data) => setMembers(data))
        .catch(() => setMembers([]));

      getActivities(token)
        .then((data) => setActivities(data))
        .catch(() => setActivities([]));

      getCotisations(token)
        .then((data) => setCotisations(data))
        .catch(() => setCotisations([]));
    }
  }, [token]);

  return (
    <div>
      <h2 className="fw-bold text-primary mb-4">Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded p-4">
            <h5 className="text-secondary">Total Members</h5>
            <h3 className="fw-bold text-dark">{members.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded p-4">
            <h5 className="text-secondary">Active Activities</h5>
            <h3 className="fw-bold text-dark">{activities.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded p-4">
            <h5 className="text-secondary">Total Cotisations</h5>
            <h3 className="fw-bold text-dark">{cotisations.length}</h3>
          </div>
        </div>
      </div>

      {/* Monthly Cotisation Chart */}
      <div className="mb-4">
        <MonthlyCotisationsChart cotisations={cotisations} />
      </div>

      {/* Recent Members List */}
      <RecentMembers members={members} />
    </div>
  );
};

export default DashboardPage;
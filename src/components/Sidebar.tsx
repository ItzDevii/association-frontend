'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaClipboardList, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';

const navItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/pages/dashboard' },
  { label: 'Members', icon: <FaUsers />, path: '/pages/members' },
  { label: 'Activities', icon: <FaClipboardList />, path: '/pages/activities' },
  { label: 'Cotisations', icon: <FaMoneyBillWave />, path: '/pages/cotisations' },
  { label: 'Documents', icon: <FaFileAlt />, path: '/pages/documents' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h4>Association Manager</h4>
      <nav className="d-flex flex-column gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`sidebar-link d-flex align-items-center gap-2 ${
              pathname === item.path ? 'active' : ''
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
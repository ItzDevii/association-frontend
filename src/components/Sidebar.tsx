'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/pages/dashboard', label: 'Dashboard' },
    { href: '/pages/members', label: 'Members' },
    { href: '/pages/activities', label: 'Activities' },
    { href: '/pages/cotisations', label: 'Cotisations' },
  ];

  return (
    <aside className="sidebar d-flex flex-column h-100">
      <div className="mb-4">
        <h4 className="text-primary fw-bold">Association Manager</h4>
      </div>

      <ul className="nav flex-column">
        {links.map(({ href, label }) => (
          <li className="nav-item mb-2" key={href}>
            <Link
              href={href}
              className={clsx(
                'sidebar-link',
                pathname === href && 'active'
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
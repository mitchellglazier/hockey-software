'use client';

import Link from 'next/link';
import { useTeam } from '../context/TeamContext';
import { FaUsers } from 'react-icons/fa';
import { FaDollarSign } from 'react-icons/fa';

const Sidebar = () => {
  const { selectedTeam } = useTeam();

  if (!selectedTeam) return null;

  return (
    <aside
      className="text-white p-4"
      style={{
        backgroundColor: selectedTeam.colors[1],
        width: '220px',
        minHeight: '100vh',
      }}
    >
      <nav className="flex flex-col gap-2">
        <Link
          href="/depth-chart"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-md font-semibold hover:bg-white transition-colors duration-200"
          style={{ color: selectedTeam?.colors[0] }}
        >
          <FaUsers />
          Depth Chart
        </Link>
        <Link
          href="/contracts"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-md font-semibold hover:bg-white transition-colors duration-200"
          style={{ color: selectedTeam?.colors[0] }}
        >
          <FaDollarSign />
          Contracts
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;

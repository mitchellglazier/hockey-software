'use client';

import { useEffect, useState } from 'react';
import { useTeam } from '@/app/context/TeamContext';

interface Player {
  id: number;
  fullName: string;
  position: string;
  jerseyNumber: string;
}

export default function RosterPage() {
  const { selectedTeam } = useTeam();
  const [roster, setRoster] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      if (!selectedTeam) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/roster?teamId=${selectedTeam.id}`);
        const data = await res.json();

        if (res.ok) {
          setRoster(data.roster);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Failed to fetch roster:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [selectedTeam]);

  if (!selectedTeam) return <p className="p-4">Select a team to view the roster.</p>;
  if (loading) return <p className="p-4">Loading roster...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{selectedTeam.name} Roster</h1>
      <ul className="space-y-2">
        {roster.map((player) => (
          <li key={player.id} className="border p-4 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="flex justify-between">
              <span className="font-medium">{player.fullName}</span>
              <span className="text-sm text-gray-600">#{player.jerseyNumber}</span>
            </div>
            <div className="text-sm text-gray-700">{player.position}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

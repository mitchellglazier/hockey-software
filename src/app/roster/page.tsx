'use client';

import { useEffect, useState } from 'react';
import { useTeam } from '@/app/context/TeamContext';

interface Player {
  playerId: number;
  firstName: string;
  lastName: string;
  age: number;
  sweaterNumber: string; 
  weight: string;
  positionGroup: string;
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
        const res = await fetch(`/api/roster?teamName=${encodeURIComponent(selectedTeam.name)}`);
        const data = await res.json();

        if (res.ok) {
          if (res.ok) {
  setRoster(data);
}

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
      <h1 className="text-2xl text-center font-bold mb-4">{selectedTeam.name} ROSTER</h1>
      <ul className="space-y-2">
  {roster.map((player) => (
    <li
      key={player.playerId}
      className="border p-4 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <div className="flex justify-between">
        <span className="font-medium">
          {player.firstName} {player.lastName}
        </span>
        <span className="text-sm text-gray-600">{player.positionGroup}</span>
      </div>
      <div className="text-sm text-gray-700">
        Weight: {player.weight} • Age: {player.age}
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

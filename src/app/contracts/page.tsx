'use client';

import { useEffect, useState } from 'react';
import { useTeam } from '../context/TeamContext';
import InfoCard from '../components/InfoCard';
import SortableSearchableTable from '../components/SortableSearchableTable';
import CapHitDonut from '../components/graphs/CapHitDonut';
import CapHitScatter from '../components/graphs/CapHitScatter';
import CapHitTeamLineGraph from '../components/graphs/CapHitTeamLine';

interface PlayerCapInfo {
  name: string;
  position: string[];
  age: number;
  yearsRemaining: string;
  term: string;
  status: string;
  capHits: Record<string, string>;
  expiryYear?: string;
}

export default function Contracts() {
  const { selectedTeam } = useTeam();
  const [players, setPlayers] = useState<PlayerCapInfo[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'NHL' | 'Minor'>('All');
  const capYears = players.length ? Object.keys(players[0].capHits) : [];
  const [selectedCapYear, setSelectedCapYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapData = async () => {
      if (!selectedTeam) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/cap-wages?teamName=${encodeURIComponent(selectedTeam.name)}`);
        const data = await res.json();
        if (res.ok) {
          setPlayers(data);
        } else {
          setError(data.error || 'Failed to fetch');
        }
      } catch (err) {
        setError('Failed to fetch cap data');
      } finally {
        setLoading(false);
      }
    };

    fetchCapData();
  }, [selectedTeam]);

  const latestCapYear = selectedCapYear || 'Cap Hit';

  useEffect(() => {
    if (players.length && !selectedCapYear) {
      setSelectedCapYear(capYears[0]);
    }
  }, [players]);

  const flatPlayers = players.map((p) => ({
    ...p,
    capHit: p.capHits[latestCapYear] || '-',
    displayPosition: p.position.join(', '),
  }));

  const filteredPlayers = flatPlayers.filter((player) => {
    const matchesStatus =
      statusFilter === 'All' || player.status.toLowerCase() === statusFilter.toLowerCase();

    const expiresInOrAfterSelectedYear =
      selectedCapYear === null ||
      (player.expiryYear && parseInt(player.expiryYear) >= parseInt(selectedCapYear.split('/')[0]));

    return matchesStatus && expiresInOrAfterSelectedYear;
  });

  const positionGroups = {
    Forwards: ['LW', 'RW', 'C'],
    Defense: ['LD', 'RD'],
    Goalies: ['G'],
  };

  function groupByPosition(filteredPlayers: PlayerCapInfo[], key: keyof typeof positionGroups) {
    return filteredPlayers.filter((p) => p.position.some((pos) => positionGroups[key].includes(pos)));
  }

  const forwards = groupByPosition(filteredPlayers, 'Forwards');
  const defense = groupByPosition(filteredPlayers, 'Defense');
  const goalies = groupByPosition(filteredPlayers, 'Goalies');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="mt-4 text-gray-600">Loading contracts...</p>
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex gap-3 flex-wrap">
            {capYears.map((year) => (
              <label key={year} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="capYear"
                  value={year}
                  checked={selectedCapYear === year}
                  onChange={() => setSelectedCapYear(year)}
                  className="accent-white"
                  style={{
                    accentColor: selectedTeam?.colors[0] || '#000',
                  }}
                />
                {year}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex gap-3">
            {['All', 'NHL', 'Minor'].map((status) => (
              <label key={status} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={statusFilter === status}
                  onChange={() => setStatusFilter(status as 'All' | 'NHL' | 'Minor')}
                  className="accent-white"
                  style={{
                    accentColor: selectedTeam?.colors[0] || '#000',
                  }}
                />
                {status}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total Cap Hit"
          value={filteredPlayers
            .reduce((sum, p) => {
              const val = p.capHits[latestCapYear]?.replace(/[^0-9.-]+/g, '') || '0';
              return sum + parseInt(val, 10);
            }, 0)
            .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          breakdown={[
            {
              label: 'FWD',
              value: forwards
                .reduce((sum, p) => {
                  const val = p.capHits[latestCapYear]?.replace(/[^0-9.-]+/g, '') || '0';
                  return sum + parseInt(val, 10);
                }, 0)
                .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
              label: 'DEF',
              value: defense
                .reduce((sum, p) => {
                  const val = p.capHits[latestCapYear]?.replace(/[^0-9.-]+/g, '') || '0';
                  return sum + parseInt(val, 10);
                }, 0)
                .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
              label: 'G',
              value: goalies
                .reduce((sum, p) => {
                  const val = p.capHits[latestCapYear]?.replace(/[^0-9.-]+/g, '') || '0';
                  return sum + parseInt(val, 10);
                }, 0)
                .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
          ]}
        />

        <InfoCard
          label="Contracts"
          value={filteredPlayers.length}
          breakdown={[
            { label: 'FWD', value: forwards.length },
            { label: 'DEF', value: defense.length },
            { label: 'G', value: goalies.length },
          ]}
        />

        <InfoCard
          label="Avg. Age"
          value={(filteredPlayers.reduce((sum, p) => sum + p.age, 0) / filteredPlayers.length).toFixed(1)}
          breakdown={[
            {
              label: 'FWD',
              value: (forwards.reduce((s, p) => s + p.age, 0) / forwards.length || 0).toFixed(1),
            },
            {
              label: 'DEF',
              value: (defense.reduce((s, p) => s + p.age, 0) / defense.length || 0).toFixed(1),
            },
            {
              label: 'G',
              value: (goalies.reduce((s, p) => s + p.age, 0) / goalies.length || 0).toFixed(1),
            },
          ]}
        />

        <InfoCard
          label="Expiring Contracts"
          value={filteredPlayers.filter((p) => p.expiryYear === latestCapYear).length}
          subtext={`in ${latestCapYear}`}
          breakdown={[
            { label: 'FWD', value: forwards.filter((p) => p.expiryYear === latestCapYear).length },
            { label: 'DEF', value: defense.filter((p) => p.expiryYear === latestCapYear).length },
            { label: 'G', value: goalies.filter((p) => p.expiryYear === latestCapYear).length },
          ]}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 overflow-x-auto">
          <SortableSearchableTable
            data={filteredPlayers}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'displayPosition', label: 'Position' },
              { key: 'age', label: 'Age' },
              { key: 'yearsRemaining', label: 'Years Left' },
              { key: 'term', label: 'Term' },
              { key: 'status', label: 'Status' },
              { key: 'capHit', label: `${latestCapYear}` },
              { key: 'expiryYear', label: 'Expires' },
            ]}
            selectedCapYear={selectedCapYear}
          />
        </div>
        <div className="lg:w-1/4 flex justify-center">
          <CapHitDonut
            data={filteredPlayers}
            selectedCapYear={selectedCapYear}
            selectedTeam={selectedTeam}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-center">
  <div className="w-full lg:w-1/2">
    <CapHitScatter
      data={filteredPlayers}
      selectedCapYear={selectedCapYear}
      selectedTeam={selectedTeam}
    />
  </div>
  <div className="w-full lg:w-1/2">
    <CapHitTeamLineGraph
      data={filteredPlayers}
      selectedTeam={selectedTeam}
    />
  </div>
</div>


    </div>
  );
}

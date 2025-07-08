'use client';

import { useState, useMemo } from 'react';
import { useTeam } from '../context/TeamContext';
import PlayerModal from './PlayerModal';

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
  }[];
}

export default function SortableSearchableTable<T>({ data, columns }: TableProps<T>) {
  const { selectedTeam } = useTeam();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<T | null>(null);


  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.some((col) => {
        const value = String(row[col.key]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, data, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = String(a[sortKey]);
      const valB = String(b[sortKey]);
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 px-3 py-2 border rounded w-full"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded">
          <thead
            className="text-sm"
            style={{ backgroundColor: selectedTeam?.colors[0] || '#1f2937' }}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-2 border cursor-pointer hover:opacity-90 text-white transition"
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 hover:cursor-pointer text-sm" onClick={() => setSelectedPlayer(row)}>
                {columns.map((col) => (
                  <td key={String(col.key)} className="border px-4 py-2">
                    {String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedPlayer && (
  <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
)}
    </div>
    
  );
}


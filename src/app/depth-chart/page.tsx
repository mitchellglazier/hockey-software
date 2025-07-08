'use client';

import Image from 'next/image';
import { useTeam } from '@/app/context/TeamContext';

export default function DepthChart() {
  const { selectedTeam } = useTeam();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {selectedTeam && (
        <>
          <Image
            src={selectedTeam.logo}
            alt={selectedTeam.name}
            width={400}
            height={400}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">{selectedTeam.name}</h1>
        </>
      )}
      <p className="text-xl text-gray-600">Depth Chart Coming Soon</p>
    </div>
  );
}


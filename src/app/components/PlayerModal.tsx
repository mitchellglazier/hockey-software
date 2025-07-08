'use client';

import React from 'react';
import CapHitsChart from './graphs/CapHitsLine';

interface PlayerModalProps<T> {
  player: T;
  onClose: () => void;
}

export default function PlayerModal<T>({ player, onClose }: PlayerModalProps<T>) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{(player as any).name || 'Player'}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {Object.entries(player as any).map(([key, value]) => {
            if (key === 'capHits') return null;
            if (key === 'position') return null;

            return (
              <div key={key}>
                <p className="text-gray-500 font-medium capitalize">{key.replace(/_/g, ' ')}:</p>
                <p className="text-gray-800 break-all">
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </p>
              </div>
            );
          })}
        </div>

        {(player as any).capHits && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Cap Hit Over Time</h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <CapHitsChart capHits={(player as any).capHits} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


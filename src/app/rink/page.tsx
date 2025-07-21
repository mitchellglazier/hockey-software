'use client';

import React, { useState } from 'react';
import IceRink from '../components/graphs/IceRink';

export default function Rink() {
  const testEvents = [
    { x: 20, y: 42.5, type: 'shot', player: 'Roope Hintz' },
    { x: 25, y: 30, type: 'shot', player: 'Jason Robertson' },
    { x: 60, y: 20, type: 'shot', player: 'Mikko Rantanen' },
    { x: 50, y: 50, type: 'shot', player: 'Matt Duchene' },
    { x: 20, y: 42.5, type: 'shot', player: 'Wyatt Johnston' },
    { x: 15, y: 30, type: 'shot', player: 'Jamie Benn' },
    { x: 40, y: 70, type: 'shot', player: 'Tyler Seguin' },
    { x: 50, y: 50, type: 'shot', player: 'Roope Hintz' },
    { x: 170, y: 42.5, type: 'shot', player: 'Mikko Rantanen' },
    { x: 145, y: 30, type: 'shot', player: 'Jason Robertson' },
    { x: 160, y: 20, type: 'shot', player: 'Roope Hintz' },
    { x: 150, y: 50, type: 'shot', player: 'Wyatt Johnston' },
    { x: 185, y: 42.5, type: 'shot', player: 'Mavrik Bourque' },
    { x: 155, y: 30, type: 'shot', player: 'Tyler Seguin' },
    { x: 140, y: 70, type: 'shot', player: 'Matt Duchene' },
    { x: 150, y: 50, type: 'shot', player: 'Jamie Benn' },
    { x: 145, y: 30, type: 'goal', player: 'Roope Hintz' },
    { x: 25, y: 30, type: 'goal', player: 'Jason Robertson' },
    { x: 160, y: 20, type: 'goal', player: 'Roope Hintz' },
    { x: 185, y: 42.5, type: 'goal', player: 'Mavrik Bourque' },
  ];

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [playerFilter, setPlayerFilter] = useState<string>('all');

  const uniquePlayers = Array.from(new Set(testEvents.map(e => e.player)));

  const filteredEvents = testEvents.filter(e => {
    const typeMatch = typeFilter === 'all' || e.type === typeFilter;
    const playerMatch = playerFilter === 'all' || e.player === playerFilter;
    return typeMatch && playerMatch;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Filters */}
      <div className="mb-4">
        <label className="mr-2 font-bold">Filter by Type:</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">All</option>
          <option value="shot">Shot</option>
          <option value="goal">Goal</option>
        </select>

        <label className="ml-6 mr-2 font-bold">Filter by Player:</label>
        <select
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">All</option>
          {uniquePlayers.map(player => (
            <option key={player} value={player}>{player}</option>
          ))}
        </select>
      </div>

      <IceRink events={filteredEvents} />
    </div>
  );
}


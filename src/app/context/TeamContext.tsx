'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import teams from '@nhl-api/teams';

const TeamContext = createContext<any>(null);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[24].id);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <TeamContext.Provider value={{ selectedTeam, setSelectedTeamId }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);

'use client'
import Link from 'next/link'
import Image from 'next/image'

import teams from '@nhl-api/teams'
import { useTeam } from '../context/TeamContext'

export default function Navbar() {
  const { selectedTeam, setSelectedTeamId } = useTeam()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(Number(e.target.value))
  }

  return (
    <nav className="bg-white shadow p-4" style={{ backgroundColor: selectedTeam?.colors[0], height: '72px', }}>
      <div className="mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {selectedTeam?.logo && (
            <Image src={selectedTeam.logo} alt={selectedTeam.name} width={40} height={40} style={{ minWidth: 40, minHeight: 40 }}/>
          )}
          <span className="text-xl font-bold text-white">{selectedTeam?.name}</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="https://github.com/mitchellglazier" className="text-white hover:text-blue-600">GitHub</Link>
          <select onChange={handleChange} value={selectedTeam.id} className="px-2 py-1 border rounded text-white">
            {teams.map(team => (
              <option key={team.id} value={team.id} className="text-black">{team.name}</option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  )
}






import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useFormationStore } from '../stores/formationStore';
import { DFBPlayer } from '../types';

// Mock DFB player data - in a real app, this would come from DFB.net API
const mockDFBPlayers: DFBPlayer[] = [
  {
    id: 'dfb-1',
    firstName: 'Manuel',
    lastName: 'Neuer',
    dateOfBirth: '1986-03-27',
    position: 'GK',
    club: 'FC Bayern München',
    photo: 'https://img.fcbayern.com/image/upload/f_auto/w_300,h_300/v1/cms/public/images/fcbayern-com/players/saison-23-24/neuer_manuel.png'
  },
  {
    id: 'dfb-2',
    firstName: 'Joshua',
    lastName: 'Kimmich',
    dateOfBirth: '1995-02-08',
    position: 'CM',
    club: 'FC Bayern München',
  },
  {
    id: 'dfb-3',
    firstName: 'Thomas',
    lastName: 'Müller',
    dateOfBirth: '1989-09-13',
    position: 'ST',
    club: 'FC Bayern München',
  },
  {
    id: 'dfb-4',
    firstName: 'Timo',
    lastName: 'Werner',
    dateOfBirth: '1996-03-06',
    position: 'ST',
    club: 'RB Leipzig',
  },
  {
    id: 'dfb-5',
    firstName: 'Jamal',
    lastName: 'Musiala',
    dateOfBirth: '2003-02-26',
    position: 'LW',
    club: 'FC Bayern München',
  },
  {
    id: 'dfb-6',
    firstName: 'Antonio',
    lastName: 'Rüdiger',
    dateOfBirth: '1993-03-03',
    position: 'CB',
    club: 'Real Madrid',
  },
  {
    id: 'dfb-7',
    firstName: 'Ilkay',
    lastName: 'Gündogan',
    dateOfBirth: '1990-10-24',
    position: 'CM',
    club: 'FC Barcelona',
  },
  {
    id: 'dfb-8',
    firstName: 'Leroy',
    lastName: 'Sané',
    dateOfBirth: '1996-01-11',
    position: 'RW',
    club: 'FC Bayern München',
  }
];

const DFBPlayerSearch: React.FC = () => {
  const { addPlayer, players } = useFormationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredPlayers = mockDFBPlayers.filter(player =>
    `${player.firstName} ${player.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDFBPlayer = (dfbPlayer: DFBPlayer) => {
    // Find next available position on field
    const usedNumbers = players.map(p => p.number);
    const nextNumber = Array.from({ length: 99 }, (_, i) => i + 1)
      .find(num => !usedNumbers.includes(num)) || players.length + 1;

    // Position players based on their position
    const getPositionCoordinates = (position: string) => {
      const positionMap: { [key: string]: { x: number; y: number } } = {
        'GK': { x: 50, y: 90 },
        'CB': { x: 50, y: 75 },
        'LB': { x: 20, y: 75 },
        'RB': { x: 80, y: 75 },
        'LWB': { x: 15, y: 60 },
        'RWB': { x: 85, y: 60 },
        'CM': { x: 50, y: 55 },
        'LM': { x: 20, y: 55 },
        'RM': { x: 80, y: 55 },
        'LW': { x: 20, y: 35 },
        'RW': { x: 80, y: 35 },
        'ST': { x: 50, y: 25 },
      };
      return positionMap[position] || { x: 50, y: 50 };
    };

    const coords = getPositionCoordinates(dfbPlayer.position);
    
    addPlayer({
      name: `${dfbPlayer.firstName} ${dfbPlayer.lastName}`,
      position: dfbPlayer.position,
      number: nextNumber,
      x: coords.x,
      y: coords.y,
      photo: dfbPlayer.photo,
    });
  };

  return (
    <div className="dfb-player-search">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">DFB Player Database</h3>
      
      {/* Search Input */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search players by name, position, or club..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? 'No players found' : 'Enter a search term to find DFB players'}
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {player.photo ? (
                    <img
                      src={player.photo}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-bold">
                        {player.firstName[0]}{player.lastName[0]}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-900">
                      {player.firstName} {player.lastName}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {player.position}
                      </span>
                      <span>{player.club}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddDFBPlayer(player)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  <UserPlus size={14} className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note about real DFB integration */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a demo with mock data. In a production version, 
          this would connect to the official DFB.net API to fetch real player data 
          including current stats, photos, and club information.
        </p>
      </div>
    </div>
  );
};

export default DFBPlayerSearch;

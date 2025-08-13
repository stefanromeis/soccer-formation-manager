import React, { useState } from 'react';
import { useFormationStore } from '../stores/formationStore';

const FalkePlayerLibrary: React.FC = () => {
  const { addPlayer } = useFormationStore();
  const [selectedPosition, setSelectedPosition] = useState('ST');

  // Get the base URL for proper asset loading in production
  const getImageUrl = (imageName: string) => {
    // Simply use the configured base URL from Vite
    const baseUrl = import.meta.env.BASE_URL || '/';
    return `${baseUrl}${imageName}`;
  };

    // List of available player images in the public folder
  const falkePlayersImages = [
    'Anton.png',
    'Danny.png', 
    'Dennis.png',
    'Devin.png',
    'Eli.png',
    'Eric.png',
    'Flo.png',
    'Fuchsi.png',
    'Hübi.png',
    'Jacob.png',
    'Jannes.png',
    'Jens.png',
    'Lars.png',
    'Lemmi.png',
    'Leo.png',
    'Leon.png',
    'Lucas.png',
    'Marc.png',
    'Marcel.png',
    'Micha.png',
    'Mika.png',
    'Rogg.png',
    'Röse.png',
    'Stefan.png',
    'Theke.png',
  ];

  // Player number mapping based on names
  const playerNumbers: { [key: string]: number } = {
    'Anton': 1,
    'Danny': 2,
    'Dennis': 3,
    'Devin': 4,
    'Eli': 5,
    'Eric': 6,
    'Flo': 7,
    'Fuchsi': 8,
    'Hübi': 9,
    'Jacob': 10,
    'Jannes': 11,
    'Jens': 12,
    'Lars': 13,
    'Lemmi': 14,
    'Leo': 15,
    'Leon': 16,
    'Lucas': 17,
    'Marc': 18,
    'Marcel': 19,
    'Micha': 20,
    'Mika': 21,
    'Rogg': 22,
    'Röse': 23,
    'Stefan': 24,
    'Theke': 25,
  };

  const positions = [
    'TW', 'IV', 'LV', 'RV', 'LWV', 'RWV', 
    'ZM', 'LM', 'RM', 'ZOM', 'ZDM',
    'ST', 'LF', 'RF', 'MS'
  ];

  const getPlayerNameFromImage = (imageName: string) => {
    return imageName.replace('.png', '').replace(' welcome', ' Welcome');
  };

  const getPlayerNumberFromImage = (imageName: string) => {
    const playerName = getPlayerNameFromImage(imageName);
    
    // First, check if there's a number in the filename
    const numberMatch = imageName.match(/(\d+)/);
    if (numberMatch) {
      const extractedNumber = parseInt(numberMatch[1]);
      if (extractedNumber > 0 && extractedNumber <= 99) {
        return extractedNumber;
      }
    }
    
    // If no number in filename, use the predefined mapping
    return playerNumbers[playerName] || Math.floor(Math.random() * 99) + 1;
  };

  const handleAddPlayer = (imageName: string) => {
    const playerName = getPlayerNameFromImage(imageName);
    const playerNumber = getPlayerNumberFromImage(imageName);
    
    addPlayer({
      name: playerName,
      position: selectedPosition,
      number: playerNumber,
      photo: imageName,
      x: 50, // Center of the field
      y: 50,
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Standard-Position für neue Spieler:
        </label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🦅 Falke Spieler
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Klicken Sie auf ein Spielerbild, um ihn zur Aufstellung hinzuzufügen
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {falkePlayersImages.map((imageName) => (
          <div
            key={imageName}
            onClick={() => handleAddPlayer(imageName)}
            className="group relative bg-white rounded-lg p-3 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={getImageUrl(imageName)}
                  alt={getPlayerNameFromImage(imageName)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '👤';
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 truncate max-w-20">
                  {getPlayerNameFromImage(imageName)}
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <span>#{getPlayerNumberFromImage(imageName)}</span>
                  <span>•</span>
                  <span>{selectedPosition}</span>
                </div>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
              <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Zum Feld hinzufügen
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-1">Tipp:</h4>
        <p className="text-sm text-blue-800">
          Nach dem Hinzufügen eines Spielers können Sie ihn an jede Position auf dem Feld ziehen und seine Details durch Anklicken bearbeiten.
        </p>
      </div>
    </div>
  );
};

export default FalkePlayerLibrary;

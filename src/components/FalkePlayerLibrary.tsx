import React from 'react';
import { useFormationStore } from '../stores/formationStore';

const FalkePlayerLibrary: React.FC = () => {
  const { addPlayer } = useFormationStore();

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
    'Max.png',
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
    'Lukas.png',
    'Stefan.png',
    'Theke.png',
  ];

  const getPlayerNameFromImage = (imageName: string) => {
    return imageName.replace('.png', '').replace(' welcome', ' Welcome');
  };

  const handleAddPlayer = (imageName: string) => {
    const playerName = getPlayerNameFromImage(imageName);
    
    addPlayer({
      name: playerName,
      position: 'FIELD', // Default position
      photo: imageName,
      x: 50, // Center of the field
      y: 50,
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🦅 Falke Spieler
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Klicken Sie auf ein Spielerbild, um ihn zur Aufstellung hinzuzufügen
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[100vh-200px] overflow-y-auto">
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
    </div>
  );
};

export default FalkePlayerLibrary;

import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useFormationStore } from '../stores/formationStore';
import { Player } from '../types';

interface SoccerFieldProps {
  width: number;
  height: number;
}

// Falke Logo component
const FalkeLogo: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const [logoImage] = useImage(`${import.meta.env.BASE_URL || '/'}falke-logo.png`);
  
  if (!logoImage) return null;
  
  // Use the same size as the removed center circle (diameter = width * 0.2)
  const logoSize = width * 0.2;
  
  return (
    <KonvaImage
      image={logoImage}
      x={width / 2 - logoSize / 2}
      y={height / 2 - logoSize / 2}
      width={logoSize}
      height={logoSize}
      opacity={0.4} // Slightly more visible since it's replacing the circle
    />
  );
};

const SoccerField: React.FC<SoccerFieldProps> = ({ width, height }) => {
  const stageRef = useRef<any>(null);
  const { players, movePlayer, selectPlayer, selectedPlayer, replacePlayer, addPlayer } = useFormationStore();
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    player: Player | null;
    type: 'replace' | 'place';
    fieldPosition?: { x: number; y: number };
  }>({ visible: false, x: 0, y: 0, player: null, type: 'replace' });
  const [searchTerm, setSearchTerm] = useState('');

  // Available Falke players for replacement
  const availableFalkePlayersImages = [
    'Anton.png', 'Danny.png', 'Dennis.png', 'Devin.png', 'Eli.png', 'Eric.png',
    'Flo.png', 'Fuchsi.png', 'Max.png', 'Jacob.png', 'Jannes.png', 'Jens.png',
    'Lars.png', 'Lemmi.png', 'Leo.png', 'Leon.png', 'Lucas.png', 'Marc.png',
    'Marcel.png', 'Micha.png', 'Mika.png', 'Rogg.png', 'Lukas.png', 'Stefan.png', 'Theke.png',
  ];

  const fieldColor = '#16a34a'; // Darker green (green-600)
  const lineColor = '#ffffff';
  const lineWidth = 2;

  // Get the base URL for proper asset loading in production
  const getImageUrl = (imageName: string) => {
    // Simply use the configured base URL from Vite
    const baseUrl = import.meta.env.BASE_URL || '/';
    return `${baseUrl}${imageName}`;
  };

  // Convert percentage coordinates to pixel coordinates
  const toPixels = (percentage: number, dimension: 'width' | 'height') => {
    return (percentage / 100) * (dimension === 'width' ? width : height);
  };

  // Convert pixel coordinates to percentage coordinates
  const toPercentage = (pixels: number, dimension: 'width' | 'height') => {
    return (pixels / (dimension === 'width' ? width : height)) * 100;
  };

  const getPlayerNameFromImage = (imageName: string) => {
    return imageName.replace('.png', '');
  };

  // Get available players not currently on the field
  const getAvailablePlayers = (searchFilter: string = '') => {
    const usedPlayerNames = players.map(p => p.name.toLowerCase());
    return availableFalkePlayersImages.filter(imageName => {
      const playerName = getPlayerNameFromImage(imageName).toLowerCase();
      const matchesSearch = searchFilter === '' || playerName.includes(searchFilter.toLowerCase());
      
      // For placement mode, show all players; for replacement mode, only show unused players
      if (contextMenu.type === 'place') {
        return matchesSearch;
      } else {
        return !usedPlayerNames.includes(playerName) && matchesSearch;
      }
    });
  };

  const handlePlayerRightClick = (player: Player, e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    setSearchTerm(''); // Reset search when opening context menu
    setContextMenu({
      visible: true,
      x: pointerPosition.x,
      y: pointerPosition.y,
      player: player,
      type: 'replace',
    });
  };

  const handleReplacePlayer = (newPlayerImage: string) => {
    if (contextMenu.player) {
      const newPlayerName = getPlayerNameFromImage(newPlayerImage);
      
      replacePlayer(contextMenu.player.id, {
        name: newPlayerName,
        position: contextMenu.player.position,
        photo: newPlayerImage,
        x: contextMenu.player.x,
        y: contextMenu.player.y,
      });
    }
    setContextMenu({ visible: false, x: 0, y: 0, player: null, type: 'replace' });
  };

  const handleStageClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0, player: null, type: 'replace' });
  };

  const handleFieldRightClick = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    // Convert screen coordinates to field percentage coordinates
    const fieldX = toPercentage(pointerPosition.x, 'width');
    const fieldY = toPercentage(pointerPosition.y, 'height');
    
    setSearchTerm(''); // Reset search when opening context menu
    setContextMenu({
      visible: true,
      x: pointerPosition.x,
      y: pointerPosition.y,
      player: null,
      type: 'place',
      fieldPosition: { x: fieldX, y: fieldY },
    });
  };

  const handlePlacePlayer = (playerImage: string) => {
    if (contextMenu.fieldPosition) {
      const playerName = getPlayerNameFromImage(playerImage);
      
      addPlayer({
        name: playerName,
        position: 'FIELD',
        photo: playerImage,
        x: contextMenu.fieldPosition.x,
        y: contextMenu.fieldPosition.y,
      });
    }
    setContextMenu({ visible: false, x: 0, y: 0, player: null, type: 'replace' });
  };

  const handlePlayerDragEnd = (player: Player, e: any) => {
    const newX = toPercentage(e.target.x(), 'width');
    const newY = toPercentage(e.target.y(), 'height');
    
    // Keep players within field boundaries
    const clampedX = Math.max(5, Math.min(95, newX));
    const clampedY = Math.max(5, Math.min(95, newY));
    
    movePlayer(player.id, clampedX, clampedY);
  };

  const PlayerAvatar: React.FC<{ player: Player }> = ({ player }) => {
    const x = toPixels(player.x, 'width');
    const y = toPixels(player.y, 'height');
    const isSelected = selectedPlayer?.id === player.id;
    const [image] = useImage(player.photo ? getImageUrl(player.photo) : '');

    // 1080x1350 ratio (4:5) scaled down - responsive sizing
    const isMobile = width < 600; // Simple mobile detection based on field width
    const baseWidth = isMobile ? 45 : 90; // Half size on mobile
    const cardWidth = baseWidth;
    const cardHeight = baseWidth * 1.25; // Maintain 4:5 ratio

    return (
      <Group
        x={x}
        y={y}
        draggable
        onClick={() => selectPlayer(player)}
        onContextMenu={(e) => handlePlayerRightClick(player, e)}
        onDragEnd={(e) => handlePlayerDragEnd(player, e)}
      >
        {/* Player avatar background rectangle */}
        <Rect
          x={-cardWidth/2}
          y={-cardHeight/2}
          width={cardWidth}
          height={cardHeight}
          fill={isSelected ? '#fbbf24' : '#ffffff'}
          stroke={isSelected ? '#f59e0b' : '#1d4ed8'}
          strokeWidth={3}
          cornerRadius={6}
        />
        
        {/* Player image or fallback rectangle */}
        {image && player.photo ? (
          <Group>
            {/* Rectangular mask for the image */}
            <Rect
              x={-cardWidth/2 + 3}
              y={-cardHeight/2 + 3}
              width={cardWidth - 6}
              height={cardHeight - 6}
              fill="white"
              stroke={isSelected ? '#f59e0b' : '#1d4ed8'}
              strokeWidth={2}
              cornerRadius={4}
            />
            <KonvaImage
              image={image}
              x={-cardWidth/2 + 3}
              y={-cardHeight/2 + 3}
              width={cardWidth - 6}
              height={cardHeight - 6}
              globalCompositeOperation="source-atop"
            />
          </Group>
        ) : (
          <>
            <Rect
              x={-cardWidth/2 + 3}
              y={-cardHeight/2 + 3}
              width={cardWidth - 6}
              height={cardHeight - 6}
              fill={isSelected ? '#fbbf24' : '#3b82f6'}
              stroke={isSelected ? '#f59e0b' : '#1d4ed8'}
              strokeWidth={2}
              cornerRadius={4}
            />
          </>
        )}
        
        {/* Player name */}
        <Text
          text={player.name}
          fontSize={isMobile ? 8 : 12}
          fontFamily="Arial"
          fill="white"
          fontStyle="bold"
          x={-cardWidth}
          y={cardHeight/2 + 5}
          width={cardWidth * 2}
          align="center"
        />
      </Group>
    );
  };

  return (
    <div className="soccer-field-container" style={{ position: 'relative' }}>
      <Stage width={width} height={height} ref={stageRef} onClick={handleStageClick} onContextMenu={handleFieldRightClick}>
        <Layer>
          {/* Field background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={fieldColor}
          />
          
          {/* Outer boundaries */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          
          {/* Center line */}
          <Line
            points={[0, height / 2, width, height / 2]}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          
          {/* Center spot */}
          <Circle
            x={width / 2}
            y={height / 2}
            radius={3}
            fill={lineColor}
          />
          
          {/* Falke Logo in center */}
          <FalkeLogo width={width} height={height} />
          
          {/* Penalty areas */}
          {/* Top penalty area */}
          <Rect
            x={width * 0.2}
            y={0}
            width={width * 0.6}
            height={height * 0.15}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          
          {/* Bottom penalty area */}
          <Rect
            x={width * 0.2}
            y={height * 0.85}
            width={width * 0.6}
            height={height * 0.15}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          
          {/* Goal areas */}
          {/* Top goal area */}
          <Rect
            x={width * 0.35}
            y={0}
            width={width * 0.3}
            height={height * 0.08}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          
          {/* Bottom goal area */}
          <Rect
            x={width * 0.35}
            y={height * 0.92}
            width={width * 0.3}
            height={height * 0.08}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          
          {/* Penalty spots */}
          <Circle
            x={width / 2}
            y={height * 0.12}
            radius={3}
            fill={lineColor}
          />
          <Circle
            x={width / 2}
            y={height * 0.88}
            radius={3}
            fill={lineColor}
          />
          
          {/* Corner arcs */}
          <Circle
            x={0}
            y={0}
            radius={width * 0.02}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          <Circle
            x={width}
            y={0}
            radius={width * 0.02}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          <Circle
            x={0}
            y={height}
            radius={width * 0.02}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          <Circle
            x={width}
            y={height}
            radius={width * 0.02}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
        </Layer>
        
        <Layer>
          {/* Render players */}
          {players.map((player) => (
            <PlayerAvatar key={player.id} player={player} />
          ))}
        </Layer>
      </Stage>

      {/* Context Menu for Player Replacement */}
      {contextMenu.visible && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-hidden"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div className="text-sm font-medium text-gray-700 mb-2 px-2 py-1">
            {contextMenu.type === 'replace' ? 'Spieler ersetzen:' : 'Spieler platzieren:'}
          </div>
          
          {/* Search Field */}
          <div className="px-2 mb-2">
            <input
              type="text"
              placeholder="Spieler suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-1">
            {getAvailablePlayers(searchTerm).map((imageName) => (
              <button
                key={imageName}
                onClick={() => contextMenu.type === 'replace' ? handleReplacePlayer(imageName) : handlePlacePlayer(imageName)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <img
                  src={getImageUrl(imageName)}
                  alt={getPlayerNameFromImage(imageName)}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {getPlayerNameFromImage(imageName)}
                  </div>
                </div>
              </button>
            ))}
            {getAvailablePlayers(searchTerm).length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {searchTerm ? 'Keine Spieler gefunden' : 'Keine verfügbaren Spieler'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoccerField;

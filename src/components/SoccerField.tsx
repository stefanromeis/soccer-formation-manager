import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useFormationStore } from '../stores/formationStore';
import { Player } from '../types';

interface SoccerFieldProps {
  width: number;
  height: number;
}

const SoccerField: React.FC<SoccerFieldProps> = ({ width, height }) => {
  const stageRef = useRef<any>(null);
  const { players, movePlayer, selectPlayer, selectedPlayer, replacePlayer } = useFormationStore();
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    player: Player | null;
  }>({ visible: false, x: 0, y: 0, player: null });

  // Available Falke players for replacement
  const availableFalkePlayersImages = [
    'Anton.png', 'Danny.png', 'Dennis.png', 'Devin.png', 'Eli.png', 'Eric.png',
    'Flo.png', 'Fuchsi.png', 'Hübi.png', 'Jacob.png', 'Jannes.png', 'Jens.png',
    'Lars.png', 'Lemmi.png', 'Leo.png', 'Leon.png', 'Lucas.png', 'Marc.png',
    'Marcel.png', 'Micha.png', 'Mika.png', 'Rogg.png', 'Röse.png', 'Stefan.png', 'Theke.png',
  ];

  const playerNumbers: { [key: string]: number } = {
    'Anton': 1, 'Danny': 2, 'Dennis': 3, 'Devin': 4, 'Eli': 5, 'Eric': 6,
    'Flo': 7, 'Fuchsi': 8, 'Hübi': 9, 'Jacob': 10, 'Jannes': 11, 'Jens': 12,
    'Lars': 13, 'Lemmi': 14, 'Leo': 15, 'Leon': 16, 'Lucas': 17, 'Marc': 18,
    'Marcel': 19, 'Micha': 20, 'Mika': 21, 'Rogg': 22, 'Röse': 23, 'Stefan': 24, 'Theke': 25,
  };

  const fieldColor = '#4ade80';
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

  const getPlayerNumberFromImage = (imageName: string) => {
    const playerName = getPlayerNameFromImage(imageName);
    return playerNumbers[playerName] || Math.floor(Math.random() * 99) + 1;
  };

  // Get available players not currently on the field
  const getAvailablePlayers = () => {
    const usedPlayerNames = players.map(p => p.name.toLowerCase());
    return availableFalkePlayersImages.filter(imageName => {
      const playerName = getPlayerNameFromImage(imageName).toLowerCase();
      return !usedPlayerNames.includes(playerName);
    });
  };

  const handlePlayerRightClick = (player: Player, e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    setContextMenu({
      visible: true,
      x: pointerPosition.x,
      y: pointerPosition.y,
      player: player,
    });
  };

  const handleReplacePlayer = (newPlayerImage: string) => {
    if (contextMenu.player) {
      const newPlayerName = getPlayerNameFromImage(newPlayerImage);
      const newPlayerNumber = getPlayerNumberFromImage(newPlayerImage);
      
      replacePlayer(contextMenu.player.id, {
        name: newPlayerName,
        position: contextMenu.player.position,
        number: newPlayerNumber,
        photo: newPlayerImage,
        x: contextMenu.player.x,
        y: contextMenu.player.y,
      });
    }
    setContextMenu({ visible: false, x: 0, y: 0, player: null });
  };

  const handleStageClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0, player: null });
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

    // 1080x1350 ratio (4:5) scaled down
    const cardWidth = 90; // Base width (doubled)
    const cardHeight = 112; // Height maintaining 4:5 ratio (90 * 1.25)

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
            {/* Player number for fallback */}
            <Text
              text={player.number.toString()}
              fontSize={18}
              fontFamily="Arial"
              fill="white"
              fontStyle="bold"
              x={-cardWidth/2}
              y={-10}
              width={cardWidth}
              align="center"
            />
          </>
        )}
        
        {/* Player name */}
        <Text
          text={player.name}
          fontSize={12}
          fontFamily="Arial"
          fill="#1f2937"
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
      <Stage width={width} height={height} ref={stageRef} onClick={handleStageClick}>
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
          
          {/* Center circle */}
          <Circle
            x={width / 2}
            y={height / 2}
            radius={width * 0.1}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="transparent"
          />
          
          {/* Center spot */}
          <Circle
            x={width / 2}
            y={height / 2}
            radius={3}
            fill={lineColor}
          />
          
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
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-y-auto"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div className="text-sm font-medium text-gray-700 mb-2 px-2 py-1">
            Spieler ersetzen:
          </div>
          <div className="space-y-1">
            {getAvailablePlayers().map((imageName) => (
              <button
                key={imageName}
                onClick={() => handleReplacePlayer(imageName)}
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
                  <div className="text-xs text-gray-500">
                    #{getPlayerNumberFromImage(imageName)}
                  </div>
                </div>
              </button>
            ))}
            {getAvailablePlayers().length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Keine verfügbaren Spieler
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoccerField;

import React, { useRef } from 'react';
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
  const { players, movePlayer, selectPlayer, selectedPlayer } = useFormationStore();

  const fieldColor = '#4ade80';
  const lineColor = '#ffffff';
  const lineWidth = 2;

  // Convert percentage coordinates to pixel coordinates
  const toPixels = (percentage: number, dimension: 'width' | 'height') => {
    return (percentage / 100) * (dimension === 'width' ? width : height);
  };

  // Convert pixel coordinates to percentage coordinates
  const toPercentage = (pixels: number, dimension: 'width' | 'height') => {
    return (pixels / (dimension === 'width' ? width : height)) * 100;
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
    const [image] = useImage(player.photo ? `/${player.photo}` : '');

    return (
      <Group
        x={x}
        y={y}
        draggable
        onClick={() => selectPlayer(player)}
        onDragEnd={(e) => handlePlayerDragEnd(player, e)}
      >
        {/* Player avatar background circle */}
        <Circle
          radius={38}
          fill={isSelected ? '#fbbf24' : '#ffffff'}
          stroke={isSelected ? '#f59e0b' : '#1d4ed8'}
          strokeWidth={3}
        />
        
        {/* Player image or fallback circle */}
        {image && player.photo ? (
          <Group>
            {/* Circular mask for the image */}
            <Circle
              radius={36}
              fill="white"
              stroke={isSelected ? '#f59e0b' : '#1d4ed8'}
              strokeWidth={2}
            />
            <KonvaImage
              image={image}
              x={-36}
              y={-36}
              width={72}
              height={72}
              globalCompositeOperation="source-atop"
            />
          </Group>
        ) : (
          <>
            <Circle
              radius={36}
              fill={isSelected ? '#fbbf24' : '#3b82f6'}
              stroke={isSelected ? '#f59e0b' : '#1d4ed8'}
              strokeWidth={2}
            />
            {/* Player number for fallback */}
            <Text
              text={player.number.toString()}
              fontSize={20}
              fontFamily="Arial"
              fill="white"
              fontStyle="bold"
              x={-10}
              y={-10}
              width={20}
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
          x={-40}
          y={44}
          width={80}
          align="center"
        />
        
        {/* Position */}
        <Text
          text={player.position}
          fontSize={10}
          fontFamily="Arial"
          fill="#6b7280"
          x={-20}
          y={58}
          width={40}
          align="center"
        />
      </Group>
    );
  };

  return (
    <div className="soccer-field-container">
      <Stage width={width} height={height} ref={stageRef}>
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
    </div>
  );
};

export default SoccerField;

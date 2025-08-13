export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  photo?: string;
  x: number;
  y: number;
  isSelected?: boolean;
}

export interface Formation {
  id: string;
  name: string;
  description: string;
  players: Player[];
  formation: string; // e.g., "4-4-2", "4-3-3"
}

export interface FieldDimensions {
  width: number;
  height: number;
  scale: number;
}

export interface DFBPlayer {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  position: string;
  club: string;
  photo?: string;
}

export type FormationPreset = {
  name: string;
  formation: string;
  positions: Array<{ x: number; y: number; position: string }>;
};

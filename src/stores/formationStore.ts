import { create } from 'zustand';
import { Player, Formation, FormationPreset } from '../types';

interface FormationState {
  players: Player[];
  currentFormation: Formation | null;
  selectedPlayer: Player | null;
  formationPresets: FormationPreset[];
  
  // Actions
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  replacePlayer: (oldPlayerId: string, newPlayer: Omit<Player, 'id'>) => void;
  selectPlayer: (player: Player | null) => void;
  movePlayer: (id: string, x: number, y: number) => void;
  loadFormation: (formation: Formation | Player[]) => void;
  saveFormation: (name: string, description: string) => void;
  setFormationPreset: (preset: FormationPreset) => void;
}

const defaultFormationPresets: FormationPreset[] = [
  {
    name: '4-4-2',
    formation: '4-4-2',
    positions: [
      // Goalkeeper
      { x: 50, y: 90, position: 'GK' },
      // Defense
      { x: 15, y: 75, position: 'LB' },
      { x: 35, y: 75, position: 'CB' },
      { x: 65, y: 75, position: 'CB' },
      { x: 85, y: 75, position: 'RB' },
      // Midfield
      { x: 15, y: 50, position: 'LM' },
      { x: 35, y: 50, position: 'CM' },
      { x: 65, y: 50, position: 'CM' },
      { x: 85, y: 50, position: 'RM' },
      // Attack
      { x: 35, y: 25, position: 'ST' },
      { x: 65, y: 25, position: 'ST' },
    ],
  },
  {
    name: '4-3-3',
    formation: '4-3-3',
    positions: [
      // Goalkeeper
      { x: 50, y: 90, position: 'GK' },
      // Defense
      { x: 15, y: 75, position: 'LB' },
      { x: 35, y: 75, position: 'CB' },
      { x: 65, y: 75, position: 'CB' },
      { x: 85, y: 75, position: 'RB' },
      // Midfield
      { x: 25, y: 55, position: 'CM' },
      { x: 50, y: 55, position: 'CM' },
      { x: 75, y: 55, position: 'CM' },
      // Attack
      { x: 20, y: 25, position: 'LW' },
      { x: 50, y: 20, position: 'ST' },
      { x: 80, y: 25, position: 'RW' },
    ],
  },
  {
    name: '3-5-2',
    formation: '3-5-2',
    positions: [
      // Goalkeeper
      { x: 50, y: 90, position: 'GK' },
      // Defense
      { x: 25, y: 75, position: 'CB' },
      { x: 50, y: 75, position: 'CB' },
      { x: 75, y: 75, position: 'CB' },
      // Midfield
      { x: 10, y: 50, position: 'LWB' },
      { x: 30, y: 55, position: 'CM' },
      { x: 50, y: 50, position: 'CM' },
      { x: 70, y: 55, position: 'CM' },
      { x: 90, y: 50, position: 'RWB' },
      // Attack
      { x: 40, y: 25, position: 'ST' },
      { x: 60, y: 25, position: 'ST' },
    ],
  },
];

export const useFormationStore = create<FormationState>((set, get) => ({
  players: [
    // Add some sample Falke players to start with
    {
      id: 'sample-stefan',
      name: 'Stefan',
      position: 'ST',
      number: 24, // Using the mapped number for Stefan
      photo: 'Stefan.png',
      x: 50,
      y: 30,
    },
    {
      id: 'sample-flo',
      name: 'Flo',
      position: 'CM',
      number: 7, // Using the mapped number for Flo
      photo: 'Flo.png',
      x: 40,
      y: 50,
    },
  ],
  currentFormation: null,
  selectedPlayer: null,
  formationPresets: defaultFormationPresets,

  addPlayer: (playerData) => {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      players: [...state.players, newPlayer],
    }));
  },

  updatePlayer: (id, updates) => {
    set((state) => ({
      players: state.players.map((player) =>
        player.id === id ? { ...player, ...updates } : player
      ),
    }));
  },

  removePlayer: (id) => {
    set((state) => ({
      players: state.players.filter((player) => player.id !== id),
      selectedPlayer: state.selectedPlayer?.id === id ? null : state.selectedPlayer,
    }));
  },

  replacePlayer: (oldPlayerId, newPlayer) => {
    set((state) => {
      const oldPlayer = state.players.find(p => p.id === oldPlayerId);
      if (!oldPlayer) return state;
      
      const replacementPlayer: Player = {
        ...newPlayer,
        id: `player-${Date.now()}`,
        x: oldPlayer.x, // Keep the same position
        y: oldPlayer.y,
      };
      
      return {
        players: state.players.map((player) =>
          player.id === oldPlayerId ? replacementPlayer : player
        ),
        selectedPlayer: state.selectedPlayer?.id === oldPlayerId ? replacementPlayer : state.selectedPlayer,
      };
    });
  },

  selectPlayer: (player) => {
    set({ selectedPlayer: player });
  },

  movePlayer: (id, x, y) => {
    set((state) => ({
      players: state.players.map((player) =>
        player.id === id ? { ...player, x, y } : player
      ),
    }));
  },

  loadFormation: (formation: Formation | Player[]) => {
    if (Array.isArray(formation)) {
      // If it's an array of players, load them directly
      set({
        players: formation,
        selectedPlayer: null,
      });
    } else {
      // If it's a Formation object, load it as before
      set({
        currentFormation: formation,
        players: formation.players,
        selectedPlayer: null,
      });
    }
  },

  saveFormation: (name, description) => {
    const { players } = get();
    const formation: Formation = {
      id: `formation-${Date.now()}`,
      name,
      description,
      players: [...players],
      formation: name, // This could be determined automatically
    };
    set({ currentFormation: formation });
  },

  setFormationPreset: (preset) => {
    const players: Player[] = preset.positions.map((pos, index) => ({
      id: `player-${Date.now()}-${index}`,
      name: `Player ${index + 1}`,
      position: pos.position,
      number: index + 1,
      x: pos.x,
      y: pos.y,
    }));
    
    set({ players });
  },
}));

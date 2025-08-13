import React, { useState } from 'react';
import { Plus, Edit3, Trash2, User } from 'lucide-react';
import { useFormationStore } from '../stores/formationStore';
import { Player } from '../types';

const PlayerManagement: React.FC = () => {
  const { 
    players, 
    selectedPlayer, 
    addPlayer, 
    updatePlayer, 
    removePlayer, 
    selectPlayer 
  } = useFormationStore();
  
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayerData, setNewPlayerData] = useState({
    name: '',
    position: 'MF',
    number: 1,
    x: 50,
    y: 50,
  });

  const positions = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CM', 'LM', 'RM', 'LW', 'RW', 'ST'];

  const handleAddPlayer = () => {
    if (newPlayerData.name.trim()) {
      addPlayer(newPlayerData);
      setNewPlayerData({
        name: '',
        position: 'MF',
        number: players.length + 2,
        x: 50,
        y: 50,
      });
      setIsAddingPlayer(false);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setNewPlayerData({
      name: player.name,
      position: player.position,
      number: player.number,
      x: player.x,
      y: player.y,
    });
  };

  const handleUpdatePlayer = () => {
    if (editingPlayer && newPlayerData.name.trim()) {
      updatePlayer(editingPlayer.id, newPlayerData);
      setEditingPlayer(null);
      setNewPlayerData({
        name: '',
        position: 'MF',
        number: players.length + 1,
        x: 50,
        y: 50,
      });
    }
  };

  const handleCancel = () => {
    setIsAddingPlayer(false);
    setEditingPlayer(null);
    setNewPlayerData({
      name: '',
      position: 'MF',
      number: players.length + 1,
      x: 50,
      y: 50,
    });
  };

  return (
    <div className="player-management">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Players</h3>
        <button
          onClick={() => setIsAddingPlayer(true)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Add Player
        </button>
      </div>

      {/* Add/Edit Player Form */}
      {(isAddingPlayer || editingPlayer) && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium mb-3">
            {editingPlayer ? 'Edit Player' : 'Add New Player'}
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newPlayerData.name}
                onChange={(e) => setNewPlayerData({ ...newPlayerData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Player name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  value={newPlayerData.position}
                  onChange={(e) => setNewPlayerData({ ...newPlayerData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newPlayerData.number}
                  onChange={(e) => setNewPlayerData({ ...newPlayerData, number: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {editingPlayer ? 'Update' : 'Add'} Player
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players List */}
      <div className="space-y-2">
        {players.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User size={48} className="mx-auto mb-2 opacity-50" />
            <p>No players added yet</p>
            <p className="text-sm">Click "Add Player" to get started</p>
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedPlayer?.id === player.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => selectPlayer(player)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {player.number}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-600">{player.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPlayer(player);
                    }}
                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlayer(player.id);
                    }}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;

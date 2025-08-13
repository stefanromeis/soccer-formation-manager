import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, Save, Download, Settings } from 'lucide-react';
import SoccerField from './components/SoccerField';
import FormationPresets from './components/FormationPresets';
import PlayerManagement from './components/PlayerManagement';
import DFBPlayerSearch from './components/DFBPlayerSearch';
import { useFormationStore } from './stores/formationStore';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('presets');
  const [fieldDimensions, setFieldDimensions] = useState({ width: 800, height: 600 });
  const { saveFormation } = useFormationStore();

  // Responsive field sizing
  useEffect(() => {
    const updateFieldSize = () => {
      const sidebar = sidebarOpen ? 320 : 0;
      const availableWidth = window.innerWidth - sidebar - 40; // 40px for padding
      const availableHeight = window.innerHeight - 120; // 120px for header and padding
      
      // Maintain aspect ratio (4:3)
      const aspectRatio = 4 / 3;
      let width = Math.min(availableWidth, 1000);
      let height = width / aspectRatio;
      
      if (height > availableHeight) {
        height = availableHeight;
        width = height * aspectRatio;
      }
      
      setFieldDimensions({ width: Math.max(400, width), height: Math.max(300, height) });
    };

    updateFieldSize();
    window.addEventListener('resize', updateFieldSize);
    return () => window.removeEventListener('resize', updateFieldSize);
  }, [sidebarOpen]);

  const handleSaveFormation = () => {
    const formationName = prompt('Enter formation name:');
    if (formationName) {
      saveFormation(formationName, 'Custom formation');
      alert('Formation saved successfully!');
    }
  };

  const handleExportFormation = () => {
    // In a real app, this would export as PNG/PDF
    alert('Export functionality would save the formation as an image or PDF');
  };

  const tabs = [
    { id: 'presets', label: 'Formations', icon: '⚽' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'dfb', label: 'DFB Search', icon: '🔍' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              ⚽ Soccer Formation Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveFormation}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Formation
            </button>
            <button
              onClick={handleExportFormation}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 bg-white shadow-sm border-r min-h-screen">
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="h-[calc(100vh-180px)] overflow-y-auto">
                {activeTab === 'presets' && <FormationPresets />}
                {activeTab === 'players' && <PlayerManagement />}
                {activeTab === 'dfb' && <DFBPlayerSearch />}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SoccerField 
                width={fieldDimensions.width} 
                height={fieldDimensions.height} 
              />
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Select a formation preset from the sidebar to get started</li>
                <li>• Drag players around the field to customize positions</li>
                <li>• Add custom players or search the DFB database</li>
                <li>• Click on players to select and edit their details</li>
                <li>• Save your formations for later use</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

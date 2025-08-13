import { useState, useEffect } from 'react';
import { Menu, Download } from 'lucide-react';
import SoccerField from './components/SoccerField';
import FormationPresets from './components/FormationPresets';
import PlayerManagement from './components/PlayerManagement';
import DFBPlayerSearch from './components/DFBPlayerSearch';
import FalkePlayerLibrary from './components/FalkePlayerLibrary';
import { useFormationStore } from './stores/formationStore';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('presets');
  const [fieldDimensions, setFieldDimensions] = useState({ width: 800, height: 600 });

  // Responsive field sizing
  useEffect(() => {
    const updateFieldSize = () => {
      const isMobile = window.innerWidth < 768;
      const sidebar = sidebarOpen && !isMobile ? 400 : 0; // Hide sidebar on mobile when closed
      const availableWidth = window.innerWidth - sidebar - (isMobile ? 20 : 40); // Less padding on mobile
      const availableHeight = window.innerHeight - (isMobile ? 80 : 120); // Less height reserved on mobile
      
      // Maintain aspect ratio (4:3)
      const aspectRatio = 4 / 3;
      let width = Math.min(availableWidth, isMobile ? 400 : 1000);
      let height = width / aspectRatio;
      
      if (height > availableHeight) {
        height = availableHeight;
        width = height * aspectRatio;
      }
      
      setFieldDimensions({ 
        width: Math.max(isMobile ? 300 : 400, width), 
        height: Math.max(isMobile ? 225 : 300, height) 
      });
    };

    updateFieldSize();
    window.addEventListener('resize', updateFieldSize);
    return () => window.removeEventListener('resize', updateFieldSize);
  }, [sidebarOpen]);

  const handleExportFormation = () => {
    const { players } = useFormationStore.getState();
    const formationData = {
      name: 'Meine Aufstellung',
      timestamp: new Date().toISOString(),
      players: players
    };
    
    const dataStr = JSON.stringify(formationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `formation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFormation = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const formationData = JSON.parse(e.target?.result as string);
            if (formationData.players && Array.isArray(formationData.players)) {
              const { loadFormation } = useFormationStore.getState();
              loadFormation(formationData.players);
              alert(`Aufstellung "${formationData.name || 'Unbenannt'}" erfolgreich geladen!`);
            } else {
              alert('Ungültige Aufstellungsdatei!');
            }
          } catch (error) {
            alert('Fehler beim Laden der Aufstellung!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const tabs = [
    { id: 'presets', label: 'Aufstellungen', icon: '⚽' },
    { id: 'falke', label: 'Falke', icon: '🦅' },
    { id: 'players', label: 'Spieler', icon: '�' },
    { id: 'dfb', label: 'DFB Suche', icon: '🔍' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="md:hidden" />
              <Menu size={24} className="hidden md:block" />
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              <span className="hidden sm:inline">⚽ Fußball Aufstellungs-Manager</span>
              <span className="sm:hidden">⚽ Formation</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={handleExportFormation}
              className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
            >
              <Download size={14} className="mr-1 md:mr-2 md:hidden" />
              <Download size={16} className="mr-2 hidden md:block" />
              <span className="hidden sm:inline">Als Datei speichern</span>
              <span className="sm:hidden">Speichern</span>
            </button>
            <button
              onClick={handleImportFormation}
              className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
            >
              <span className="mr-1 md:mr-2 text-sm">📂</span>
              <span className="hidden sm:inline">Datei laden</span>
              <span className="sm:hidden">Laden</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        {sidebarOpen && (
          <nav className="w-12 md:w-16 bg-white shadow-sm border-r min-h-screen flex flex-col">
            <div className="flex flex-col space-y-1 md:space-y-2 p-1 md:p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg text-sm md:text-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={tab.label}
                >
                  {tab.icon}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Main Content Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 md:w-80 bg-white shadow-sm border-r min-h-screen">
            <div className="p-2 md:p-4">
              {/* Tab Content */}
              <div className="h-[calc(100vh-100px)] overflow-y-auto">
                {activeTab === 'presets' && <FormationPresets />}
                {activeTab === 'players' && <PlayerManagement />}
                {activeTab === 'dfb' && <DFBPlayerSearch />}
                {activeTab === 'falke' && <FalkePlayerLibrary />}
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
              <h3 className="font-semibold text-blue-900 mb-2">So verwenden Sie die App:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Wählen Sie eine Aufstellungsvorlage aus der Seitenleiste zum Starten</li>
                <li>• Ziehen Sie Spieler auf dem Feld herum, um Positionen anzupassen</li>
                <li>• Fügen Sie benutzerdefinierte Spieler hinzu oder durchsuchen Sie die DFB-Datenbank</li>
                <li>• Verwenden Sie den Falke-Tab, um Teamspieler mit ihren Fotos hinzuzufügen</li>
                <li>• Klicken Sie auf Spieler, um sie auszuwählen und ihre Details zu bearbeiten</li>
                <li>• Speichern Sie Ihre Aufstellungen lokal oder laden Sie sie als JSON-Datei</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import { useFormationStore } from '../stores/formationStore';
import { FormationPreset } from '../types';

const FormationPresets: React.FC = () => {
  const { formationPresets, setFormationPreset } = useFormationStore();

  const handlePresetClick = (preset: FormationPreset) => {
    setFormationPreset(preset);
  };

  return (
    <div className="formation-presets">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Formation Presets</h3>
      <div className="grid grid-cols-1 gap-3">
        {formationPresets.map((preset) => (
          <div
            key={preset.name}
            className="formation-preset"
            onClick={() => handlePresetClick(preset)}
          >
            <div className="text-center">
              <h4 className="font-bold text-lg text-blue-600">{preset.formation}</h4>
              <p className="text-sm text-gray-600 mt-1">{preset.name}</p>
            </div>
            
            {/* Mini field visualization */}
            <div className="relative w-full h-24 bg-green-400 rounded mt-3 overflow-hidden">
              <div className="absolute inset-0 border border-white">
                {/* Center line */}
                <div className="absolute w-full h-0.5 bg-white top-1/2 transform -translate-y-1/2"></div>
                
                {/* Players positions */}
                {preset.positions.map((pos, index) => (
                  <div
                    key={index}
                    className="absolute w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormationPresets;

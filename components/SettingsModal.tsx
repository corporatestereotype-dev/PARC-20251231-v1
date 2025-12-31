

import React, { useState, useEffect, useRef } from 'react';
import type { Settings, AIProvider, StorageProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
  onEngageAutonomy: () => void;
  onOpenCommunityManager: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, onEngageAutonomy, onOpenCommunityManager }) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const isInitialMount = useRef(true);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings, isOpen]);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      onSave(currentSettings); // Let App.tsx handle saving to localStorage
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [currentSettings, onSave]);


  if (!isOpen) {
    return null;
  }

  const handleProviderChange = (provider: AIProvider) => {
    setCurrentSettings(prev => ({ ...prev, aiProvider: provider }));
  };
  
  const handleStorageProviderChange = (provider: StorageProvider) => {
    setCurrentSettings(prev => ({ ...prev, storageProvider: provider }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSettings(prev => ({ ...prev, ollamaModel: e.target.value }));
  };
  
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSettings(prev => ({ ...prev, storagePath: e.target.value }));
  };
  
  const getStorageProviderConfig = () => {
    switch (currentSettings.storageProvider) {
        case 'dropbox':
            return {
                prefix: '/Dropbox/',
                placeholder: 'e.g., Apps/PARC_Data',
                description: 'The Dropbox folder where PARC will store project data.'
            };
        case 'one-drive':
            return {
                prefix: '/OneDrive/',
                placeholder: 'e.g., Documents/PARC',
                description: 'The OneDrive folder where PARC will store project data.'
            };
        case 'local-storage':
            return {
                prefix: '/Local/',
                placeholder: 'e.g., Documents/PARC_Data',
                description: 'The local directory path for storing project data.'
            };
        case 'google-drive':
        default:
            return {
                prefix: '/My Drive/',
                placeholder: 'e.g., PARC_Projects/Data',
                description: 'The Google Drive folder where PARC will store project data.'
            };
    }
  }
  
  const storageConfig = getStorageProviderConfig();


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div 
        className="bg-[var(--bg-secondary)] rounded-lg shadow-2xl p-8 w-full max-w-md m-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Close settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex justify-between items-center mb-6">
            <h2 id="settings-modal-title" className="text-2xl font-bold text-white">Settings</h2>
            <div className={`text-sm font-medium text-emerald-400 transition-opacity duration-300 ${saveStatus === 'saved' ? 'opacity-100' : 'opacity-0'}`}>
                Saved!
            </div>
        </div>
        
        <div className="space-y-6">
           <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Community Management</label>
             <button
                onClick={onOpenCommunityManager}
                className="w-full bg-[var(--bg-tertiary)] hover:bg-slate-600 text-[var(--text-primary)] font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                Switch / Create Community...
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">AI Provider</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleProviderChange('gemini')}
                className={`px-4 py-3 rounded-md text-center font-medium transition-colors ${currentSettings.aiProvider === 'gemini' ? 'bg-[var(--accent-primary)] text-white ring-2 ring-[var(--text-accent)]' : 'bg-[var(--bg-tertiary)] hover:bg-slate-600'}`}
              >
                Gemini
              </button>
              <button
                onClick={() => handleProviderChange('ollama')}
                className={`px-4 py-3 rounded-md text-center font-medium transition-colors ${currentSettings.aiProvider === 'ollama' ? 'bg-[var(--accent-primary)] text-white ring-2 ring-[var(--text-accent)]' : 'bg-[var(--bg-tertiary)] hover:bg-slate-600'}`}
              >
                Ollama (Local)
              </button>
            </div>
          </div>

          {currentSettings.aiProvider === 'ollama' && (
            <div>
              <label htmlFor="ollama-model" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Ollama Model Name
              </label>
              <input
                type="text"
                id="ollama-model"
                value={currentSettings.ollamaModel}
                onChange={handleModelChange}
                className="w-full bg-[var(--bg-tertiary)] border border-slate-600 rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none"
                placeholder="e.g., llama3, codellama"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                Ensure your local Ollama server is running at http://localhost:11434.
              </p>
            </div>
          )}
          
           <div className="space-y-3">
              <label htmlFor="storage-provider" className="block text-sm font-medium text-[var(--text-secondary)]">
                Data Storage Provider
              </label>
               <select
                id="storage-provider"
                value={currentSettings.storageProvider}
                onChange={(e) => handleStorageProviderChange(e.target.value as StorageProvider)}
                className="w-full bg-[var(--bg-tertiary)] border border-slate-600 rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none"
              >
                <option value="google-drive">Google Drive (Conceptual)</option>
                <option value="local-storage">Local Storage (Conceptual)</option>
                <option value="dropbox">Dropbox (Conceptual)</option>
                <option value="one-drive">OneDrive (Conceptual)</option>
              </select>

              <label htmlFor="storage-path" className="block text-sm font-medium text-[var(--text-secondary)] sr-only">
                Storage Path
              </label>
              <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] border border-slate-600 rounded-md focus-within:ring-2 focus-within:ring-[var(--accent-primary)] pr-3">
                  <span className="pl-3 text-slate-500">{storageConfig.prefix}</span>
                  <input
                      type="text"
                      id="storage-path"
                      value={currentSettings.storagePath || ''}
                      onChange={handlePathChange}
                      className="flex-1 bg-transparent py-2 px-1 text-[var(--text-primary)] focus:outline-none"
                      placeholder={storageConfig.placeholder}
                  />
              </div>
              <p className="text-xs text-slate-500">
                {storageConfig.description} This is a conceptual setting.
              </p>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[var(--border-primary)]">
            <h3 className="text-lg font-semibold text-white mb-2">AI Autonomy Control</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
                Launch a timed or supervised session where the AI works continuously on the active research simulation.
            </p>
            <button
                onClick={onEngageAutonomy}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Engage Autonomous Mode...
            </button>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">Settings are saved automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

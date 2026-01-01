import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DeleteModal } from '../components/DeleteModal';
import { NotesDataProvider } from '../context/NotesDataContext';
import { NotesUIProvider } from '../context/NotesUIContext';
import { DeleteTagModal } from '../components/tags/DeleteTagModal';

export const RootLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NotesUIProvider>
      <NotesDataProvider>
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans relative">
          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
          
          <div className="flex-1 flex flex-col min-w-0">
            <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
            
            <main className="flex-1 flex overflow-hidden relative">
              <Outlet />
            </main>
          </div>
          <DeleteModal />
          <DeleteTagModal />
        </div>
      </NotesDataProvider>
    </NotesUIProvider>
  );
};

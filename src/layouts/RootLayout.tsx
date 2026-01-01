import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DeleteModal } from '../components/DeleteModal';
import { NotesProvider } from '../context/NotesContext';

export const RootLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NotesProvider>
      <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans relative">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <main className="flex-1 flex overflow-hidden relative">
            <Outlet />
          </main>
        </div>
        <DeleteModal />
      </div>
    </NotesProvider>
  );
};

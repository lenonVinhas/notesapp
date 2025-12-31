import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { DeleteModal } from './components/DeleteModal';
import { NotesProvider, useNotes } from './context/NotesContext';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { cn } from './utils/cn';

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeNoteId } = useNotes();

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans relative">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 flex overflow-hidden relative">
          <div className={cn(
            "h-full overflow-hidden shrink-0",
            activeNoteId ? "hidden md:block" : "block w-full"
          )}>
            <NoteList />
          </div>
          <div className={cn(
            "flex-1 min-w-0 h-full overflow-hidden flex flex-col",
            activeNoteId ? "flex" : "hidden md:flex"
          )}>
            <NoteEditor />
          </div>
        </main>
      </div>
      <DeleteModal />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <NotesProvider>
          <AppContent />
        </NotesProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { DeleteModal } from './components/DeleteModal';
import { NotesProvider } from './context/NotesContext';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <NotesProvider>
          <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              
              <main className="flex-1 flex overflow-hidden">
                <NoteList />
                <NoteEditor />
              </main>
            </div>
            <DeleteModal />
          </div>
        </NotesProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App

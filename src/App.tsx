import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { RootLayout } from './layouts/RootLayout';
import { MainLayout } from './layouts/MainLayout';
import { NoteEditor } from './components/NoteEditor';
import { NoNoteSelected } from './components/notes/NoNoteSelected';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <NoNoteSelected /> },
          { path: ":noteId", element: <NoteEditor /> },
          
          { path: "archived", element: <NoNoteSelected /> },
          { path: "archived/:noteId", element: <NoteEditor /> },
          
          { path: "tags/:tagId", element: <NoNoteSelected /> },
          { path: "tags/:tagId/:noteId", element: <NoteEditor /> },
          
          { path: ":noteId/delete", element: <NoteEditor /> },
          { path: "archived/:noteId/delete", element: <NoteEditor /> },
          { path: "tags/:tagId/:noteId/delete", element: <NoteEditor /> },
        ]
      }
    ]
  }
]);

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  )
}

export default App

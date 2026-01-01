import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { NoteList } from '../components/NoteList';
import { cn } from '../utils/cn';

export const MainLayout: React.FC = () => {
  const { noteId } = useParams();
  const hasActiveNote = !!noteId;

  return (
    <>
      <div className={cn(
        "h-full overflow-hidden shrink-0",
        hasActiveNote ? "hidden md:block" : "block w-full md:w-auto"
      )}>
        <NoteList />
      </div>
      <div className={cn(
        "flex-1 min-w-0 h-full overflow-hidden flex flex-col",
        hasActiveNote ? "flex" : "hidden md:flex"
      )}>
        <Outlet />
      </div>
    </>
  );
};

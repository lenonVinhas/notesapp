import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ to, icon: Icon, label, end, onClick }) => {
  const { search } = useLocation();
  const fullTo = `${to}${search}`;

  return (
    <NavLink
      to={fullTo}
      end={end}
      onClick={onClick}
      className={({ isActive }) => cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
        isActive ? "bg-zinc-900 text-white shadow-lg shadow-zinc-100" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
          {label}
        </>
      )}
    </NavLink>
  );
};

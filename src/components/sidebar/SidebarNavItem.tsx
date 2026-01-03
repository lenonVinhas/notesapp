import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
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
      aria-label={label}
      className={({ isActive }) => cn(
        "relative w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200",
        isActive ? "text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-zinc-900 rounded-xl shadow-lg shadow-zinc-100 -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-400")} />
          {label}
        </>
      )}
    </NavLink>
  );
};

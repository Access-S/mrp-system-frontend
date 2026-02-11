// src/components/ui/WidgetCard.tsx

import React from "react";

interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
}

export function WidgetCard({ children, className = "" }: WidgetCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className}`}>
      {children}
    </div>
  );
}

interface WidgetHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function WidgetHeader({ title, icon, actions, badge }: WidgetHeaderProps) {
  return (
    <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {title}
        </h3>
        {badge}
      </div>
      {actions && <div className="flex gap-1">{actions}</div>}
    </div>
  );
}

interface WidgetBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function WidgetBody({ children, className = "" }: WidgetBodyProps) {
  return (
    <div className={`p-4 flex-1 ${className}`}>
      {children}
    </div>
  );
}

interface MiniActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  title?: string;
}

export function MiniActionButton({ onClick, icon, title }: MiniActionButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-md text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center"
    >
      {icon}
    </button>
  );
}
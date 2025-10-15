import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarSubLinkProps {
    to: string;
    icon: LucideIcon;
    label: string;
    isActive: boolean;
}

export function SidebarSubLink({ to, icon: Icon, label, isActive }: SidebarSubLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm',
                'hover:bg-gray-300 dark:hover:bg-gray-700',
                isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
            )}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{label}</span>
        </Link>
    );
}

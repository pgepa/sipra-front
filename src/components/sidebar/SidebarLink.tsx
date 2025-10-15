import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
    to: string;
    icon: LucideIcon;
    label: string;
    isActive: boolean;
    isOpen: boolean;
}

export function SidebarLink({ to, icon: Icon, label, isActive, isOpen }: SidebarLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-gray-300 dark:hover:bg-gray-700',
                isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400'
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="font-medium truncate">{label}</span>}
        </Link>
    );
}

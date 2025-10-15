import { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarGroupProps {
    icon: LucideIcon;
    label: string;
    isActive: boolean;
    isOpen: boolean;
    children: React.ReactNode;
}

export function SidebarGroup({ icon: Icon, label, isActive, isOpen, children }: SidebarGroupProps) {
    const [isExpanded, setIsExpanded] = useState(isActive);

    return (
        <div className="relative">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg transition-all duration-200',
                    'hover:bg-gray-300 dark:hover:bg-gray-700',
                    isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-400'
                )}
            >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && (
                    <>
                        <span className="font-medium flex-1 truncate">{label}</span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    </>
                )}
            </button>
            {isExpanded && isOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-700 pl-2">
                    {children}
                </div>
            )}
        </div>
    );
}

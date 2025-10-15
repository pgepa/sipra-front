import { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: ReactNode;
    count?: number;
}

export function CollapsibleSection({
    title,
    isExpanded,
    onToggle,
    children,
    count,
}: CollapsibleSectionProps) {
    return (
        <div className="space-y-3">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-3 text-lg font-bold text-white p-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
                <div className="flex items-center gap-2">
                    <span>{title}</span>
                    {count !== undefined && (
                        <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded-full">
                            {count}
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0" />
                ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0" />
                )}
            </button>

            {isExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

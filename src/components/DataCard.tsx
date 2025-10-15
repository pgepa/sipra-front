import { ReactNode } from 'react';

interface DataCardProps {
    children: ReactNode;
    colorBar?: string;
}

export function DataCard({ children, colorBar }: DataCardProps) {
    return (
        <div className="flex col-span-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-800">
            {colorBar && (
                <div
                    className="w-1 mr-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorBar }}
                />
            )}
            <div className="flex-1">{children}</div>
        </div>
    );
}

interface DataFieldProps {
    label: string;
    value: ReactNode;
    className?: string;
}

export function DataField({ label, value, className = '' }: DataFieldProps) {
    return (
        <div className={`flex flex-col gap-1 min-w-[150px] ${className}`}>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {label}
            </span>
            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {value || '-'}
            </span>
        </div>
    );
}

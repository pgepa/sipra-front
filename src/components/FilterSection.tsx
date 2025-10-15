import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FilterSectionProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export function FilterSection({ label, children, className = '' }: FilterSectionProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                {label}
            </Label>
            {children}
        </div>
    );
}

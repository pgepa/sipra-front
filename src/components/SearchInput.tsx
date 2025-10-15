import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}

export function SearchInput({
    placeholder,
    value,
    onChange,
    type = 'text',
}: SearchInputProps) {
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </span>
            <Input
                type={type}
                placeholder={placeholder}
                className="pl-10 focus:ring-2 focus:ring-violet-500 transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface MultiSelectDropdownProps {
    options: string[];
    selectedValues: string[];
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function MultiSelectDropdown({
    options,
    selectedValues,
    onValueChange,
    placeholder = 'Escolha uma opção',
    disabled = false,
}: MultiSelectDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    disabled={disabled}
                >
                    <span className="font-normal truncate text-gray-700 dark:text-gray-300">
                        {selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 max-h-64 overflow-y-auto">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option}
                        className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Checkbox
                            checked={selectedValues.includes(option)}
                            onCheckedChange={() => onValueChange(option)}
                        />
                        <Label className="ml-2 font-normal cursor-pointer flex-1">
                            {option}
                        </Label>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

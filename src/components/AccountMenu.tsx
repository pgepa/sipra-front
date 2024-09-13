import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
export function AccountMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className='flex items-center gap-2 select-none'>
                    SIPRA
                    <ChevronDown className='h-4 w-4'/>
                </Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}
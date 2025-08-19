import { Menu } from 'lucide-react';
import { AccountMenu } from '@/components/AccountMenu';
import Logo from '@/assets/logo.svg'
import { Separator } from '@/components/ui/separator';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <div className="border-b fixed top-0 left-0 right-0 z-50 bg-white">
            <div className="flex h-16 items-center gap-4 md:gap-6 px-4 md:px-6 bg-gradient-to-r from-indigo-500 to-indigo-100 shadow-xl">
                
                <button 
                    onClick={onMenuClick} 
                    className="md:hidden text-white"
                    aria-label="Abrir menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-3 text-white">
                    <img className="h-10 w-10 md:h-12 md:w-12 text-white" src={Logo} alt="Logo" />
                    
                    <Separator orientation="vertical" className="h-6 hidden lg:block" />
                    <span className="font-bold hidden sm:block">PROCURADORIA DA DÍVIDA ATIVA</span>
                </div>

                <div className='ml-auto flex items-center gap-2'>
                    <AccountMenu />
                </div>
            </div>
        </div>
    );
}
import { Menu } from 'lucide-react';
import { AccountMenu } from '@/components/AccountMenu';
import Logo from '@/assets/logo.svg';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div
                className={cn(
                    'flex h-16 items-center gap-4 md:gap-6 px-4 md:px-6',
                    'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400',
                    'dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-700',
                    'shadow-lg backdrop-blur-sm'
                )}
            >
                {/* Menu Button (Mobile) */}
                <button
                    onClick={onMenuClick}
                    className={cn(
                        'md:hidden p-2 rounded-lg transition-all duration-200',
                        'text-white hover:bg-white/20',
                        'active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50'
                    )}
                    aria-label="Abrir menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Logo and Title */}
                <div className="flex items-center gap-3 text-white">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
                        <img
                            className="relative h-10 w-10 md:h-12 md:w-12 drop-shadow-lg"
                            src={Logo}
                            alt="Logo SIDA"
                        />
                    </div>

                    <Separator
                        orientation="vertical"
                        className="h-8 bg-white/30 hidden lg:block"
                    />

                    <div className="hidden sm:flex flex-col">
                        <span className="font-bold text-sm md:text-base leading-tight tracking-wide">
                            PROCURADORIA DA DÍVIDA ATIVA
                        </span>
                        <span className="text-xs text-white/80 hidden md:block">
                            SIDA - Sistema de Inteligência da Dívida Ativa
                        </span>
                    </div>
                </div>

                {/* Account Menu */}
                <div className="ml-auto flex items-center gap-2">
                    <AccountMenu />
                </div>
            </div>
        </header>
    );
}

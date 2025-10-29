import {
    House, ChevronFirst, PcCase, UserRoundSearch, HandCoins,
    UserRound, X, Workflow
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarLink } from './sidebar/SidebarLink';
import { SidebarGroup } from './sidebar/SidebarGroup';
import { SidebarSubLink } from './sidebar/SidebarSubLink';
import { cn } from '@/lib/utils';

export function SidebarEstagiario({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const location = useLocation();

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] z-40',
                    'bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
                    'transition-all duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'md:translate-x-0',
                    isOpen ? 'w-72' : 'md:w-20',
                    'flex flex-col'
                )}
            >
                <div className="flex-shrink-0 p-3 relative">
                    <button
                        className={cn(
                            'absolute hidden md:flex items-center justify-center',
                            '-right-3 top-4 w-6 h-6 rounded-full',
                            'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700',
                            'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400',
                            'shadow-md hover:shadow-lg transition-all duration-200',
                            !isOpen && 'rotate-180'
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <ChevronFirst className="h-4 w-4" />
                    </button>

                    <button
                        className="md:hidden text-gray-700 dark:text-gray-300 ml-auto hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 thin-scrollbar">
                    <SidebarLink
                        to="/homeestagiario"
                        icon={House}
                        label="Home"
                        isActive={location.pathname === "/homeestagiario"}
                        isOpen={isOpen}
                    />

                    <SidebarGroup
                        icon={UserRound}
                        label="Pessoas"
                        isActive={location.pathname.startsWith("/estagiario/pessoas")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/estagiario/pessoas/cnpj" icon={PcCase} label="Pessoa Jurídica" isActive={location.pathname === "/estagiario/pessoas/cnpj"} />
                        <SidebarSubLink to="/estagiario/pessoas/cpf" icon={UserRoundSearch} label="Pessoa Física" isActive={location.pathname === "/estagiario/pessoas/cpf"} />
                    </SidebarGroup>

                    <SidebarLink
                        to="/estagiario/consultadebitos"
                        icon={HandCoins}
                        label="Consulta de Débitos"
                        isActive={location.pathname === "/estagiario/consultadebitos"}
                        isOpen={isOpen}
                    />

                    <SidebarLink
                        to="/estagiario/fluxogramas"
                        icon={Workflow}
                        label="Fluxogramas"
                        isActive={location.pathname.startsWith("/estagiario/fluxogramas")}
                        isOpen={isOpen}
                    />
                </nav>
            </aside>
        </>
    );
}

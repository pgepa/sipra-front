import {
    FileSearch, House, ChevronFirst, Ruler, Gavel, Scale, ChartArea,
    ChartScatter, ChartNoAxesCombined, PcCase, UserRoundSearch, ChartPie,
    HandCoins, UserRound, X, ShieldCheck
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarLink } from './sidebar/SidebarLink';
import { SidebarGroup } from './sidebar/SidebarGroup';
import { SidebarSubLink } from './sidebar/SidebarSubLink';
import { cn } from '@/lib/utils';

export function SidebarProcurador({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
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
                        to="/homeprocurador"
                        icon={House}
                        label="Home"
                        isActive={location.pathname === "/homeprocurador"}
                        isOpen={isOpen}
                    />

                    <SidebarGroup
                        icon={Ruler}
                        label="Régua de Cobrança"
                        isActive={location.pathname.startsWith("/procurador/reguacobranca")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/procurador/reguacobranca/protesto" icon={FileSearch} label="Protesto" isActive={location.pathname === "/procurador/reguacobranca/protesto"} />
                        <SidebarSubLink to="/procurador/reguacobranca/ajuizamento" icon={Gavel} label="Para Ajuizamento" isActive={location.pathname === "/procurador/reguacobranca/ajuizamento"} />
                        <SidebarSubLink to="/procurador/reguacobranca/ajuizadas" icon={Scale} label="Ajuizadas" isActive={location.pathname === "/procurador/reguacobranca/ajuizadas"} />
                    </SidebarGroup>

                    <SidebarGroup
                        icon={UserRound}
                        label="Pessoas"
                        isActive={location.pathname.startsWith("/procurador/pessoas")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/procurador/pessoas/cnpj" icon={PcCase} label="Pessoa Jurídica" isActive={location.pathname === "/procurador/pessoas/cnpj"} />
                        <SidebarSubLink to="/procurador/pessoas/cpf" icon={UserRoundSearch} label="Pessoa Física" isActive={location.pathname === "/procurador/pessoas/cpf"} />
                    </SidebarGroup>

                    <SidebarGroup
                        icon={ChartNoAxesCombined}
                        label="Dashboard"
                        isActive={location.pathname.startsWith("/procurador/dashboard")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/procurador/dashboard/acompanhamentoprotesto" icon={ChartPie} label="Protesto" isActive={location.pathname === "/procurador/dashboard/acompanhamentoprotesto"} />
                        <SidebarSubLink to="/procurador/dashboard/acompanhamentopda" icon={ChartScatter} label="Gestão PDA" isActive={location.pathname === "/procurador/dashboard/acompanhamentopda"} />
                        <SidebarSubLink to="/procurador/dashboard/acompanhamentocda" icon={ChartArea} label="CDAs" isActive={location.pathname === "/procurador/dashboard/acompanhamentocda"} />
                    </SidebarGroup>

                    <SidebarLink
                        to="/procurador/consultadebitos"
                        icon={HandCoins}
                        label="Consulta de Débitos"
                        isActive={location.pathname === "/procurador/consultadebitos"}
                        isOpen={isOpen}
                    />

                    <SidebarGroup
                        icon={Gavel}
                        label="Execução Fiscal"
                        isActive={location.pathname.startsWith("/procurador/recc")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/procurador/recc/acompanhamentoespecial" icon={ShieldCheck} label="Regime Especial" isActive={location.pathname === "/procurador/recc/acompanhamentoespecial"} />
                    </SidebarGroup>
                </nav>
            </aside>
        </>
    );
}

import {
    FileSearch, House, ChevronFirst, History, CloudUpload,
    DatabaseBackup, Ruler, Gavel, Users, Scale, ChartArea, ChartScatter,
    ChartNoAxesCombined, PcCase, UserRoundSearch, ChartPie, Handshake,
    HandCoins, UserRound, X, ShieldCheck, Workflow
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarLink } from './sidebar/SidebarLink';
import { SidebarGroup } from './sidebar/SidebarGroup';
import { SidebarSubLink } from './sidebar/SidebarSubLink';
import { cn } from '@/lib/utils';

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
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
                        to="/home"
                        icon={House}
                        label="Home"
                        isActive={location.pathname === "/home"}
                        isOpen={isOpen}
                    />

                    <SidebarGroup
                        icon={Ruler}
                        label="Régua de Cobrança"
                        isActive={location.pathname.startsWith("/reguacobranca")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/reguacobranca/protesto" icon={FileSearch} label="Protesto" isActive={location.pathname === "/reguacobranca/protesto"} />
                        <SidebarSubLink to="/reguacobranca/ajuizamento" icon={Gavel} label="Para Ajuizamento" isActive={location.pathname === "/reguacobranca/ajuizamento"} />
                        <SidebarSubLink to="/reguacobranca/ajuizadas" icon={Scale} label="Ajuizadas" isActive={location.pathname === "/reguacobranca/ajuizadas"} />
                    </SidebarGroup>

                    <SidebarGroup
                        icon={UserRound}
                        label="Pessoas"
                        isActive={location.pathname.startsWith("/pessoas")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/pessoas/cnpj" icon={PcCase} label="Pessoa Jurídica" isActive={location.pathname === "/pessoas/cnpj"} />
                        <SidebarSubLink to="/pessoas/cpf" icon={UserRoundSearch} label="Pessoa Física" isActive={location.pathname === "/pessoas/cpf"} />
                    </SidebarGroup>

                    <SidebarGroup
                        icon={ChartNoAxesCombined}
                        label="Dashboard"
                        isActive={location.pathname.startsWith("/dashboard")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/dashboard/acompanhamentoprotesto" icon={ChartPie} label="Protesto" isActive={location.pathname === "/dashboard/acompanhamentoprotesto"} />
                        <SidebarSubLink to="/dashboard/acompanhamentopda" icon={ChartScatter} label="Gestão PDA" isActive={location.pathname === "/dashboard/acompanhamentopda"} />
                        <SidebarSubLink to="/dashboard/acompanhamentocda" icon={ChartArea} label="CDAs" isActive={location.pathname === "/dashboard/acompanhamentocda"} />
                        <SidebarSubLink to="/dashboard/pagamentossiat" icon={Handshake} label="Pagamentos" isActive={location.pathname === "/dashboard/pagamentossiat"} />
                    </SidebarGroup>

                    <SidebarGroup
                        icon={Gavel}
                        label="Gestão de Processos"
                        isActive={location.pathname.startsWith("/recc")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/recc/acompanhamentoespecial" icon={ShieldCheck} label="Execução Fiscal" isActive={location.pathname === "/recc/acompanhamentoespecial"} />
                    </SidebarGroup>

                    <SidebarLink
                        to="/consultadebitos"
                        icon={HandCoins}
                        label="Consulta de Débitos"
                        isActive={location.pathname === "/consultadebitos"}
                        isOpen={isOpen}
                    />

                    <SidebarLink
                        to="/fluxogramas"
                        icon={Workflow}
                        label="Fluxogramas"
                        isActive={location.pathname.startsWith("/fluxogramas")}
                        isOpen={isOpen}
                    />

                    <SidebarGroup
                        icon={CloudUpload}
                        label="Upload Database"
                        isActive={location.pathname.startsWith("/upload")}
                        isOpen={isOpen}
                    >
                        <SidebarSubLink to="/upload/ultimaatualizacao" icon={History} label="Status Database" isActive={location.pathname === "/upload/ultimaatualizacao"} />
                        <SidebarSubLink to="/upload/semas" icon={DatabaseBackup} label="Semas" isActive={location.pathname === "/upload/semas"} />
                        <SidebarSubLink to="/upload/sefa" icon={DatabaseBackup} label="Sefa" isActive={location.pathname === "/upload/sefa"} />
                        <SidebarSubLink to="/upload/adepara" icon={DatabaseBackup} label="Adepara" isActive={location.pathname === "/upload/adepara"} />
                        <SidebarSubLink to="/upload/jucepapj" icon={DatabaseBackup} label="Jucepa PJ" isActive={location.pathname === "/upload/jucepapj"} />
                        <SidebarSubLink to="/upload/jucepavinculo" icon={DatabaseBackup} label="Jucepa Vínculo" isActive={location.pathname === "/upload/jucepavinculo"} />
                        <SidebarSubLink to="/upload/detranrenach" icon={DatabaseBackup} label="Detran - Renach" isActive={location.pathname === "/upload/detranrenach"} />
                        <SidebarSubLink to="/upload/detransidet" icon={DatabaseBackup} label="Detran - Sidet" isActive={location.pathname === "/upload/detransidet"} />
                        <SidebarSubLink to="/upload/detranveiculo" icon={DatabaseBackup} label="Detran - Veículo" isActive={location.pathname === "/upload/detranveiculo"} />
                        <SidebarSubLink to="/upload/detranmodelo" icon={DatabaseBackup} label="Detran - Modelo" isActive={location.pathname === "/upload/detranmodelo"} />
                        <SidebarSubLink to="/upload/cenprot" icon={DatabaseBackup} label="Cenprot" isActive={location.pathname === "/upload/cenprot"} />
                    </SidebarGroup>

                    <SidebarLink
                        to="/usuarios"
                        icon={Users}
                        label="Usuários"
                        isActive={location.pathname === "/usuarios"}
                        isOpen={isOpen}
                    />
                </nav>
            </aside>
        </>
    );
}

import {
    FileSearch,
    House,
    ChevronFirst,
    ChevronDown,
    Ruler,
    Gavel,
    Scale,
    ChartNoAxesCombined,
    PcCase,
    UserRoundSearch,
    ChartPie,
    ChartScatter,
    ChartArea,
    HandCoins,
    ScanEye,
    Brain,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function SidebarProcurador({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const location = useLocation();
    const [reguaCobrancaOpen, setReguaCobrancaOpen] = useState(false);
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const [pessoasOpen, setPessoasOpen] = useState(false);
    const [RegimeEspecialOpen, setRegimeEspecialOpen] = useState(false);

    return (
        <aside
            className={`bg-gray-200 p-3 h-full relative transition-all duration-300 ${
                open ? 'w-[17.5rem]' : 'w-20'
            }`}
        >
            <ChevronFirst
                className={`absolute cursor-pointer -right-3 top-4 rounded-full w-7 border-3 text-gray-700 hover:text-gray-500 transition-transform ${
                    open ? '' : 'rotate-180'
                }`}
                onClick={() => setOpen(!open)}
            />
            <nav className="space-y-2 mt-4 flex flex-col">
                <Link
                    to="/homeprocurador"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                        location.pathname === '/homeprocurador'
                            ? 'font-bold text-indigo-700'
                            : 'text-gray-500'
                    }`}
                >
                    <House className="h-6 w-6" />
                    {open && <span className="font-medium">Home</span>}
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setReguaCobrancaOpen(!reguaCobrancaOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${
                            location.pathname.startsWith(
                                '/procurador/reguacobranca'
                            )
                                ? 'font-bold text-indigo-700'
                                : 'text-gray-500'
                        }`}
                    >
                        <Ruler className="h-6 w-6" />
                        {open && (
                            <span className="font-medium">
                                Régua de Cobrança
                            </span>
                        )}
                        {open && (
                            <ChevronDown
                                className={`ml-auto transition-transform ${
                                    reguaCobrancaOpen ? 'rotate-180' : ''
                                }`}
                            />
                        )}
                    </button>

                    {reguaCobrancaOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/procurador/reguacobranca/protesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/reguacobranca/protesto'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <FileSearch className="h-5 w-5" />
                                Protesto
                            </Link>

                            <Link
                                to="/procurador/reguacobranca/ajuizamento"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/reguacobranca/ajuizamento'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <Gavel className="h-5 w-5" />
                                Para Ajuizamento
                            </Link>

                            <Link
                                to="/procurador/reguacobranca/ajuizadas"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/reguacobranca/ajuizadas'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <Scale className="h-5 w-5" />
                                Ajuizadas
                            </Link>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setPessoasOpen(!pessoasOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${
                            location.pathname.startsWith('/procurador/pessoas')
                                ? 'font-bold text-indigo-700'
                                : 'text-gray-500'
                        }`}
                    >
                        <UserRound className="h-6 w-6" />
                        {open && <span className="font-medium">Pessoas</span>}
                        {open && (
                            <ChevronDown
                                className={`ml-auto transition-transform ${
                                    pessoasOpen ? 'rotate-180' : ''
                                }`}
                            />
                        )}
                    </button>

                    {pessoasOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/procurador/pessoas/cnpj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/pessoas/cnpj'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <PcCase className="h-5 w-5" />
                                Pessoa Jurídica
                            </Link>
                            <Link
                                to="/procurador/pessoas/cpf"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/pessoas/cpf'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <UserRoundSearch className="h-5 w-5" />
                                Pessoa Física
                            </Link>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setDashboardOpen(!dashboardOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${
                            location.pathname.startsWith(
                                '/procurador/dashboard'
                            )
                                ? 'font-bold text-indigo-700'
                                : 'text-gray-500'
                        }`}
                    >
                        <ChartNoAxesCombined className="h-6 w-6" />
                        {open && <span className="font-medium">Dashboard</span>}
                        {open && (
                            <ChevronDown
                                className={`ml-auto transition-transform ${
                                    dashboardOpen ? 'rotate-180' : ''
                                }`}
                            />
                        )}
                    </button>

                    {dashboardOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/procurador/dashboard/acompanhamentoprotesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/dashboard/acompanhamentoprotesto'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <ChartPie className="h-5 w-5" />
                                Protesto
                            </Link>

                            <Link
                                to="/procurador/dashboard/acompanhamentopda"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/dashboard/acompanhamentopda'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <ChartScatter className="h-5 w-5" />
                                Gestão PDA
                            </Link>

                            <Link
                                to="/procurador/dashboard/acompanhamentocda"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                    location.pathname ===
                                    '/procurador/dashboard/acompanhamentocda'
                                        ? 'font-bold text-indigo-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                <ChartArea className="h-5 w-5" />
                                CDAs
                            </Link>
                        </div>
                    )}

                    <Link
                        to="/procurador/consultadebitos"
                        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                            location.pathname === '/procurador/consultadebitos'
                                ? 'font-bold text-indigo-700'
                                : 'text-gray-500'
                        }`}
                    >
                        <HandCoins className="h-6 w-6" />
                        {open && (
                            <span className="font-medium">
                                Consulta de Débitos
                            </span>
                        )}
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() =>
                                setRegimeEspecialOpen(!RegimeEspecialOpen)
                            }
                            className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${
                                location.pathname.startsWith('/procurador/rec')
                                    ? 'font-bold text-indigo-700'
                                    : 'text-gray-500'
                            }`}
                        >
                            <Brain className="h-6 w-6" />
                            {open && (
                                <span className="font-medium">
                                    Regime Especial
                                </span>
                            )}
                            {open && (
                                <ChevronDown
                                    className={`ml-auto transition-transform ${
                                        RegimeEspecialOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            )}
                        </button>

                        {RegimeEspecialOpen && open && (
                            <div className="ml-6 space-y-1">
                                <Link
                                    to="/procurador/rec/acompanhamentoespecial"
                                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${
                                        location.pathname ===
                                        '/procurador/rec/acompanhamentoespecial'
                                            ? 'font-bold text-indigo-700'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <ScanEye className="h-5 w-5" />
                                    Execução Fiscal
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </aside>
    );
}

import { FileSearch, House, DatabaseBackup, ChevronFirst, ChevronDown, Ruler, Gavel, Scale, ChartNoAxesCombined, CircleDollarSign, PcCase, UserRoundSearch, ChartPie, ChartScatter, ChartArea, HandCoins, Brain, ScanEye } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function SidebarChefia() {
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [reguaCobrancaOpen, setReguaCobrancaOpen] = useState(false);
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const [indicioPatrimonialOpen, setIndicioPatrimonialOpen] = useState(false);
    const [RegimeEspecialOpen, setRegimeEspecialOpen] = useState(false);

    return (
        <aside className={`bg-gray-200 p-3 mt-16 relative transition-all duration-300 ${open ? 'w-[17.5rem]' : 'w-20'}h-screen fixed top-0 left-0 z-40`}>
            <ChevronFirst
                className={`absolute cursor-pointer -right-3 top-4 rounded-full w-7 border-3 text-gray-700 hover:text-gray-500 transition-transform ${open ? '' : 'rotate-180'}`}
                onClick={() => setOpen(!open)}
            />
            <nav className="space-y-2 mt-4 flex flex-col">
                <Link
                    to="/homechefia"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/homechefia" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <House className="h-6 w-6" />
                    {open && <span className='font-medium'>Home</span>}
                </Link>



                <div className="relative">
                    <button
                        onClick={() => setReguaCobrancaOpen(!reguaCobrancaOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/chefia/reguacobranca") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <Ruler className="h-6 w-6" />
                        {open && <span className='font-medium'>Régua de Cobrança</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${reguaCobrancaOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {reguaCobrancaOpen && open && (
                        <div className="ml-6 space-y-1">


                            <Link
                                to="/chefia/reguacobranca/protesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/reguacobranca/protesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <FileSearch className="h-5 w-5" />
                                Protesto
                            </Link>

                            <Link
                                to="/chefia/reguacobranca/ajuizamento"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/reguacobranca/ajuizamento" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Gavel className="h-5 w-5" />
                                Para Ajuizamento
                            </Link>

                            <Link
                                to="/chefia/reguacobranca/ajuizadas"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/reguacobranca/ajuizadas" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Scale className="h-5 w-5" />
                                Ajuizadas
                            </Link>

                            {/*<Link
                                to="/chefia/reguacobranca/cartacobranca"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/reguacobranca/cartacobranca" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Mails className="h-5 w-5" />
                                Carta Cobrança
                            </Link> */}



                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIndicioPatrimonialOpen(!indicioPatrimonialOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/chefia/indiciopatrimonial") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <CircleDollarSign className="h-6 w-6" />
                        {open && <span className='font-medium'>Indício Patrimonial</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${indicioPatrimonialOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {indicioPatrimonialOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/chefia/indiciopatrimonial/cnpj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/indiciopatrimonial/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <PcCase className="h-5 w-5" />
                                Pessoa Jurídica (CNPJ)
                            </Link>
                            <Link
                                to="/chefia/indiciopatrimonial/cpf"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/indiciopatrimonial/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <UserRoundSearch className="h-5 w-5" />
                                Pessoa Física (CPF)
                            </Link>


                        </div>


                    )}
                </div>



                <div className="relative">
                    <button
                        onClick={() => setDashboardOpen(!dashboardOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/chefia/dashboard") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <ChartNoAxesCombined className="h-6 w-6" />
                        {open && <span className='font-medium'>Dashboard</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${dashboardOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {dashboardOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/chefia/dashboard/acompanhamentoprotesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/dashboard/acompanhamentoprotesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartPie className="h-5 w-5" />
                                Acompanhamento Protesto
                            </Link>

                            <Link
                                to="/chefia/dashboard/acompanhamentopda"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/dashboard/acompanhamentopda" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartScatter className="h-5 w-5" />
                                Acompanhamento PDA
                            </Link>

                            <Link
                                to="/chefia/dashboard/acompanhamentocda"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/dashboard/acompanhamentocda" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartArea className="h-5 w-5" />
                                Acompanhamento CDAs
                            </Link>

                            <Link
                                to="/chefia/dashboard/pagamentossiat"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/dashboard/pagamentossiat" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartArea className="h-5 w-5" />
                                Pagamentos SIAT
                            </Link>



                        </div>


                    )}

                   
                    <Link
                        to="/chefia/consultadebitos"
                        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/consultadebitos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <HandCoins className="h-6 w-6" />
                        {open && <span className='font-medium'>Consulta de Débitos</span>}
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setRegimeEspecialOpen(!RegimeEspecialOpen)}
                            className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/chefia/rec") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                        >
                            <Brain className="h-6 w-6" />
                            {open && <span className='font-medium'>Regime Especial</span>}
                            {open && <ChevronDown className={`ml-auto transition-transform ${RegimeEspecialOpen ? "rotate-180" : ""}`} />}
                        </button>


                        {RegimeEspecialOpen && open && (
                            <div className="ml-6 space-y-1">
                                <Link
                                    to="/chefia/rec/acompanhamentoespecial"
                                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/rec/acompanhamentoespecial" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                                >
                                    <ScanEye className="h-5 w-5" />
                                    Acompanhamento EF
                                </Link>


                            </div>


                        )}
                    </div>


                    <Link
                        to="/chefia/statusdatabase"
                        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/chefia/statusdatabase" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <DatabaseBackup className="h-6 w-6" />
                        {open && <span className='font-medium'>Status Database</span>}
                    </Link>


                </div>

            </nav>
        </aside>
    );
}

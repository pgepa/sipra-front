import {
    FileSearch, House, ChevronFirst, History, CloudUpload, ChevronDown,
    DatabaseBackup, Ruler, Gavel, Users, Scale, ChartArea, ChartScatter,
    ChartNoAxesCombined, PcCase, UserRoundSearch, ChartPie, Handshake,
    HandCoins, ScanEye, Brain, UserRound, X
} from 'lucide-react';
import { useState as useStateSidebar } from 'react';
import { Link, useLocation as useLocationSidebar } from 'react-router-dom'; 


export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const location = useLocationSidebar();
    const [uploadOpen, setUploadOpen] = useStateSidebar(false);
    const [reguaCobrancaOpen, setReguaCobrancaOpen] = useStateSidebar(false);
    const [dashboardOpen, setDashboardOpen] = useStateSidebar(false);
    const [regimeEspecialOpen, setRegimeEspecialOpen] = useStateSidebar(false);
    const [pessoasOpen, setPessoasOpen] = useStateSidebar(false);

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                ></div>
            )}

            <aside className={`thin-scrollbar fixed top-0 lg:top-16 left-0 h-full bg-gray-200 z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
                ${isOpen ? 'w-72' : 'md:w-20'}
            `}>
                <div className="p-3 h-full flex flex-col">
                    <button
                        className={`absolute hidden md:block cursor-pointer -right-6 top-2 rounded-full w-7 border-3 text-gray-700 hover:text-gray-500 transition-transform ${isOpen ? '' : 'rotate-180'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <ChevronFirst />
                    </button>

                    <button
                        className="md:hidden text-gray-700 self-end mb-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <nav className="space-y-2 mt-4 flex-grow overflow-y-auto">
                        {/* Código completo da navegação fornecido pelo utilizador */}
                        <Link to="/home" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/home" ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                            <House className="h-6 w-6" />
                            {isOpen && <span className='font-medium'>Home</span>}
                        </Link>

                        {/* Régua de Cobrança */}
                        <div className="relative">
                            <button onClick={() => setReguaCobrancaOpen(!reguaCobrancaOpen)} className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/reguacobranca") ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                                <Ruler className="h-6 w-6" />
                                {isOpen && <span className='font-medium'>Régua de Cobrança</span>}
                                {isOpen && <ChevronDown className={`ml-auto transition-transform ${reguaCobrancaOpen ? "rotate-180" : ""}`} />}
                            </button>
                            {reguaCobrancaOpen && isOpen && (
                                <div className="ml-6 space-y-1">
                                    <Link to="/reguacobranca/protesto" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/reguacobranca/protesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}><FileSearch className="h-5 w-5" /> Protesto</Link>
                                    <Link to="/reguacobranca/ajuizamento" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/reguacobranca/ajuizamento" ? "font-bold text-indigo-700" : "text-gray-500"}`}><Gavel className="h-5 w-5" /> Para Ajuizamento</Link>
                                    <Link to="/reguacobranca/ajuizadas" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/reguacobranca/ajuizadas" ? "font-bold text-indigo-700" : "text-gray-500"}`}><Scale className="h-5 w-5" /> Ajuizadas</Link>
                                </div>
                            )}
                        </div>

                        {/* Pessoas */}
                        <div className="relative">
                            <button onClick={() => setPessoasOpen(!pessoasOpen)} className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/pessoas") ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                                <UserRound className="h-6 w-6" />
                                {isOpen && <span className='font-medium'>Pessoas</span>}
                                {isOpen && <ChevronDown className={`ml-auto transition-transform ${pessoasOpen ? "rotate-180" : ""}`} />}
                            </button>
                            {pessoasOpen && isOpen && (
                                <div className="ml-6 space-y-1">
                                    <Link to="/pessoas/cnpj" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/pessoas/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}><PcCase className="h-5 w-5" /> Pessoa Jurídica</Link>
                                    <Link to="/pessoas/cpf" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/pessoas/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}><UserRoundSearch className="h-5 w-5" /> Pessoa Física</Link>
                                </div>
                            )}
                        </div>

                        {/* Dashboard */}
                        <div className="relative">
                            <button onClick={() => setDashboardOpen(!dashboardOpen)} className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/dashboard") ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                                <ChartNoAxesCombined className="h-6 w-6" />
                                {isOpen && <span className='font-medium'>Dashboard</span>}
                                {isOpen && <ChevronDown className={`ml-auto transition-transform ${dashboardOpen ? "rotate-180" : ""}`} />}
                            </button>
                            {dashboardOpen && isOpen && (
                                <div className="ml-6 space-y-1">
                                    <Link to="/dashboard/acompanhamentoprotesto" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/acompanhamentoprotesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}><ChartPie className="h-5 w-5" /> Protesto</Link>
                                    <Link to="/dashboard/acompanhamentopda" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/acompanhamentopda" ? "font-bold text-indigo-700" : "text-gray-500"}`}><ChartScatter className="h-5 w-5" /> Gestão PDA</Link>
                                    <Link to="/dashboard/acompanhamentocda" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/acompanhamentocda" ? "font-bold text-indigo-700" : "text-gray-500"}`}><ChartArea className="h-5 w-5" /> CDAs</Link>
                                    <Link to="/dashboard/pagamentossiat" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/pagamentossiat" ? "font-bold text-indigo-700" : "text-gray-500"}`}><Handshake className="h-5 w-5" /> Pagamentos</Link>
                                </div>
                            )}
                        </div>

                        {/* Regime Especial */}
                        <div className="relative">
                            <button onClick={() => setRegimeEspecialOpen(!regimeEspecialOpen)} className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/rec") ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                                <Brain className="h-6 w-6" />
                                {isOpen && <span className='font-medium'>Regime Especial</span>}
                                {isOpen && <ChevronDown className={`ml-auto transition-transform ${regimeEspecialOpen ? "rotate-180" : ""}`} />}
                            </button>
                            {regimeEspecialOpen && isOpen && (
                                <div className="ml-6 space-y-1">
                                    <Link to="/rec/acompanhamentoespecial" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/rec/acompanhamentoespecial" ? "font-bold text-indigo-700" : "text-gray-500"}`}><ScanEye className="h-5 w-5" /> Execução Fiscal</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/consultadebitos" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/consultadebitos" ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                            <HandCoins className="h-6 w-6" />
                            {isOpen && <span className='font-medium'>Consulta de Débitos</span>}
                        </Link>

                        {/* Upload Database */}
                        <div className="relative">
                            <button onClick={() => setUploadOpen(!uploadOpen)} className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/upload") ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                                <CloudUpload className="h-6 w-6" />
                                {isOpen && <span className='font-medium'>Upload Database</span>}
                                {isOpen && <ChevronDown className={`ml-auto transition-transform ${uploadOpen ? "rotate-180" : ""}`} />}
                            </button>
                            {uploadOpen && isOpen && (
                                <div className="ml-6 space-y-1">
                                    <Link to="/upload/ultimaatualizacao" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/ultimaatualizacao" ? "font-bold text-indigo-700" : "text-gray-500"}`}><History className="h-4 w-4" /> Status Database</Link>
                                    <Link to="/upload/semas" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/semas" ? "font-bold text-indigo-700" : "text-gray-500"}`}><DatabaseBackup className="h-4 w-4" /> Semas</Link>
                                    <Link
                                to="/upload/sefa"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/sefa" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Sefa
                            </Link>
                            <Link
                                to="/upload/adepara"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/adepara" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Adepara
                            </Link>
                            <Link
                                to="/upload/jucepapj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/jucepapj" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Jucepa PJ
                            </Link>

                            <Link
                                to="/upload/jucepavinculo"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/jucepavinculo" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Jucepa Vínculo
                            </Link>
                            <Link
                                to="/upload/detranrenach"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/detranrenach" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Detran - Renach
                            </Link>
                            <Link
                                to="/upload/detransidet"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/detransidet" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Detran - Sidet
                            </Link>
                            <Link
                                to="/upload/detranveiculo"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/detranveiculo" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Detran - Veículo
                            </Link>
                            <Link
                                to="/upload/detranmodelo"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/detranmodelo" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Detran - Modelo
                            </Link>
                            <Link
                                to="/upload/cenprot"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/cenprot" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Cenprot
                            </Link>
                                </div>
                            )}
                        </div>

                        <Link to="/usuarios" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/usuarios" ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                            <Users className="h-6 w-6" />
                            {isOpen && <span className='font-medium'>Usuários</span>}
                        </Link>
                    </nav>
                </div>
            </aside>
        </>
    );
}

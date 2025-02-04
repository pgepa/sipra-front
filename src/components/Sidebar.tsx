import { 
    FileSearch, 
    House, 
    ChevronFirst, 
    History, 
    CloudUpload, 
    ChevronDown, 
    DatabaseBackup, 
    Ruler, 
    Gavel, 
    Users, 
    Scale,
    ChartArea, 
    ChartScatter, 
    ChartNoAxesCombined, 
    CircleDollarSign, 
    PcCase, 
    UserRoundSearch, 
    ChartPie, 
    Handshake, 
    HandCoins,
    ScanEye,
    Brain, 
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const location = useLocation();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [reguaCobrancaOpen, setReguaCobrancaOpen] = useState(false);
    const [dashboardOpen, setDashboardOpen] = useState(false);    
    const [RegimeEspecialOpen, setRegimeEspecialOpen] = useState(false);
        
        
        
    const [indicioPatrimonialOpen, setIndicioPatrimonialOpen] = useState(false);

    return (
        <aside className={`bg-gray-200 p-3 h-full relative transition-all duration-300 ${
            open ? 'w-[17.5rem]' : 'w-20'
        }`}>
            <ChevronFirst
                className={`absolute cursor-pointer right-2 top-4 rounded-full w-7 border-3 text-gray-700 hover:text-gray-500 transition-transform ${open ? '' : 'rotate-180'}`}
                onClick={() => setOpen(!open)}
            />
            <nav className="space-y-2 mt-4 flex flex-col">
                <Link
                    to="/home"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/home" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <House className="h-6 w-6" />
                    {open && <span className='font-medium'>Home</span>}
                </Link>



                <div className="relative">
                    <button
                        onClick={() => setReguaCobrancaOpen(!reguaCobrancaOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/reguacobranca") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <Ruler className="h-6 w-6" />
                        {open && <span className='font-medium'>Régua de Cobrança</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${reguaCobrancaOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {reguaCobrancaOpen && open && (
                        <div className="ml-6 space-y-1">


                            <Link
                                to="/reguacobranca/protesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/reguacobranca/protesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <FileSearch className="h-5 w-5" />
                                Protesto
                            </Link>

                            <Link
                                to="/reguacobranca/ajuizamento"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/reguacobranca/ajuizamento" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Gavel className="h-5 w-5" />
                                Para Ajuizamento
                            </Link>

                            <Link
                                to="/reguacobranca/ajuizadas"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/reguacobranca/ajuizadas" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Scale className="h-5 w-5" />
                                Ajuizadas
                            </Link>

                                                        

                        </div>
                    )}
                </div>


                <div className="relative">
                    <button
                        onClick={() => setIndicioPatrimonialOpen(!indicioPatrimonialOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/indiciopatrimonial") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <CircleDollarSign className="h-6 w-6" />
                        {open && <span className='font-medium'>Indício Patrimonial</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${indicioPatrimonialOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {indicioPatrimonialOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/indiciopatrimonial/cnpj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/indiciopatrimonial/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <PcCase className="h-5 w-5" />
                                Pessoa Jurídica (CNPJ)
                            </Link>
                            <Link
                                to="/indiciopatrimonial/cpf"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/indiciopatrimonial/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}
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
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/dashboard") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <ChartNoAxesCombined className="h-6 w-6" />
                        {open && <span className='font-medium'>Dashboard</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${dashboardOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {dashboardOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/dashboard/acompanhamentoprotesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/acompanhamentoprotesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartPie  className="h-5 w-5" />
                                Protesto
                            </Link>
                            
                            <Link
                                to="/dashboard/acompanhamentopda"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/acompanhamentopda" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartScatter className="h-5 w-5" />
                                Gestão PDA
                            </Link>

                            <Link
                                to="/dashboard/acompanhamentocda"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/acompanhamentocda" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ChartArea  className="h-5 w-5" />
                                CDAs
                            </Link>
                            <Link
                                to="/dashboard/pagamentossiat"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/dashboard/pagamentossiat" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Handshake className="h-5 w-5" />
                                Pagamentos
                            </Link>


                        </div>


                    )}
                </div>
                
                 <div className="relative">
                    <button
                        onClick={() => setRegimeEspecialOpen(!RegimeEspecialOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/rec") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <Brain className="h-6 w-6" />
                        {open && <span className='font-medium'>Regime Especial</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${RegimeEspecialOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {RegimeEspecialOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/rec/acompanhamentoespecial"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/rec/acompanhamentoespecial" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <ScanEye className="h-5 w-5" />
                                Execução Fiscal
                            </Link>                    
                            

                            
                            


                        </div>


                    )}
                </div>
               

                <Link
                    to="/consultadebitos"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/consultadebitos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <HandCoins  className="h-6 w-6" />
                    {open && <span className='font-medium'>Consulta de Débitos</span>}
                </Link> 


                <div className="relative">
                    <button
                        onClick={() => setUploadOpen(!uploadOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/upload") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <CloudUpload className="h-6 w-6" />
                        {open && <span className='font-medium'>Upload Database</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${uploadOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {uploadOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/upload/ultimaatualizacao"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/ultimaatualizacao" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <History className="h-4 w-4" />
                                Status Database
                            </Link>
                            <Link
                                to="/upload/semas"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/semas" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Semas
                            </Link>

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



                <Link
                    to="/usuarios"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/usuarios" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <Users className="h-6 w-6" />
                    {open && <span className='font-medium'>Usuários</span>}
                </Link>

                

            </nav>
        </aside>
    );
}

import { FileSearch, House, ChevronFirst, ChevronDown, Ruler, Gavel, Scale, CircleDollarSign, PcCase, UserRoundSearch, HandCoins, ScanEye, Brain } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function SidebarAssessor() {
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [reguaCobrancaOpen, setReguaCobrancaOpen] = useState(false);
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
                    to="/homeassessor"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/homeassessor" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <House className="h-6 w-6" />
                    {open && <span className='font-medium'>Home</span>}
                </Link>



                <div className="relative">
                    <button
                        onClick={() => setReguaCobrancaOpen(!reguaCobrancaOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/assessor/reguacobranca") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <Ruler className="h-6 w-6" />
                        {open && <span className='font-medium'>Régua de Cobrança</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${reguaCobrancaOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {reguaCobrancaOpen && open && (
                        <div className="ml-6 space-y-1">


                            <Link
                                to="/assessor/reguacobranca/protesto"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/reguacobranca/protesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <FileSearch className="h-5 w-5" />
                                Protesto
                            </Link>

                            <Link
                                to="/assessor/reguacobranca/ajuizamento"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/reguacobranca/ajuizamento" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <Gavel className="h-5 w-5" />
                                Para Ajuizamento
                            </Link>

                            <Link
                                to="/assessor/reguacobranca/ajuizadas"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/reguacobranca/ajuizadas" ? "font-bold text-indigo-700" : "text-gray-500"}`}
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
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/assessor/indiciopatrimonial") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <CircleDollarSign className="h-6 w-6" />
                        {open && <span className='font-medium'>Indício Patrimonial</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${indicioPatrimonialOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {indicioPatrimonialOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/assessor/indiciopatrimonial/cnpj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/indiciopatrimonial/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <PcCase className="h-5 w-5" />
                                Pessoa Jurídica
                            </Link>
                            <Link
                                to="/assessor/indiciopatrimonial/cpf"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/indiciopatrimonial/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <UserRoundSearch className="h-5 w-5" />
                                Pessoa Física
                            </Link>


                        </div>


                    )}

                    <Link
                        to="/assessor/consultadebitos"
                        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/consultadebitos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <HandCoins className="h-6 w-6" />
                        {open && <span className='font-medium'>Consulta de Débitos</span>}
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setRegimeEspecialOpen(!RegimeEspecialOpen)}
                            className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/assessor/rec") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                        >
                            <Brain className="h-6 w-6" />
                            {open && <span className='font-medium'>Regime Especial</span>}
                            {open && <ChevronDown className={`ml-auto transition-transform ${RegimeEspecialOpen ? "rotate-180" : ""}`} />}
                        </button>


                        {RegimeEspecialOpen && open && (
                            <div className="ml-6 space-y-1">
                                <Link
                                    to="/assessor/rec/acompanhamentoespecial"
                                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/rec/acompanhamentoespecial" ? "font-bold text-indigo-700" : "text-gray-500"}`}
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

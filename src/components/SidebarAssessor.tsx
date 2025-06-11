import { House, ChevronFirst, ChevronDown, PcCase, UserRoundSearch, HandCoins, ScanEye, Brain, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function SidebarAssessor({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const location = useLocation();
    const [pessoasOpen, setPessoasOpen] = useState(false);
    const [RegimeEspecialOpen, setRegimeEspecialOpen] = useState(false);

    return (
        <aside className={`bg-gray-200 p-3 h-full relative transition-all duration-300 ${
            open ? 'w-[17.5rem]' : 'w-20'
        }`}>
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
                        onClick={() => setPessoasOpen(!pessoasOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/assessor/pessoas") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <UserRound className="h-6 w-6" />
                        {open && <span className='font-medium'>Pessoas</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${pessoasOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {pessoasOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/assessor/pessoas/cnpj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/pessoas/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <PcCase className="h-5 w-5" />
                                Pessoa Jurídica
                            </Link>
                            <Link
                                to="/assessor/pessoas/cpf"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/assessor/pessoas/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}
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

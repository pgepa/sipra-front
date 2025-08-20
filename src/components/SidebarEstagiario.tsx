import {
    House, ChevronFirst, ChevronDown, PcCase, UserRoundSearch,
    HandCoins, UserRound, X,
} from 'lucide-react';
import { useState as useStateSidebar } from 'react';
import { Link, useLocation as useLocationSidebar } from 'react-router-dom';


export function SidebarEstagiario({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const location = useLocationSidebar();    
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

                        {/* HOME*/}
                        <Link to="/homeestagiario" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/homeestagiario" ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                            <House className="h-6 w-6" />
                            {isOpen && <span className='font-medium'>Home</span>}
                        </Link>

                        {/* Pessoas */}
                        <div className="relative">
                            <button onClick={() => setPessoasOpen(!pessoasOpen)} className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/estagiario/pessoas") ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                                <UserRound className="h-6 w-6" />
                                {isOpen && <span className='font-medium'>Pessoas</span>}
                                {isOpen && <ChevronDown className={`ml-auto transition-transform ${pessoasOpen ? "rotate-180" : ""}`} />}
                            </button>
                            {pessoasOpen && isOpen && (
                                <div className="ml-6 space-y-1">
                                    <Link to="/estagiario/pessoas/cnpj" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/estagiario/pessoas/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}><PcCase className="h-5 w-5" /> Pessoa Jurídica</Link>
                                    <Link to="/estagiario/pessoas/cpf" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/estagiario/pessoas/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}><UserRoundSearch className="h-5 w-5" /> Pessoa Física</Link>
                                </div>
                            )}
                        </div>

                        {/* Consulta de Débitos */}

                        <Link to="/estagiario/consultadebitos" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/estagiario/consultadebitos" ? "font-bold text-indigo-700" : "text-gray-500"}`}>
                            <HandCoins className="h-6 w-6" />
                            {isOpen && <span className='font-medium'>Consulta de Débitos</span>}
                        </Link>

                    </nav>
                </div>
            </aside>
        </>
    );
}

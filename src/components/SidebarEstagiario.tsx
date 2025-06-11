import { House, ChevronFirst, ChevronDown, CircleDollarSign, PcCase, UserRoundSearch, HandCoins } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function SidebarEstagiario({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const location = useLocation();       
    const [pessoasOpen, setPessoasOpen] = useState(false);

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
                    to="/homeestagiario"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/homeestagiario" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <House className="h-6 w-6" />
                    {open && <span className='font-medium'>Home</span>}
                </Link>
                

                <div className="relative">
                    <button
                        onClick={() => setPessoasOpen(!pessoasOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/estagiario/pessoas") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <CircleDollarSign className="h-6 w-6" />
                        {open && <span className='font-medium'>Pessoas</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${pessoasOpen ? "rotate-180" : ""}`} />}
                    </button>


                    {pessoasOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/estagiario/pessoas/cnpj"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/estagiario/pessoas/cnpj" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <PcCase className="h-5 w-5" />
                                Pessoa Jurídica
                            </Link>
                            <Link
                                to="/estagiario/pessoas/cpf"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/estagiario/pessoas/cpf" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <UserRoundSearch className="h-5 w-5" />
                                Pessoa Física
                            </Link>
                        </div>


                    )}

                    <Link
                        to="/estagiario/consultadebitos"
                        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/estagiario/consultadebitos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <HandCoins className="h-6 w-6" />
                        {open && <span className='font-medium'>Consulta de Débitos</span>}
                    </Link>
                    
                </div>


            </nav>
        </aside>
    );
}

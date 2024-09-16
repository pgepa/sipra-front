import { FileSearch, House, ChevronFirst, Scale, Mails  } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
    const location = useLocation(); 
    const [open, setOpen] = useState(true); 

    return (
        <aside className={`bg-gray-200 p-3 relative transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}>
            <ChevronFirst 
                className={`absolute cursor-pointer -right-3 top-4 rounded-full w-7 border-3 text-gray-700 hover:text-gray-500 transition-transform ${open ? '' : 'rotate-180'}`}
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
                <Link
                    to="/protesto"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/protesto" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <FileSearch className="h-6 w-6" />
                    {open && <span className='font-medium'>Protesto</span>}
                </Link>
                <Link
                    to="/home"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "#" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <Mails className="h-6 w-6" />
                    {open && <span className='font-medium'>Carta Cobrança</span>}
                </Link>
                <Link
                    to="/home"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "#" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <Scale className="h-6 w-6" />
                    {open && <span className='font-medium'>Ajuizamento</span>}
                </Link>
            </nav>
        </aside>
    );
}

import { FileSearch, House, ChevronFirst, Scale, Mails, CloudUpload, ChevronDown, DatabaseBackup } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
    const location = useLocation(); 
    const [open, setOpen] = useState(true); 
    const [uploadOpen, setUploadOpen] = useState(false);

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
                    to="/cartacobranca"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/cartacobranca" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <Mails className="h-6 w-6" />
                    {open && <span className='font-medium'>Carta Cobrança</span>}
                </Link>
                
                <Link
                    to="/ajuizamento"
                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/ajuizamento" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                >
                    <Scale className="h-6 w-6" />
                    {open && <span className='font-medium'>Ajuizamento</span>}
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
                                to="/upload/semas"
                                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/semas" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                <DatabaseBackup className="h-4 w-4" />
                                Semas
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
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}

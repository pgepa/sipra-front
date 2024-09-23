import { FileSearch, House, ChevronFirst, Scale, Mails, CloudUpload, ChevronDown } from 'lucide-react';
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

                <div className="relative">
                    <button
                        onClick={() => setUploadOpen(!uploadOpen)}
                        className={`flex items-center gap-2 p-2 w-full text-left rounded hover:bg-gray-300 ${location.pathname.startsWith("/upload") ? "font-bold text-indigo-700" : "text-gray-500"}`}
                    >
                        <CloudUpload className="h-6 w-6" />
                        {open && <span className='font-medium'>Upload</span>}
                        {open && <ChevronDown className={`ml-auto transition-transform ${uploadOpen ? "rotate-180" : ""}`} />}
                    </button>

                
                    {uploadOpen && open && (
                        <div className="ml-6 space-y-1">
                            <Link
                                to="/upload/docs"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/docs" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Semas
                            </Link>
                            <Link
                                to="/upload/images"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/images" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Adepara
                            </Link>
                            <Link
                                to="/upload/videos"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/videos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Jucepa PJ
                            </Link>

                            <Link
                                to="/upload/videos"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/videos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Jucepa vínculo
                            </Link>
                            <Link
                                to="/upload/videos"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/videos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Detran - renach
                            </Link>
                            <Link
                                to="/upload/videos"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/videos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Detran - sidet
                            </Link>
                            <Link
                                to="/upload/videos"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/videos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Detran carga veículo
                            </Link>
                            <Link
                                to="/upload/videos"
                                className={`block p-2 rounded hover:bg-gray-300 ${location.pathname === "/upload/videos" ? "font-bold text-indigo-700" : "text-gray-500"}`}
                            >
                                Detran carga modelo
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}

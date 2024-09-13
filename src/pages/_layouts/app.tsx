import { Header } from "@/components/ui/header";
import { FileSearch, Handshake, UserRoundSearch  } from 'lucide-react';
import { Link, Outlet, useLocation } from "react-router-dom";

export function AppLayout() {
    const location = useLocation(); // Hook para obter a rota atual

    return (
        <div className="flex min-h-screen flex-col antialiased">
            <Header />

            <div className="flex flex-1">

                <aside className="w-64 bg-gray-200 p-4">
                    <nav className="space-y-2 flex flex-col">
                        <Link
                            to="/protesto"
                            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/protesto" ? "font-bold text-gray-800" : "text-gray-500"
                                }`}
                        >
                            <FileSearch className="h-6 w-6" />
                            Protesto
                        </Link>

                        <Link
                            to="/menu2"
                            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/menu2" ? "font-bold text-gray-800" : "text-gray-500"
                                }`}
                        >
                            <Handshake  className="h-6 w-6" />
                            Menu 2
                        </Link>

                        <Link
                            to="/menu3"
                            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-300 ${location.pathname === "/menu3" ? "font-bold text-gray-800" : "text-gray-500"
                                }`}
                        >
                            <UserRoundSearch  className="h-6 w-6" />
                            Menu 3
                        </Link>
                    </nav>
                </aside>

                {/* Conteúdo principal */}
                <main className="flex-1 flex flex-col p-8 pt-6 bg-gray-50">
                    {/* O conteúdo será colocado aqui */}
                    <div className="flex-1">
                        <Outlet />
                    </div>

                    {/* Footer sempre no final */}
                    <footer className="text-sm text-muted-foreground text-center mt-8">
                        Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos
                        os direitos reservados.
                    </footer>
                </main>
            </div>
        </div>
    );
}

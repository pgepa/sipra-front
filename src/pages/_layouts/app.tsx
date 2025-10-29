import { Sidebar } from '@/components/Sidebar';
import { Header } from "@/components/ui/header";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import './scrollbar.css'

export function AppLayout() {
    const { pathname } = useLocation();

    // Lista de páginas que devem ocupar a tela inteira, sem padding.
    const fullscreenPages = [
        "/dashboard/acompanhamentopda",
        "/dashboard/acompanhamentocda",
        "/dashboard/acompanhamentoprotesto",
        "/dashboard/pagamentossiat",
        "/chefia/dashboard/acompanhamentoprotesto",
        "/chefia/dashboard/acompanhamentopda",
        "/chefia/dashboard/acompanhamentocda",
        "/procurador/dashboard/acompanhamentoprotesto",
        "/procurador/dashboard/acompanhamentopda",
        "/procurador/dashboard/acompanhamentocda",
    ];
    const isFullscreenPage = fullscreenPages.includes(pathname);

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>

            <div className="flex min-h-screen flex-col antialiased bg-gray-100">
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                <div className="flex flex-1 pt-16">
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                    <main className={`thin-scrollbar flex-1 flex flex-col bg-gray-100 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 ease-in-out
                        ${isFullscreenPage ? "p-0" : "p-4 md:p-8"}
                        ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`
                    }>
                        <div className="flex-1">
                            <Outlet />
                        </div>

                        <footer className="w-full text-center p-4 text-sm text-muted-foreground">
                            Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos os direitos reservados.
                        </footer>
                    </main>
                </div>
            </div>
        </>
    );
}


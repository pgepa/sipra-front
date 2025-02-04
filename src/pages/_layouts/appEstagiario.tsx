import { SidebarEstagiario } from '@/components/SidebarEstagiario';
import { Header } from "@/components/ui/header";
import { useState } from 'react';

import { Outlet, useLocation } from "react-router-dom";

export function AppLayoutEstagiario() {

    const { pathname } = useLocation();

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


    return (
        <div className="flex min-h-screen flex-col antialiased">

            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16">

                <div className={`thin-scrollbar left-0 z-40 overflow-y-auto fixed h-full bg-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'
                    }`}>

                    <SidebarEstagiario open={isSidebarOpen} setOpen={setIsSidebarOpen} />

                </div>


                <main className={`thin-scrollbar flex-1 flex flex-col ${
                    isSidebarOpen ? 'ml-72' : 'ml-20'
                } ${
                    isFullscreenPage ? "p-0" : "p-8"
                } bg-gray-100 pt-4 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300`}
                >

                    <div className="flex-1">
                        <Outlet />
                    </div>


                    <footer className="w-full text-center p-4 text-sm text-muted-foreground">
                        Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos
                        os direitos reservados.
                    </footer>
                </main>
            </div>
        </div>
    );
}

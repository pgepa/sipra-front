import { SidebarChefia } from '@/components/SidebarChefia';
import { Header } from "@/components/ui/header";
import { Outlet, useLocation } from "react-router-dom";

export function AppLayoutChefia() {

    const { pathname } = useLocation();

    const fullscreenPages = [
        "/chefia/dashboard/acompanhamentoprotesto",
        "/chefia/dashboard/acompanhamentopda",
        "/chefia/dashboard/acompanhamentocda",      
        "/chefia/dashboard/pagamentossiat",      
    ];
    const isFullscreenPage = fullscreenPages.includes(pathname);


    return (
        <div className="flex min-h-screen flex-col antialiased">

            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            <div className="flex flex-1">

            <SidebarChefia />


                <main className={`flex-1 flex flex-col ${isFullscreenPage ? "p-0 pt-10" : "p-8 pt-20"
                    } bg-gray-100`}
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

import { SidebarChefia } from '@/components/SidebarChefia';
import { Header } from "@/components/ui/header";

import { Outlet } from "react-router-dom";

export function AppLayoutChefia() {


    return (
        <div className="flex min-h-screen flex-col antialiased">

            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            <div className="flex flex-1">

                <SidebarChefia />


                <main className="flex-1 flex flex-col p-8 pt-20 bg-gray-100">

                    <div className="flex-1">
                        <Outlet />
                    </div>


                    <footer className="text-sm text-muted-foreground text-center mt-8">
                        Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos
                        os direitos reservados.
                    </footer>
                </main>
            </div>
        </div>
    );
}

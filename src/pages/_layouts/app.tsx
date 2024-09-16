import { Sidebar } from '@/components/Sidebar';
import { Header } from "@/components/ui/header";

import { Outlet } from "react-router-dom";

export function AppLayout() {


    return (
        <div className="flex min-h-screen flex-col antialiased">
            <Header />

            <div className="flex flex-1">

                <Sidebar />


                
                <main className="flex-1 flex flex-col p-8 pt-6 bg-gray-100">
                    
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

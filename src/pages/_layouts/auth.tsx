import { Outlet } from "react-router-dom";
import PGE from "@/assets/NEWLOGOPGEPA.png";

export function AuthLayout() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover p-4"
      style={{ backgroundImage: `url(${PGE})` }}
    >
      

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40">
        <Outlet />
      </div>

      <footer className="absolute bottom-5 w-full text-center text-sm text-slate-400">
        Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos os
        direitos reservados.
      </footer>
    </div>
  );
}

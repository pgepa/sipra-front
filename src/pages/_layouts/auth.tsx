import { Outlet } from "react-router-dom";
import PGE from "@/assets/NEWLOGOPGEPA.png";

export function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${PGE})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 bg-transparent backdrop-blur-md p-2 rounded-lg shadow-2xl border border-white/30">
        <Outlet />
      </div>

      <footer className="absolute bottom-0 w-full text-center p-4 text-sm text-gray-300 z-10">
        Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos os
        direitos reservados.
      </footer>
    </div>
  );
}

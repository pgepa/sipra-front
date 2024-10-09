import { Outlet } from "react-router-dom";
import PGE from "@/assets/PGEPARA.jpg";

export function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${PGE})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 bg-white bg-opacity-90 p-2 rounded-lg shadow-lg">
        <Outlet />
      </div>

      <footer className="absolute bottom-0 w-full text-center p-4 text-sm text-gray-100 z-10">
        Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos os
        direitos reservados.
      </footer>
    </div>
  );
}

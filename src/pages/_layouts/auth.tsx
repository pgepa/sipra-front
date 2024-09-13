import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2 antialiased">
      <div className="h-full items-center border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between bg-img-purple bg-cover bg-no-repeat">

        <div className='flex flex-col items-center'>
            
            
        </div>
        

        <footer className="text-sm text-muted text-gray-100 text-center mt-8">
          Copyright &copy; PGE-PA {new Date().getFullYear()} | DTIGD - Todos os direitos reservados. 
        </footer>
      
      </div>

      <div className="flex flex-col items-center justify-center relative">
        <Outlet />
      </div>
    </div>
  )
}
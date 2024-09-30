import { Helmet } from 'react-helmet-async';

import { UserCard } from '@/pages/app/UsuarioCard';
import { SignUp } from '@/pages/auth/Sign-up';
  

export const Usuarios = () => (
  <>
    <Helmet title="Atos Normativos" />
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-slate-700">Administração de Usuários</h1>
        
        <SignUp/>
        
      </div>
      
      <UserCard />

    

    </div>
  </>
);

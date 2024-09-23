import { createHashRouter } from "react-router-dom";
import { SignIn } from '@/pages/auth/Sign-in';
import { AuthLayout } from '@/pages/_layouts/auth';
import { AppLayout } from '@/pages/_layouts/app';
import { Home } from '@/pages/app/Home';
import { Protesto } from '@/pages/app/Protesto';
import { UploadSemas } from '@/pages/app/UploadSemas';
import { UploadAdepara } from '@/pages/app/UploadAdepara';
import { UploadJucepaPj } from '@/pages/app/UploadJucepaPj';
import { UploadJucepaVínculo } from '@/pages/app/UploadJucepaVinculo';
import { UploadDetranRenach } from '@/pages/app/UploadDetranRenach';
import { UploadDetranSidet } from '@/pages/app/UploadDetranSidet';
import { UploadDetranCargaVeiculo } from '@/pages/app/UploadDetranVeiculo';
import { UploadDetranModelo } from '@/pages/app/UploadDetranModelo';
import { CartaCobranca } from '@/pages/app/CartaCobranca';
import { Ajuizamento } from '@/pages/app/Ajuizamento';


export const Router = createHashRouter([
  
    {
        path: '/',
        element: <AuthLayout/>,
        children: [
            { path: '/', element: <SignIn /> },
        ],
    },

    {
        path: '/',
        element: <AppLayout/>,
        children: [
            { path: '/home', element: <Home /> },
            { path: '/protesto', element: <Protesto /> },
            { path: '/cartacobranca', element: <CartaCobranca /> },
            { path: '/ajuizamento', element: <Ajuizamento /> },
            { path: '/upload/semas', element: <UploadSemas /> },
            { path: '/upload/adepara', element: <UploadAdepara /> },
            { path: '/upload/jucepapj', element: <UploadJucepaPj /> },
            { path: '/upload/jucepavinculo', element: <UploadJucepaVínculo /> },
            { path: '/upload/detranrenach', element: <UploadDetranRenach /> },
            { path: '/upload/detransidet', element: <UploadDetranSidet /> },
            { path: '/upload/detranveiculo', element: <UploadDetranCargaVeiculo /> },
            { path: '/upload/detranmodelo', element: <UploadDetranModelo /> },
        ],
    }





      //{ path: '/', element: <Home /> },
      //{ path: '/sign-in', element: <SignIn /> },
    
]);

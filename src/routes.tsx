import { createHashRouter } from "react-router-dom";
import { SignIn } from '@/pages/auth/Sign-in';
import { AuthLayout } from '@/pages/_layouts/auth';
import { AppLayout } from '@/pages/_layouts/app';
import { Home } from '@/pages/app/Home';
import { Protesto } from '@/pages/app/Protesto';
import { UploadSemas } from '@/pages/app/UploadSemas';
import { UploadAdepara } from '@/pages/app/UploadAdepara';
import { UploadJucepaPj } from '@/pages/app/UploadJucepaPj';
import { UploadJucepaVinculo } from '@/pages/app/UploadJucepaVinculo';
import { UploadDetranRenach } from '@/pages/app/UploadDetranRenach';
import { UploadDetranSidet } from '@/pages/app/UploadDetranSidet';
import { UploadDetranCargaVeiculo } from '@/pages/app/UploadDetranVeiculo';
import { UploadDetranModelo } from '@/pages/app/UploadDetranModelo';
import { CartaCobranca } from '@/pages/app/CartaCobranca';
import { Ajuizamento } from '@/pages/app/Ajuizamento';
import PrivateRoute from '@/utils/PrivateRoute';
import { Usuarios } from '@/pages/app/Usuarios';
import { NotFound } from '@/404';
import { AppLayoutChefia } from '@/pages/_layouts/appChefia';
import { HomeChefia } from '@/pages/app/HomeChefia';
import { Ajuizadas } from '@/pages/app/Ajuizadas';
import { Dashboard } from '@/pages/app/Dashborad';
import { IndicioPatrimonial } from '@/pages/app/IndicioPatrimonial';



export const Router = createHashRouter([

    {
        path: '/',
        element: <AuthLayout />,
        errorElement: <NotFound/>,
        children: [
            { path: '/', element: <SignIn /> },
        ],
    },

    // Rotas do App (protegidas por autenticação)
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <NotFound/>,
        children: [
            { path: '/home', element: <PrivateRoute allowedProfiles={['Administrador']}><Home /></PrivateRoute> },
            { path: '/reguacobranca/protesto', element: <PrivateRoute allowedProfiles={['Administrador']}><Protesto /></PrivateRoute> },
            { path: '/reguacobranca/cartacobranca', element: <PrivateRoute allowedProfiles={['Administrador']}><CartaCobranca /></PrivateRoute> },
            { path: '/reguacobranca/ajuizamento', element: <PrivateRoute allowedProfiles={['Administrador']}><Ajuizamento /></PrivateRoute> },
            { path: '/reguacobranca/ajuizadas', element: <PrivateRoute allowedProfiles={['Administrador']}><Ajuizadas /></PrivateRoute> },
            { path: '/upload/semas', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadSemas /></PrivateRoute> },
            { path: '/upload/adepara', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadAdepara /></PrivateRoute> },
            { path: '/upload/jucepapj', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadJucepaPj /></PrivateRoute> },
            { path: '/upload/jucepavinculo', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadJucepaVinculo /></PrivateRoute> },
            { path: '/upload/detranrenach', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranRenach /></PrivateRoute> },
            { path: '/upload/detransidet', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranSidet /></PrivateRoute> },
            { path: '/upload/detranveiculo', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranCargaVeiculo /></PrivateRoute> },
            { path: '/upload/detranmodelo', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranModelo /></PrivateRoute> },
            { path: '/usuarios', element: <PrivateRoute allowedProfiles={['Administrador']}><Usuarios /></PrivateRoute> },
            { path: '/dashboard', element: <PrivateRoute allowedProfiles={['Administrador']}><Dashboard /></PrivateRoute> },
            { path: '/indiciopatrimonial', element: <PrivateRoute allowedProfiles={['Administrador']}><IndicioPatrimonial /></PrivateRoute> },
            
        ],
    },

    {
        path: '/',
        element: <AppLayoutChefia />,
        errorElement: <NotFound/>,
        children: [
            { path: '/homechefia', element: <PrivateRoute allowedProfiles={['Chefia']}><HomeChefia /></PrivateRoute> },
            { path: 'chefia/reguacobranca/protesto', element: <PrivateRoute allowedProfiles={['Chefia']}><Protesto /></PrivateRoute> },
            { path: 'chefia/reguacobranca/cartacobranca', element: <PrivateRoute allowedProfiles={['Chefia']}><CartaCobranca /></PrivateRoute> },
            { path: 'chefia/reguacobranca/ajuizamento', element: <PrivateRoute allowedProfiles={['Chefia']}><Ajuizamento /></PrivateRoute> },
            { path: 'chefia/reguacobranca/ajuizadas', element: <PrivateRoute allowedProfiles={['Chefia']}><Ajuizadas /></PrivateRoute> },
            { path: 'chefia/dashboard', element: <PrivateRoute allowedProfiles={['Chefia']}><Dashboard /></PrivateRoute> },
            { path: 'chefia/indiciopatrimonial', element: <PrivateRoute allowedProfiles={['Chefia']}><IndicioPatrimonial /></PrivateRoute> },
            
            
        ],
    },

    
]);

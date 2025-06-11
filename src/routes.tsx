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
import { AcompanhamentoPda } from '@/pages/app/DashboradAcompanhamentoPda';
import { AcompanhamentoCda } from '@/pages/app/DashboardAcompanhamentoCda';
import { AcompanhamentoProtesto } from '@/pages/app/DashboardAcompanhamentoProtesto';
import { UltimaAtualizacaoDatabase } from '@/pages/app/UltimaAtualizacaoDatabase';
import { ConsultaPessoaJuridica } from '@/pages/app/ConsultaPessoaJuridica';
import { ConsultaPessoaFisica } from '@/pages/app/ConsultaPessoaFisica';
import { AppLayoutProcurador } from '@/pages/_layouts/appProcurador';
import { HomeProcurador } from '@/pages/app/HomeProcurador';
import { AppLayoutAssessor } from '@/pages/_layouts/appAssessor';
import { HomeAssessor } from '@/pages/app/HomeAssessor';
import { UploadSefa } from '@/pages/app/UploadSefa';
import { PagamentosSiat } from '@/pages/app/DashboardPagamentosSiat';
import { ConsultaDebitos } from '@/pages/app/ConsultaDebitos';
import { UploadCentrot } from '@/pages/app/UploadCenprot';
import { AcompanhamentoEspecial } from '@/pages/app/AcompanhamentoEspecial';
import { AppLayoutEstagiario } from '@/pages/_layouts/appEstagiario';



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
            { path: '/upload/ultimaatualizacao', element: <PrivateRoute allowedProfiles={['Administrador']}><UltimaAtualizacaoDatabase /></PrivateRoute> },
            { path: '/upload/semas', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadSemas /></PrivateRoute> },
            { path: '/upload/sefa', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadSefa /></PrivateRoute> },
            { path: '/upload/adepara', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadAdepara /></PrivateRoute> },
            { path: '/upload/jucepapj', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadJucepaPj /></PrivateRoute> },
            { path: '/upload/jucepavinculo', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadJucepaVinculo /></PrivateRoute> },
            { path: '/upload/detranrenach', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranRenach /></PrivateRoute> },
            { path: '/upload/detransidet', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranSidet /></PrivateRoute> },
            { path: '/upload/detranveiculo', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranCargaVeiculo /></PrivateRoute> },
            { path: '/upload/detranmodelo', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadDetranModelo /></PrivateRoute> },
            { path: '/upload/cenprot', element: <PrivateRoute allowedProfiles={['Administrador']}><UploadCentrot /></PrivateRoute> },
            { path: '/usuarios', element: <PrivateRoute allowedProfiles={['Administrador']}><Usuarios /></PrivateRoute> },
            { path: '/pessoas/cnpj', element: <PrivateRoute allowedProfiles={['Administrador']}><ConsultaPessoaJuridica /></PrivateRoute> },
            { path: '/pessoas/cpf', element: <PrivateRoute allowedProfiles={['Administrador']}><ConsultaPessoaFisica /></PrivateRoute> },
            { path: '/dashboard/acompanhamentopda', element: <PrivateRoute allowedProfiles={['Administrador']}><AcompanhamentoPda /></PrivateRoute> },
            { path: '/dashboard/acompanhamentocda', element: <PrivateRoute allowedProfiles={['Administrador']}><AcompanhamentoCda /></PrivateRoute> },
            { path: '/dashboard/acompanhamentoprotesto', element: <PrivateRoute allowedProfiles={['Administrador']}><AcompanhamentoProtesto /></PrivateRoute> },
            { path: '/dashboard/pagamentossiat', element: <PrivateRoute allowedProfiles={['Administrador']}><PagamentosSiat /></PrivateRoute> },
            { path: '/consultadebitos', element: <PrivateRoute allowedProfiles={['Administrador']}><ConsultaDebitos /></PrivateRoute> },
            { path: '/rec/acompanhamentoespecial', element: <PrivateRoute allowedProfiles={['Administrador']}><AcompanhamentoEspecial /></PrivateRoute> },
            
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
            { path: 'chefia/pessoas/cnpj', element: <PrivateRoute allowedProfiles={['Chefia']}><ConsultaPessoaJuridica /></PrivateRoute> },
            { path: 'chefia/pessoas/cpf', element: <PrivateRoute allowedProfiles={['Chefia']}><ConsultaPessoaFisica /></PrivateRoute> },
            { path: 'chefia/dashboard/acompanhamentopda', element: <PrivateRoute allowedProfiles={['Chefia']}><AcompanhamentoPda /></PrivateRoute> },
            { path: 'chefia/dashboard/acompanhamentocda', element: <PrivateRoute allowedProfiles={['Chefia']}><AcompanhamentoCda /></PrivateRoute> },
            { path: 'chefia/dashboard/acompanhamentoprotesto', element: <PrivateRoute allowedProfiles={['Chefia']}><AcompanhamentoProtesto /></PrivateRoute> },
            { path: 'chefia/dashboard/pagamentossiat', element: <PrivateRoute allowedProfiles={['Chefia']}><PagamentosSiat /></PrivateRoute> },
            { path: 'chefia/consultadebitos', element: <PrivateRoute allowedProfiles={['Chefia']}><ConsultaDebitos /></PrivateRoute> },
            { path: 'chefia/statusdatabase', element: <PrivateRoute allowedProfiles={['Chefia']}><UltimaAtualizacaoDatabase /></PrivateRoute> },
            { path: 'chefia/rec/acompanhamentoespecial', element: <PrivateRoute allowedProfiles={['Chefia']}><AcompanhamentoEspecial /></PrivateRoute> },
            
            
            
        ],
    },

    {
        path: '/',
        element: <AppLayoutProcurador />,
        errorElement: <NotFound/>,
        children: [
            { path: '/homeprocurador', element: <PrivateRoute allowedProfiles={['Procurador']}><HomeProcurador /></PrivateRoute> },
            { path: 'procurador/reguacobranca/protesto', element: <PrivateRoute allowedProfiles={['Procurador']}><Protesto /></PrivateRoute> },
            { path: 'procurador/reguacobranca/cartacobranca', element: <PrivateRoute allowedProfiles={['Procurador']}><CartaCobranca /></PrivateRoute> },
            { path: 'procurador/reguacobranca/ajuizamento', element: <PrivateRoute allowedProfiles={['Procurador']}><Ajuizamento /></PrivateRoute> },
            { path: 'procurador/reguacobranca/ajuizadas', element: <PrivateRoute allowedProfiles={['Procurador']}><Ajuizadas /></PrivateRoute> },
            { path: 'procurador/pessoas/cnpj', element: <PrivateRoute allowedProfiles={['Procurador']}><ConsultaPessoaJuridica /></PrivateRoute> },
            { path: 'procurador/pessoas/cpf', element: <PrivateRoute allowedProfiles={['Procurador']}><ConsultaPessoaFisica /></PrivateRoute> },
            { path: 'procurador/dashboard/acompanhamentopda', element: <PrivateRoute allowedProfiles={['Procurador']}><AcompanhamentoPda /></PrivateRoute> },
            { path: 'procurador/dashboard/acompanhamentocda', element: <PrivateRoute allowedProfiles={['Procurador']}><AcompanhamentoCda /></PrivateRoute> },
            { path: 'procurador/dashboard/acompanhamentoprotesto', element: <PrivateRoute allowedProfiles={['Procurador']}><AcompanhamentoProtesto /></PrivateRoute> },
            { path: 'procurador/consultadebitos', element: <PrivateRoute allowedProfiles={['Procurador']}><ConsultaDebitos /></PrivateRoute> },
            { path: 'procurador/rec/acompanhamentoespecial', element: <PrivateRoute allowedProfiles={['Procurador']}><AcompanhamentoEspecial /></PrivateRoute> },
            
            
            
        ],
    },

    {
        path: '/',
        element: <AppLayoutAssessor />,
        errorElement: <NotFound/>,
        children: [
            { path: '/homeassessor', element: <PrivateRoute allowedProfiles={['Assessor']}><HomeAssessor /></PrivateRoute> },
            { path: 'assessor/reguacobranca/protesto', element: <PrivateRoute allowedProfiles={['Assessor']}><Protesto /></PrivateRoute> },
            { path: 'assessor/reguacobranca/cartacobranca', element: <PrivateRoute allowedProfiles={['Assessor']}><CartaCobranca /></PrivateRoute> },
            { path: 'assessor/reguacobranca/ajuizamento', element: <PrivateRoute allowedProfiles={['Assessor']}><Ajuizamento /></PrivateRoute> },
            { path: 'assessor/reguacobranca/ajuizadas', element: <PrivateRoute allowedProfiles={['Assessor']}><Ajuizadas /></PrivateRoute> },
            { path: 'assessor/pessoas/cnpj', element: <PrivateRoute allowedProfiles={['Assessor']}><ConsultaPessoaJuridica /></PrivateRoute> },
            { path: 'assessor/pessoas/cpf', element: <PrivateRoute allowedProfiles={['Assessor']}><ConsultaPessoaFisica /></PrivateRoute> },        
            { path: 'assessor/consultadebitos', element: <PrivateRoute allowedProfiles={['Assessor']}><ConsultaDebitos /></PrivateRoute> },        
            { path: 'assessor/rec/acompanhamentoespecial', element: <PrivateRoute allowedProfiles={['Assessor']}><AcompanhamentoEspecial /></PrivateRoute> },        
            
            
        ],
    },

    {
        path: '/',
        element: <AppLayoutEstagiario />,
        errorElement: <NotFound/>,
        children: [
            { path: '/homeestagiario', element: <PrivateRoute allowedProfiles={['Estagiario']}><HomeAssessor /></PrivateRoute> },        
            { path: 'estagiario/pessoas/cnpj', element: <PrivateRoute allowedProfiles={['Estagiario']}><ConsultaPessoaJuridica /></PrivateRoute> },
            { path: 'estagiario/pessoas/cpf', element: <PrivateRoute allowedProfiles={['Estagiario']}><ConsultaPessoaFisica /></PrivateRoute> },        
            { path: 'estagiario/consultadebitos', element: <PrivateRoute allowedProfiles={['Estagiario']}><ConsultaDebitos /></PrivateRoute> },        
            { path: 'estagiario/recc/acompanhamentoespecial', element: <PrivateRoute allowedProfiles={['Estagiario']}><AcompanhamentoEspecial /></PrivateRoute> },        
            
            
        ],
    },



    
]);

import { createHashRouter } from "react-router-dom";
import { SignIn } from '@/pages/auth/Sign-in';
import { AuthLayout } from '@/pages/_layouts/auth';
import { AppLayout } from '@/pages/_layouts/app';
import { Home } from '@/pages/app/Home';
import { Protesto } from '@/pages/app/Protesto';
import { Upload } from '@/pages/app/Upload';


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
            { path: '/upload', element: <Upload /> },
        ],
    }





      //{ path: '/', element: <Home /> },
      //{ path: '/sign-in', element: <SignIn /> },
    
]);

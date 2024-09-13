import { createHashRouter } from "react-router-dom";
import { SignIn } from '@/pages/auth/Sign-in';
import { AuthLayout } from '@/pages/_layouts/auth';
import { AppLayout } from '@/pages/_layouts/app';
import { Home } from '@/pages/app/Home';


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
        ],
    }





      //{ path: '/', element: <Home /> },
      //{ path: '/sign-in', element: <SignIn /> },
    
]);

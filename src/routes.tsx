import { createHashRouter } from "react-router-dom";
import { SignIn } from '@/pages/auth/Sign-in';
import { AuthLayout } from '@/pages/_layouts/auth';


export const Router = createHashRouter([
  
    {
        path: '/',
        element: <AuthLayout/>,
        children: [
            { path: '/', element: <SignIn /> },
        ],
    }





      //{ path: '/', element: <Home /> },
      //{ path: '/sign-in', element: <SignIn /> },
    
]);

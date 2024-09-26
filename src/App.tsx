import { RouterProvider } from 'react-router-dom'
import { Router } from '@/routes'
import '../global.css'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

export function App() {
  

  return (

    <HelmetProvider>
      
        <Helmet titleTemplate="SiDA | %s" />
        <Toaster richColors />
        <RouterProvider router={ Router } />

    
    </HelmetProvider>   

      
    
  )
}

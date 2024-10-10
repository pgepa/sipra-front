import { Helmet } from 'react-helmet-async';
import logo from '@/assets/Logo SIDA.png';

export function HomeChefia() {
    return (
        <>
        <Helmet title="Home Chefia" />
        <div className="flex min-h-screen items-center justify-center">
        <img className="w-96" src={logo} alt="Logo" />
            
                          
        </div>
        </>
    )

}
import { Helmet } from 'react-helmet-async';
import logo from '@/assets/Logo SIDA.png';

export function Home() {
    return (
        <>
        <Helmet title="Home" />
        <div className="flex min-h-screen items-center justify-center">
        <img className="w-96" src={logo} alt="Logo SIDA" />
            
                          
        </div>
        </>
    )

}
import { Helmet } from 'react-helmet-async';
import logo from '@/assets/Logo SIDA.png';

export function Home() {
    return (
        <>
        <Helmet title="Home" />
        <div className="flex h-screen items-center -mt-12 justify-center bg-gray-100 overflow-hidden">
        <img className="w-96 h-auto object-contain"  src={logo} alt="Logo SIDA" />
            
                          
        </div>
        </>
    )

}
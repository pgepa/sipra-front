import { Helmet } from 'react-helmet-async';
import logo from '@/assets/Logo SIDA.png';

export function Home() {
    return (
        <>
        <Helmet title="Home" />
        <div className="flex flex-col gap-4 items-center p-4 sm:p-6 md:p-8">
        <img className="w-80" src={logo} alt="Logo" />
            
                          
        </div>
        </>
    )

}
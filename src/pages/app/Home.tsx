import { Helmet } from 'react-helmet-async';
import { SiAwssecretsmanager } from "react-icons/si";

export function Home() {
    return (
        <>
        <Helmet title="Home" />
        <div className="flex flex-col gap-4 items-center p-4 sm:p-6 md:p-8">
            
            <SiAwssecretsmanager className="w-24 h-24 text-indigo-800" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">SIPRA - Sistema de Investigação Patrimonial e Recuperação de Ativos</h1>
                <h2 className="text-lg sm:text-xl text-muted-foreground">Procuradoria da Dívida Ativa - PDA</h2>
        </div>
        </>
    )

}
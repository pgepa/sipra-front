import logo from '@/assets/logo.svg';
export function Home() {
    return (
        <div className="flex flex-col gap-4 items-center p-4 sm:p-6 md:p-8">
            <img className="w-24 h-24" src={logo} alt="Logo" />
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">SIPRA - Sistema de Investigação Patrimonial e Recuperação de Ativos</h1>
                <h2 className="text-lg sm:text-xl tracking-tight text-muted-foreground">Procuradoria da Dívida Ativa</h2>
        </div>
    )

}
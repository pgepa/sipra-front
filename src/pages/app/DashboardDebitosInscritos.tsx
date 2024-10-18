import { Helmet } from 'react-helmet-async';

export function DebitosInscritos() {
    return (
        <>
            <Helmet title="Débitos Inscritos" />
            <div className='h-screen flex flex-col'>
                <h1 className='text-2xl font-bold text-slate-700'>Dashboard Consulta de Débitos Inscritos</h1>
                <div className="mt-6 flex flex-1">
                    
                    <iframe 
                        className='rounded-md'
                        title="Consulta Devedor - CNPJ" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/reportEmbed?reportId=f6acc0ef-4355-4d8b-8177-55fd4abf3345&autoAuth=true&ctid=b0be0663-915e-473e-a556-a16ef9dfe414" 
                        allowFullScreen={true}
                        style={{ border: 'none' }}
                        
                        >
                    </iframe>


                </div>
            </div>
        </>
    );
}

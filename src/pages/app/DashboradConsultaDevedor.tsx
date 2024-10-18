import { Helmet } from 'react-helmet-async';

export function ConsultaDevedor() {
    return (
        <>
            <Helmet title="Consulta Devedor" />
            <div className='h-screen flex flex-col'>
                <h1 className='text-2xl font-bold text-slate-700'>Dashboard Consulta Devedor</h1>
                <div className="mt-6 flex flex-1">
                   
                    <iframe 
                        className='rounded-md'
                        title="Consulta Devedor - CNPJ" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/reportEmbed?reportId=f225dd7f-32ed-408c-a280-8c91d7654285&autoAuth=true&ctid=b0be0663-915e-473e-a556-a16ef9dfe414" 
                        allowFullScreen={true}
                        style={{ border: 'none' }}
                        
                        >
                    </iframe>


                </div>
            </div>
        </>
    );
}

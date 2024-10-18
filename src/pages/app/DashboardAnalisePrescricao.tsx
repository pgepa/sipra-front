import { Helmet } from 'react-helmet-async';

export function AnalisePrescricao() {
    return (
        <>
            <Helmet title="Análise de Prescrição" />
            <div className='h-screen flex flex-col'>
                <h1 className='text-2xl font-bold text-slate-700'>Dashboard Consulta para Análise de Prescrição</h1>
                <div className="mt-6 flex flex-1">

                    <iframe
                        className='rounded-md'
                        title="Consulta Devedor - CNPJ"
                        width="100%"
                        height="100%"
                        src="https://app.powerbi.com/reportEmbed?reportId=bfb0351a-5aeb-48e7-a2a7-88a8bd0395ad&autoAuth=true&ctid=b0be0663-915e-473e-a556-a16ef9dfe414"
                        allowFullScreen={true}
                        style={{ border: 'none' }}

                    >
                    </iframe>


                </div>
            </div>
        </>
    );
}

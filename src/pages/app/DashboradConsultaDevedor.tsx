import { Helmet } from 'react-helmet-async';

export function ConsultaDevedor() {
    return (
        <>
            <Helmet title="Consulta Devedor" />
            <div className='h-screen flex flex-col'>
                <h1 className='text-2xl font-bold text-slate-700'>Dashboard Consulta Devedor</h1>

                {/*<div className="mt-6 flex flex-1">
                   
                    <iframe 
                        className='rounded-md'
                        title="Consulta Devedor - CNPJ" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiYWE0M2EzNjAtOGUwMy00N2Q0LTlkOWYtMzc3OTJiNWE5ZmZhIiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9" 
                        allowFullScreen={true}
                        style={{ border: 'none' }}
                        
                        >
                    </iframe>


                </div> */}
                
            </div>
        </>
    );
}

import { Helmet } from 'react-helmet-async';

export function AcompanhamentoProtesto() {
    return (
        <>
            <Helmet title="Acompanhamento de Protesto" />
            <div className='h-screen flex flex-col'>
                <h1 className='text-2xl font-bold text-slate-700'>Dashboard Acompanhamento de Protesto</h1>

                 <div className="mt-6 flex flex-1">
                    
                    <iframe 
                        className='rounded-md'
                        title="Acompanhamento de Protesto" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiMzZkYmRhODUtNDQxNS00NWFmLTk3MzctMTMzNTk1NGI3ZGFkIiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9" 
                        allowFullScreen={true}
                        style={{ border: 'none' }}
                        
                        >
                    </iframe>


                </div>
                
            </div>
        </>
    );
}

import { Helmet } from 'react-helmet-async';

export function AcompanhamentoProtesto() {
    return (
        <>
            <Helmet title="Acompanhamento de Protesto" />
            <div className='h-screen flex flex-col -mt-4'>

                 <div className="flex flex-1">
                    
                    <iframe 
                        title="Acompanhamento de Protesto" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiMDJkYWQ3MWEtOTVkMi00NmYxLWIxY2QtMDczNWIxZDkxNDVmIiwidCI6IjA2YjQ3Y2UyLWZmN2UtNDRjOS05M2ExLTEwZDVhYTE4M2RlNCJ9"
                        style={{ border: 'none' }}
                        allowFullScreen={true}                        
                        >
                    </iframe>


                </div>
                
            </div>
        </>
    );
}

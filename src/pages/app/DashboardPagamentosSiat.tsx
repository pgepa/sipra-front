import { Helmet } from 'react-helmet-async';

export function PagamentosSiat() {
    return (
        <>
            <Helmet title="Pagamentos SIAT" />
            <div className='h-screen flex flex-col -mt-4'>

                 <div className="flex flex-1">
                    
                    <iframe 
                        title="SEFA Pagamentos SIAT" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiNDZmMDlhM2QtOWFiYy00MDcxLTg1NTMtYWNlZTNiNjkzNjNlIiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9"
                        style={{ border: 'none' }}
                        allowFullScreen={true}                        
                        >
                    </iframe>


                </div>
                
            </div>
        </>
    );
}

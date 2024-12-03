import { Helmet } from 'react-helmet-async';

export function PagamentosSiat() {
    return (
        <>
            <Helmet title="Pagamentos SIAT" />
            <div className='h-screen flex flex-col'>

                 <div className="mt-6 flex flex-1">
                    
                    <iframe 
                        title="SEFA Pagamentos SIAT" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiYWU4NWQ5MWQtOWZmNC00Y2VlLThlYjAtOTRkOWRlY2I5ODUyIiwidCI6IjA2YjQ3Y2UyLWZmN2UtNDRjOS05M2ExLTEwZDVhYTE4M2RlNCJ9"
                        style={{ border: 'none' }}
                        allowFullScreen={true}                        
                        >
                    </iframe>


                </div>
                
            </div>
        </>
    );
}

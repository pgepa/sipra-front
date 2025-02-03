import { Helmet } from 'react-helmet-async';

export function AcompanhamentoPda() {
    return (
        <>
            <Helmet title="Acompanhamento PDA" />
            <div className='h-screen flex flex-col -mt-4'>
                
                <div className="flex flex-1">
                   
                    <iframe 
                        title="Consulta Devedor - CNPJ" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiMWQ5NTE4NjMtZjkyNy00YWUzLTlhY2UtM2NkZDBmZjJhZWNjIiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9" 
                        allowFullScreen={true}
                        style={{ border: 'none' }}                        
                        >
                    </iframe>


                </div> 
                
            </div>
        </>
    );
}

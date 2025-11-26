import { Helmet } from 'react-helmet-async';

export function AcompanhamentoPda() {
    return (
        <>
            <Helmet title="Gestão de Devedores" />
            <div className='h-screen flex flex-col -mt-4'>
                
                <div className="flex flex-1">
                   
                    <iframe 
                        title="Gestão de Devedores" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiNmIxNGIzNWUtNjU5Yi00MGY3LWJjZGUtYjdhN2RkNmRiN2QzIiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9" 
                        allowFullScreen={true}
                        style={{ border: 'none' }}                        
                        >
                    </iframe>


                </div> 
                
            </div>
        </>
    );
}

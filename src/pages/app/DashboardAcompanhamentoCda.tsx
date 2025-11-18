import { Helmet } from 'react-helmet-async';

export function AcompanhamentoCda() {
    return (
        <>
            <Helmet title="Acompanhamento de CDAs" />
            <div className='h-screen flex flex-col -mt-4'>

                 <div className=" flex flex-1">
                    
                    <iframe 
                        title="Acompanhamento de CDAs" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiZjJiZmI3ZWItZTE2Ni00NTc0LThjNDMtMDQ0NWI0NDYyYTAwIiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9"
                        style={{ border: 'none' }}
                        allowFullScreen={true}                        
                        >
                    </iframe>


                </div>
                
            </div>
        </>
    );
}

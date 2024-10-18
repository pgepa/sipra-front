import { Helmet } from 'react-helmet-async';

export function DebitosInscritos() {
    return (
        <>
            <Helmet title="Débitos Inscritos" />
            <div>
                <h1 className='text-2xl text-slate-800'>Dashboard Consulta de Débitos Inscritos</h1>
                <div className="mt-6">
                    {/* <iframe 
                        title="Consulta Devedor - CNPJ" 
                        width="100%" 
                        height="800px" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiYmQ0YWZlMWEtZmVlMS00N2M5LTljZGYtZDVjMjUxYzEyOWQ2IiwidCI6ImIwYmUwNjYzLTkxNWUtNDczZS1hNTU2LWExNmVmOWRmZTQxNCJ9" 
                        allowFullScreen
                        style={{ border: 'none' }}  // Remove a borda padrão
                    >
                    </iframe> */}
                    
                </div>
            </div>
        </>
    );
}

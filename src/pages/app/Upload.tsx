import { Helmet } from 'react-helmet-async';

export function Upload() {
    return (
        <>
        <Helmet title="Upload" />
        <div>
            <h1 className='text-2xl text-slate-800'>Upload base de dados</h1>
        </div>
        </>
    )
}
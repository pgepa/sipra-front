import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Badge } from "@/components/ui/badge"
import { Helmet } from 'react-helmet-async';

interface UserData {
    tabela: string;
    ultima_atualizacao: string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Paddar dia com zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Paddar mês com zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formatar data como dd/mm/aaaa
};

export const UltimaAtualizacaoDatabase: React.FC = () => {
    const [data, setData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true); // Estado para carregamento
    const [error, setError] = useState<string | null>(null); // Estado para erro

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        api.get('/ultima_atualizacao', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log('Response data:', response.data);
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
                setError('Erro ao carregar dados');
                setLoading(false);
            });
    }, []);


    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }


    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (

        <>

            <Helmet title="Última Atualização" />


            <div className='flex flex-col gap-4'>

                <h1 className='text-2xl font-bold text-slate-700'>Última Atualização - Database</h1>

                <div className="w-full max-w-4xl mx-auto p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {data.map((dados, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200">
                                <div className="flex flex-col gap-2">

                                    <span className="text-lg font-semibold flex gap-2 text-gray-800">
                                        
                                        <Badge variant="default" className='text-base'>Tabela: {dados.tabela}</Badge>

                                    </span>
                                    <span className="text-muted-foreground">Última Atualização: {formatDate(dados.ultima_atualizacao)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </>

    );
};

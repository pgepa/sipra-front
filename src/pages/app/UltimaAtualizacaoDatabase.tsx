import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Badge } from "@/components/ui/badge";
import { Helmet } from 'react-helmet-async';
import { Bot, Cog, AlertTriangle } from 'lucide-react';
import { formatarData } from '@/lib/utils';

interface UserData {
    tabela: string;
    ultima_atualizacao: string;
}

const isOutdated = (tabela: string, ultimaAtualizacao: string): boolean => {
    const hoje = new Date();
    const ultimaData = new Date(ultimaAtualizacao);

    // Critérios de atualização
    const limiteMeses = 6;
    const limite30Dias = 30;
    const limite10Dias = 10;

    if (['jucepapj', 'jucepavinculo', 'adepara', 'cdsefa'].includes(tabela)) {
        // Verifica se ultrapassou 6 meses para essas tabelas
        const dataLimite = new Date(hoje);
        dataLimite.setMonth(dataLimite.getMonth() - limiteMeses);
        return ultimaData < dataLimite;
    } else if (['rfbempcpfs', 'rfbnaturezas', 'rfbqualificacoes', 'rfbestabelecimentos', 'rfbempresas'].includes(tabela)) {
        // Verifica se ultrapassou 30 dias para essas tabelas
        const dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - limite30Dias);
        return ultimaData < dataLimite;
    } else {
        // Verifica se ultrapassou 10 dias para as demais tabelas
        const dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - limite10Dias);
        return ultimaData < dataLimite;
    }
};

export const UltimaAtualizacaoDatabase: React.FC = () => {
    const [data, setData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true); // Estado para carregamento
    const [error, setError] = useState<string | null>(null); // Estado para erro

    const tabelasManuais = [
        'jucepapj',
        'jucepavinculo',
        'detrancargaveiculo',
        'detranmarcamodelo',
        'adepara'
    ];

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
            <Helmet title="Status Database" />
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-700 text-center">Status Database</h1>

                <div className="w-full max-w-4xl mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {data.map((dados, index) => {
                            const status = tabelasManuais.includes(dados.tabela) ? "manual" : "automática";
                            const outdated = isOutdated(dados.tabela, dados.ultima_atualizacao);

                            return (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-lg font-semibold flex gap-2 text-gray-800">
                                            <Badge variant="default" className="text-base">
                                                Tabela: {dados.tabela}
                                            </Badge>
                                        </span>
                                        <span className="text-muted-foreground">
                                            Última Atualização: {formatarData(dados.ultima_atualizacao)}
                                        </span>
                                    </div>

                                    {/* Exibição do Status alinhado à direita com alerta e ícone */}
                                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        {outdated && (
                                            <div className="flex items-center gap-1 text-orange-600">
                                                <AlertTriangle size={20} />
                                                
                                            </div>
                                        )}
                                        {status === "manual" ? (
                                            <>
                                                <Cog className="text-slate-600" size={20} />
                                                <span className="text-slate-600">Manual</span>
                                            </>
                                        ) : (
                                            <>
                                                <Bot className="text-violet-500" size={20} />
                                                <span className="text-violet-500">Automática</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

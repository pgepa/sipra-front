import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { Bot, Cog, AlertTriangle, Database } from 'lucide-react';
import { formatarData } from '@/lib/utils';
import GridLoader from 'react-spinners/GridLoader';
import { EmptyState } from '@/components/EmptyState';

interface DatabaseStatus {
    tabela: string;
    ultima_atualizacao: string;
}

const TABELAS_MANUAIS = [
    'jucepapj',
    'jucepavinculo',
    'detrancargaveiculo',
    'detranmarcamodelo',
    'adepara',
];

const LIMITES_ATUALIZACAO = {
    meses6: ['jucepapj', 'jucepavinculo', 'adepara', 'cdsefa'],
    dias30: ['rfbempcpfs', 'rfbnaturezas', 'rfbqualificacoes', 'rfbestabelecimentos', 'rfbempresas'],
    dias10: 'default',
};

const isOutdated = (tabela: string, ultimaAtualizacao: string): boolean => {
    const hoje = new Date();
    const ultimaData = new Date(ultimaAtualizacao);

    if (LIMITES_ATUALIZACAO.meses6.includes(tabela)) {
        const dataLimite = new Date(hoje);
        dataLimite.setMonth(dataLimite.getMonth() - 6);
        return ultimaData < dataLimite;
    } else if (LIMITES_ATUALIZACAO.dias30.includes(tabela)) {
        const dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - 30);
        return ultimaData < dataLimite;
    } else {
        const dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - 10);
        return ultimaData < dataLimite;
    }
};

export function UltimaAtualizacaoDatabase() {
    const [data, setData] = useState<DatabaseStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        api
            .get('/ultima_atualizacao', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
                setError('Erro ao carregar dados');
                setLoading(false);
            });
    }, []);

    const getStatusInfo = (tabela: string, ultimaAtualizacao: string) => {
        const isManual = TABELAS_MANUAIS.includes(tabela);
        const outdated = isOutdated(tabela, ultimaAtualizacao);

        return {
            isManual,
            outdated,
            statusColor: outdated ? 'border-orange-300' : 'border-gray-200',
            statusBg: outdated ? 'bg-orange-50 dark:bg-orange-950/20' : 'bg-white dark:bg-gray-900',
        };
    };

    const stats = {
        total: data.length,
        manuais: data.filter((d) => TABELAS_MANUAIS.includes(d.tabela)).length,
        automaticas: data.filter((d) => !TABELAS_MANUAIS.includes(d.tabela)).length,
        desatualizadas: data.filter((d) => isOutdated(d.tabela, d.ultima_atualizacao)).length,
    };

    return (
        <>
            <Helmet title="Status Database" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Database className="h-8 w-8 text-violet-600" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Status do Banco de Dados
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Acompanhe o status de atualização das tabelas do sistema
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <GridLoader size={16} color="#7c3aed" />
                    </div>
                )}

                {/* Error State */}
                {!loading && error && <EmptyState error={error} />}

                {/* Stats Cards */}
                {!loading && !error && data.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total de Tabelas</span>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Manuais</span>
                                        <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.manuais}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Automáticas</span>
                                        <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.automaticas}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Desatualizadas</span>
                                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.desatualizadas}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tables Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {data.map((dados, index) => {
                                const { isManual, outdated, statusColor, statusBg } = getStatusInfo(
                                    dados.tabela,
                                    dados.ultima_atualizacao
                                );

                                return (
                                    <Card
                                        key={index}
                                        className={`${statusBg} border-2 ${statusColor} hover:shadow-lg transition-all duration-200`}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex flex-col gap-3">
                                                {/* Table Name */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <Badge variant="default" className="text-sm font-semibold truncate max-w-full">
                                                        {dados.tabela}
                                                    </Badge>
                                                    {outdated && (
                                                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                                                    )}
                                                </div>

                                                {/* Last Update */}
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Última Atualização
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {formatarData(dados.ultima_atualizacao)}
                                                    </span>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    {isManual ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Cog className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                                Manual
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                                            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                                                Automática
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                            <CardContent className="p-4">
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Legenda
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Bot className="h-4 w-4 text-violet-600" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Atualização automática
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Cog className="h-4 w-4 text-slate-600" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Atualização manual
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Necessita atualização
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}

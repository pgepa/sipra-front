import { useState } from 'react';
import { api } from '@/lib/axios';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { AiFillFilePdf } from 'react-icons/ai';
import { formatarData } from '@/lib/utils';
import { SearchInput } from '@/components/SearchInput';
import { FilterSection } from '@/components/FilterSection';
import { EmptyState } from '@/components/EmptyState';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { DataCard, DataField } from '@/components/DataCard';
import { DebitoData, DebitoFilterState } from './types/debitos.types';

export function ConsultaDebitos() {
    const [data, setData] = useState<{ cda: string; contribuinte?: string; data: DebitoData }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<DebitoFilterState>({ cda: '', documento: '' });
    const [searched, setSearched] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{
        [key: string]: { [key: string]: boolean };
    }>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCdas, setTotalCdas] = useState(0);

    const toggleSection = (cda: string, section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [cda]: {
                ...prev[cda],
                [section]: !prev[cda]?.[section],
            },
        }));
    };

    const handleDownloadPdf = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token de autenticação não encontrado!');
            return;
        }

        setLoading(true);

        api
            .get('/consultacda', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    cda: filters.cda || undefined,
                    documento: filters.documento || undefined,
                    download: 'pdf',
                },
                responseType: 'blob',
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Consulta_Debitos_${filters.cda || filters.documento}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Erro ao fazer download do PDF:', error);
                alert('Erro ao fazer download do PDF.');
            })
            .finally(() => setLoading(false));
    };

    const fetchData = (currentPage: number) => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        api
            .get('/consultacda', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    cda: filters.cda || undefined,
                    documento: filters.documento || undefined,
                    page: currentPage,
                    per_page: 10,
                },
            })
            .then((response) => {
                if (response.data?.DadosPorDocumento) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const resultados = response.data.DadosPorDocumento.map((item: any) => ({
                        contribuinte: response.data.Contribuinte || 'N/A',
                        cda: item.CDA || 'N/A',
                        data: item,
                    }));
                    setData(resultados);
                    setTotalPages(Math.ceil(response.data.total_cdas / 10));
                    setTotalCdas(response.data.total_cdas);
                } else if (response.data?.DadosCDA) {
                    const resultados = [
                        {
                            contribuinte: response.data.DadosCDA?.[0]?.contribuinte || 'N/A',
                            cda: response.data.cda || 'N/A',
                            data: response.data,
                        },
                    ];
                    setData(resultados);
                    setTotalPages(1);
                    setTotalCdas(1);
                } else {
                    setError('Formato de resposta desconhecido.');
                }

                setLoading(false);
                setSearched(true);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                setSearched(true);
                setError('Informe novos filtros para a pesquisa.');
            });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        fetchData(1);
    };

    const handleClearFilters = () => {
        setFilters({ cda: '', documento: '' });
        setData(null);
        setSearched(false);
        setError(null);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchData(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatarMoeda = (valor: number): string => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            Ativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200',
            Extinto: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
            Suspenso: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200',
            Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getProtestoStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            'Aguardando envio': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200',
            'Aguardando recebimento': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200',
            Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
            Devolvido: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200',
            Enviado: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200',
            Gerado: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200',
            Retirado: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
            Sustado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <>
            <Helmet title="Consulta de Débitos" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Consulta de Débitos - CDA
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consulte informações detalhadas sobre CDAs
                    </p>
                </div>

                {/* Filters Card */}
                <Card className="shadow-lg border-gray-200 dark:border-gray-800">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-violet-700 dark:text-violet-400">
                            Filtros de Pesquisa
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Informe o número da CDA ou documento para consultar
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FilterSection label="Nº CDA">
                                    <SearchInput
                                        placeholder="Buscar por CDA"
                                        value={filters.cda}
                                        onChange={(value) => setFilters({ ...filters, cda: value })}
                                    />
                                </FilterSection>

                                <FilterSection label="Documento (CPF/CNPJ)">
                                    <SearchInput
                                        placeholder="Buscar por documento"
                                        value={filters.documento}
                                        onChange={(value) => setFilters({ ...filters, documento: value })}
                                    />
                                </FilterSection>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    type="submit"
                                    className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700 transition-colors"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Pesquisar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleClearFilters}
                                    variant="outline"
                                    className="flex-1 sm:flex-none"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Limpar Filtros
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <GridLoader size={16} color="#7c3aed" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && searched && !data && <EmptyState error={error} />}

                {/* Results */}
                {searched && data && data.length > 0 && (
                    <div className="space-y-6">
                        {/* Download Button and Pagination Info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    {totalCdas} CDA(s) encontrada(s)
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Página {page} de {totalPages}
                                </p>
                            </div>

                            <Button onClick={handleDownloadPdf} variant="outline" className="gap-2">
                                <AiFillFilePdf className="h-5 w-5 text-rose-600" />
                                Download PDF
                            </Button>
                        </div>

                        {/* Results Cards */}
                        {data.map(({ cda, data: cdaData, contribuinte }, index) => (
                            <Card key={index} className="shadow-lg border-gray-200 dark:border-gray-800">
                                <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-2xl text-violet-700 dark:text-violet-400">
                                                {contribuinte !== 'N/A' ? contribuinte : 'Contribuinte não encontrado'}
                                            </CardTitle>
                                            {cdaData.DadosCDA && cdaData.DadosCDA.length > 0 && (
                                                <CardDescription className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
                                                    CDA: {cdaData.DadosCDA[0].cda}
                                                </CardDescription>
                                            )}
                                        </div>

                                        {/* Status Badges */}
                                        {cdaData.DadosCDA && cdaData.DadosCDA.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {cdaData.DadosCDA[0].statusdebito && (
                                                    <Badge className={getStatusColor(cdaData.DadosCDA[0].statusdebito)}>
                                                        {cdaData.DadosCDA[0].statusdebito}
                                                    </Badge>
                                                )}
                                                {cdaData.DadosCDA[0].sit_protesto && (
                                                    <Badge className={getProtestoStatusColor(cdaData.DadosCDA[0].sit_protesto)}>
                                                        {cdaData.DadosCDA[0].sit_protesto}
                                                    </Badge>
                                                )}
                                                {cdaData.DadosCDA[0].flajuizada === 'S' && (
                                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200">
                                                        Ajuizada
                                                    </Badge>
                                                )}
                                                {cdaData.DadosCDA[0].prescrito && cdaData.DadosCDA[0].prescrito !== 'Não' && (
                                                    <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300 border-rose-200">
                                                        {cdaData.DadosCDA[0].prescrito}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-6">
                                    {/* Dados CDA */}
                                    <CollapsibleSection
                                        title="Dados da CDA"
                                        isExpanded={expandedSections[cda]?.dadosCDA}
                                        onToggle={() => toggleSection(cda, 'dadosCDA')}
                                        count={cdaData.DadosCDA?.length}
                                    >
                                        <div className="space-y-3">
                                            {cdaData.DadosCDA && cdaData.DadosCDA.length > 0 ? (
                                                cdaData.DadosCDA.map((cadastro, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                            <DataField label="CDA" value={cadastro.cda} />
                                                            <DataField label="Data de Inscrição" value={formatarData(cadastro.dtinscricao)} />
                                                            <DataField label="Tipo Débito" value={cadastro.tipoimposto} />
                                                            <DataField label="Status Débito" value={cadastro.statusdebito} />
                                                            <DataField label="Data de Referência" value={formatarData(cadastro.dtreferencia)} />
                                                            <DataField label="Origem Débito" value={cadastro.origemdivida} />
                                                            <DataField label="Fundamento" value={cadastro.fundamento} className="col-span-full lg:col-span-2" />
                                                            <DataField label="Valor" value={formatarMoeda(cadastro.vlcdaatualizado)} />
                                                            <DataField label="Data Atualização Saldo" value={formatarData(cadastro.dtatualizacaosaldo)} />
                                                            <DataField label="Placa" value={cadastro.placa} />
                                                            <DataField label="Ajuizada" value={cadastro.flajuizada} />
                                                            <DataField label="Data Ajuizamento" value={formatarData(cadastro.dtajuizamento)} />
                                                            <DataField label="Prescrição" value={cadastro.prescrito} />
                                                            <DataField label="Situação Protesto" value={cadastro.sit_protesto} className="col-span-full" />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhuma CDA encontrada" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Histórico */}
                                    <CollapsibleSection
                                        title="Histórico"
                                        isExpanded={expandedSections[cda]?.historico}
                                        onToggle={() => toggleSection(cda, 'historico')}
                                        count={cdaData.HistoricoCDA?.length}
                                    >
                                        <div className="space-y-3">
                                            {cdaData.HistoricoCDA && cdaData.HistoricoCDA.length > 0 ? (
                                                cdaData.HistoricoCDA.map((historico, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            <DataField label="Usuário Situação" value={historico.cdusuinclusao} />
                                                            <DataField label="Situação" value={historico.situacao} />
                                                            <DataField
                                                                label="Data Situação"
                                                                value={new Date(historico.dtsituacao).toLocaleDateString('pt-BR')}
                                                            />
                                                            <DataField label="Observação" value={historico.observacao} className="col-span-full" />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum histórico encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Parcelamento */}
                                    <CollapsibleSection
                                        title="Parcelamento"
                                        isExpanded={expandedSections[cda]?.parcelamento}
                                        onToggle={() => toggleSection(cda, 'parcelamento')}
                                        count={cdaData.ParcelamentoCDA?.length}
                                    >
                                        <div className="space-y-3">
                                            {cdaData.ParcelamentoCDA && cdaData.ParcelamentoCDA.length > 0 ? (
                                                cdaData.ParcelamentoCDA.map((parcelamento, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Nº Parcelamento" value={parcelamento.parcelamento} />
                                                            <DataField label="Data do Parcelamento" value={formatarData(parcelamento.dtparcelamento)} />
                                                            <DataField label="Nº de Parcelas" value={parseInt(parcelamento.nuparcelas, 10)} />
                                                            <DataField label="Regra de Parcelamento" value={parcelamento.regraparcelamento} />
                                                            <DataField label="Observação Parcelamento" value={parcelamento.observparcelamento} className="col-span-full" />
                                                            <DataField label="Status Parcelamento" value={parcelamento.sitparcelamento} />
                                                            <DataField label="Data Término" value={formatarData(parcelamento.dtterminopar)} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum parcelamento encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Página {page} de {totalPages}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>

                                    <div className="hidden sm:flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                            if (pageNum > totalPages) return null;
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={page === pageNum ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={page === pageNum ? 'bg-violet-600' : ''}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="gap-1"
                                    >
                                        Próxima
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

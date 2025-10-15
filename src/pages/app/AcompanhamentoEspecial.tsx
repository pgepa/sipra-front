import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/EmptyState';
import { FilterSection } from '@/components/FilterSection';
import { SearchInput } from '@/components/SearchInput';
import { AcompanhamentoCard } from './components/AcompanhamentoCard';
import { AcompanhamentoData, AcompanhamentoFilterState } from './types/acompanhamento.types';
import { COMARCAS } from './constants/acompanhamento.constants';

export function AcompanhamentoEspecial() {
    const [processos, setProcessos] = useState<AcompanhamentoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [acompanhamentoEspecial, setAcompanhamentoEspecial] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState<AcompanhamentoFilterState>({
        numformatado: '',
        comarca: '',
        vlprocesso_min: '',
        vlprocesso_max: '',
        indicio: ' ',
    });

    const token = localStorage.getItem('token');

    const fetchProcessos = useCallback(
        async (currentPage = 1, order = 'desc', downloadFormat = '') => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/consultarecc', {
                    params: {
                        page: currentPage,
                        per_page: 25,
                        download: downloadFormat,
                        order: order,
                        orderby: 'somavlcdas',
                        numformatado: filters.numformatado || undefined,
                        indicio: filters.indicio || undefined,
                        AE: acompanhamentoEspecial ? true : undefined,
                        comarca: filters.comarca || undefined,
                        vlprocesso_min: filters.vlprocesso_min || undefined,
                        vlprocesso_max: filters.vlprocesso_max || undefined,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: downloadFormat ? 'blob' : 'json',
                });

                if (downloadFormat) {
                    const blob = new Blob([response.data], { type: 'text/csv' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `processos.${downloadFormat}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                } else {
                    setProcessos(response.data.data);
                    setTotalItems(response.data.total_items);
                    setTotalPages(Math.ceil(response.data.total_items / 25));
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setProcessos([]);
                setError('Erro ao buscar dados. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        },
        [filters, acompanhamentoEspecial, token]
    );

    useEffect(() => {
        fetchProcessos(page, sortOrder);
    }, [page, sortOrder, fetchProcessos]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleClearFilters = () => {
        setFilters({
            numformatado: '',
            comarca: '',
            vlprocesso_min: '',
            vlprocesso_max: '',
            indicio: ' ',
        });
        setAcompanhamentoEspecial(false);
        setPage(1);
    };

    const handleDownloadPdf = async (url: string) => {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao baixar PDF');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'SIDA_Relatorio_Pesquisa_Patrimonial.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Erro ao baixar PDF:', error);
            alert('Erro ao baixar PDF. Tente novamente.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProcessos(1, sortOrder);
    };

    return (
        <>
            <Helmet title="RECC" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Regime Especial
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consulte e acompanhe processos judiciais
                    </p>
                </div>

                {/* Filters Card */}
                <Card className="shadow-lg border-gray-200 dark:border-gray-800">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-violet-700 dark:text-violet-400">
                            Filtros de Pesquisa
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Utilize os campos abaixo para refinar sua busca de processos
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {/* Número do Processo */}
                                <FilterSection label="Número do Processo">
                                    <SearchInput
                                        placeholder="0000000-00.0000.0.00.0000"
                                        value={filters.numformatado}
                                        onChange={(value) => setFilters({ ...filters, numformatado: value })}
                                    />
                                </FilterSection>

                                {/* Comarca */}
                                <FilterSection label="Comarca">
                                    <Select
                                        value={filters.comarca}
                                        onValueChange={(value) => setFilters({ ...filters, comarca: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Escolha uma comarca" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {COMARCAS.map((comarca) => (
                                                <SelectItem key={comarca} value={comarca}>
                                                    {comarca}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FilterSection>

                                {/* Valor Mínimo */}
                                <FilterSection label="Valor Mínimo">
                                    <SearchInput
                                        type="number"
                                        placeholder="R$ 1.000,00"
                                        value={filters.vlprocesso_min}
                                        onChange={(value) => setFilters({ ...filters, vlprocesso_min: value })}
                                    />
                                </FilterSection>

                                {/* Valor Máximo */}
                                <FilterSection label="Valor Máximo">
                                    <SearchInput
                                        type="number"
                                        placeholder="R$ 50.000,00"
                                        value={filters.vlprocesso_max}
                                        onChange={(value) => setFilters({ ...filters, vlprocesso_max: value })}
                                    />
                                </FilterSection>

                                {/* Indício Patrimonial */}
                                <FilterSection label="Indício Patrimonial">
                                    <Select
                                        value={filters.indicio}
                                        onValueChange={(value) => setFilters({ ...filters, indicio: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Escolha uma opção" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=" ">Todos</SelectItem>
                                            <SelectItem value="true">SIM</SelectItem>
                                            <SelectItem value="false">NÃO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FilterSection>

                                {/* Acompanhamento Especial */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                                        Acompanhamento Especial
                                    </Label>
                                    <div className="flex items-center justify-between h-10 px-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                                        <Label
                                            htmlFor="acompanhamento"
                                            className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
                                        >
                                            Filtrar por AE
                                        </Label>
                                        <Switch
                                            id="acompanhamento"
                                            checked={acompanhamentoEspecial}
                                            onCheckedChange={setAcompanhamentoEspecial}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
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

                {/* Results Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {Number(totalItems).toLocaleString('pt-BR')} resultados encontrados
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Ordenar por:
                        </Label>
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Maior Valor</SelectItem>
                                <SelectItem value="asc">Menor Valor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <GridLoader size={16} color="#7c3aed" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && (!processos || processos.length === 0) && (
                    <EmptyState error={error} />
                )}

                {/* Results Grid */}
                {!loading && processos && processos.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {processos.map((processo) => (
                                <AcompanhamentoCard
                                    key={processo.cdprocesso}
                                    processo={processo}
                                    onDownloadPdf={handleDownloadPdf}
                                />
                            ))}
                        </div>

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
                    </>
                )}
            </div>
        </>
    );
}

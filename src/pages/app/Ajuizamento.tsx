import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GrDocumentExcel } from 'react-icons/gr';
import GridLoader from 'react-spinners/GridLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/EmptyState';
import { MultiSelectDropdown } from '@/components/MultiSelectDropdown';
import { FilterSection } from '@/components/FilterSection';
import { SearchInput } from '@/components/SearchInput';
import { ProtestoCard } from '@/pages/app/components/ProtestoCard';
import { FilterState, ProtestoData } from './types/ajuizamento.types';
import { FILTER_OPTIONS } from './constants/ajuizamento.constants';

export function Ajuizamento() {
    const [protestos, setProtestos] = useState<ProtestoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isCNPJSelected, setIsCNPJSelected] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState<FilterState>({
        documento: '',
        contribuinte: '',
        tpdoc: '',
        docraiz: '',
        porte: [],
        situacaocadastral: [],
        tipotributo: [],
        vlconsolidado_min: '',
        vlconsolidado_max: '',
        statusdebito: [],
        parcelamento: '',
        prescrito: [],
        origemdivida: '',
        indiciopatrimonial: '',
        sit_protesto: [],
    });

    const token = localStorage.getItem('token');

    const fetchProtestos = useCallback(
        async (currentPage = 1, order = 'desc', downloadFormat = '') => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/buscaajuizamento', {
                    params: {
                        page: currentPage,
                        per_page: 25,
                        download: downloadFormat,
                        order: order,
                        ...filters,
                        porte: filters.porte.join(','),
                        situacaocadastral: filters.situacaocadastral.join(','),
                        tipotributo: filters.tipotributo.join(','),
                        statusdebito: filters.statusdebito.join(','),
                        prescrito: filters.prescrito.join(','),
                        sit_protesto: filters.sit_protesto.join(','),
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
                    link.download = `protestos.${downloadFormat}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                } else {
                    setProtestos(response.data.data);
                    setTotalItems(response.data.total_items);
                    setTotalPages(Math.ceil(response.data.total_items / 25));
                }
            } catch (error) {
                console.error('Erro ao buscar dados de protestos:', error);
                setProtestos([]);
                setError('Erro ao buscar dados de protestos. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        },
        [filters, token]
    );

    useEffect(() => {
        fetchProtestos(page, sortOrder);
    }, [page, sortOrder, fetchProtestos]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleClearFilters = () => {
        setFilters({
            documento: '',
            contribuinte: '',
            tpdoc: '',
            porte: [],
            situacaocadastral: [],
            tipotributo: [],
            vlconsolidado_min: '',
            vlconsolidado_max: '',
            statusdebito: [],
            parcelamento: '',
            prescrito: [],
            origemdivida: '',
            indiciopatrimonial: '',
            docraiz: '',
            sit_protesto: [],
        });
        setPage(1);
        setIsCNPJSelected(false);
    };

    const handleCheckboxChange = (
        type: keyof Pick<FilterState, 'porte' | 'sit_protesto' | 'situacaocadastral' | 'tipotributo' | 'statusdebito' | 'prescrito'>,
        value: string
    ) => {
        setFilters((prevFilters) => {
            const newFilter = prevFilters[type].includes(value)
                ? prevFilters[type].filter((item: string) => item !== value)
                : [...prevFilters[type], value];
            return { ...prevFilters, [type]: newFilter };
        });
    };

    const handleDocumentTypeChange = (value: string) => {
        setFilters({ ...filters, tpdoc: value });
        setIsCNPJSelected(value === 'CNPJ');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProtestos(1, sortOrder);
    };

    return (
        <>
            <Helmet title="Ajuizamento" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Ajuizamento
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gerencie e acompanhe processos de ajuizamento
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
                            {/* Grid de Filtros */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {/* CPF/CNPJ */}
                                <FilterSection label="CPF/CNPJ">
                                    <SearchInput
                                        placeholder="Buscar por CPF/CNPJ"
                                        value={filters.documento}
                                        onChange={(value) => setFilters({ ...filters, documento: value })}
                                    />
                                </FilterSection>

                                {/* CNPJ Raiz */}
                                <FilterSection label="CNPJ Raiz">
                                    <SearchInput
                                        placeholder="Buscar por CNPJ Raiz"
                                        value={filters.docraiz}
                                        onChange={(value) => setFilters({ ...filters, docraiz: value })}
                                    />
                                </FilterSection>

                                {/* Nome Contribuinte */}
                                <FilterSection label="Nome Contribuinte">
                                    <SearchInput
                                        placeholder="Nome do contribuinte"
                                        value={filters.contribuinte}
                                        onChange={(value) => setFilters({ ...filters, contribuinte: value })}
                                    />
                                </FilterSection>

                                {/* Origem da Dívida */}
                                <FilterSection label="Origem da Dívida">
                                    <SearchInput
                                        placeholder="Origem da dívida"
                                        value={filters.origemdivida}
                                        onChange={(value) => setFilters({ ...filters, origemdivida: value })}
                                    />
                                </FilterSection>

                                {/* Valor Mínimo */}
                                <FilterSection label="Valor Mínimo">
                                    <SearchInput
                                        type="number"
                                        placeholder="R$ 1.000,00"
                                        value={filters.vlconsolidado_min}
                                        onChange={(value) => setFilters({ ...filters, vlconsolidado_min: value })}
                                    />
                                </FilterSection>

                                {/* Valor Máximo */}
                                <FilterSection label="Valor Máximo">
                                    <SearchInput
                                        type="number"
                                        placeholder="R$ 50.000,00"
                                        value={filters.vlconsolidado_max}
                                        onChange={(value) => setFilters({ ...filters, vlconsolidado_max: value })}
                                    />
                                </FilterSection>

                                {/* Tipo de Documento */}
                                <FilterSection label="Tipo de Documento">
                                    <Select value={filters.tpdoc} onValueChange={handleDocumentTypeChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Escolha uma opção" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CPF">CPF</SelectItem>
                                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FilterSection>

                                {/* Porte */}
                                <FilterSection label="Porte">
                                    <MultiSelectDropdown
                                        options={FILTER_OPTIONS.portes}
                                        selectedValues={filters.porte}
                                        onValueChange={(value) => handleCheckboxChange('porte', value)}
                                        disabled={!isCNPJSelected}
                                    />
                                </FilterSection>

                                {/* Situação Cadastral */}
                                <FilterSection label="Situação Cadastral (RFB)">
                                    <MultiSelectDropdown
                                        options={FILTER_OPTIONS.situacaoCadastral}
                                        selectedValues={filters.situacaocadastral}
                                        onValueChange={(value) => handleCheckboxChange('situacaocadastral', value)}
                                        disabled={!isCNPJSelected}
                                    />
                                </FilterSection>

                                {/* Indício Patrimonial */}
                                <FilterSection label="Indício Patrimonial">
                                    <Select
                                        value={filters.indiciopatrimonial}
                                        onValueChange={(value) => setFilters({ ...filters, indiciopatrimonial: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Escolha uma opção" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="S">SIM</SelectItem>
                                            <SelectItem value="N">NÃO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FilterSection>

                                {/* Tributo */}
                                <FilterSection label="Tributo">
                                    <MultiSelectDropdown
                                        options={FILTER_OPTIONS.tributos}
                                        selectedValues={filters.tipotributo}
                                        onValueChange={(value) => handleCheckboxChange('tipotributo', value)}
                                    />
                                </FilterSection>

                                {/* Status */}
                                <FilterSection label="Status">
                                    <MultiSelectDropdown
                                        options={FILTER_OPTIONS.statusDebito}
                                        selectedValues={filters.statusdebito}
                                        onValueChange={(value) => handleCheckboxChange('statusdebito', value)}
                                    />
                                </FilterSection>

                                {/* Situação Protesto */}
                                <FilterSection label="Situação Protesto">
                                    <MultiSelectDropdown
                                        options={FILTER_OPTIONS.situacoesProtesto}
                                        selectedValues={filters.sit_protesto}
                                        onValueChange={(value) => handleCheckboxChange('sit_protesto', value)}
                                    />
                                </FilterSection>

                                {/* Parcelamento */}
                                <FilterSection label="Parcelamento">
                                    <Select
                                        value={filters.parcelamento}
                                        onValueChange={(value) => setFilters({ ...filters, parcelamento: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Escolha uma opção" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="S">SIM</SelectItem>
                                            <SelectItem value="N">NÃO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FilterSection>

                                {/* Prescrição Originária */}
                                <FilterSection label="Prescrição Originária">
                                    <MultiSelectDropdown
                                        options={FILTER_OPTIONS.prescritos}
                                        selectedValues={filters.prescrito}
                                        onValueChange={(value) => handleCheckboxChange('prescrito', value)}
                                    />
                                </FilterSection>
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

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                Ordenar por:
                            </span>
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

                        <Button
                            onClick={() => fetchProtestos(page, sortOrder, 'csv')}
                            variant="default"
                            className="bg-green-600 hover:bg-green-700 transition-colors"
                        >
                            <GrDocumentExcel className="h-4 w-4 mr-2" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <GridLoader size={16} color="#7c3aed" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && (!protestos || protestos.length === 0) && (
                    <EmptyState error={error} />
                )}

                {/* Results Grid */}
                {!loading && protestos && protestos.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {protestos.map((protesto, index) => (
                                <ProtestoCard key={`${protesto.cda}-${index}`} protesto={protesto} />
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

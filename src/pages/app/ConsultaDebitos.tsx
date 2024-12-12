import React, { useState } from 'react';
import { api } from '@/lib/axios';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AiFillFilePdf } from 'react-icons/ai';


// Define your interfaces (não modificado, já está correto no original)
interface DadosCDA {
    cda: string;
    dtinscricao: string;
    dtreferencia: string;
    contribuinte: string;
    tipoimposto: string;
    origemdivida: string;
    fundamento: string;
    statusdebito: string;
    vlcdaatualizado: number;
    dtatualizacaosaldo: string;
    prescrito: string;
    flajuizada: string;
    dtajuizamento: string;
    sit_protesto: string;
}

interface HistoricoCDA {
    situacao: string;
    dtsituacao: string;
    cdusuinclusao: string;
    observacao: string;
    num_seq: string;
}

interface ParcelamentoCDA {
    parcelamento: string;
    dtparcelamento: string;
    nuparcelas: string;
    regraparcelamento: string;
    observparcelamento: string;
    sitparcelamento: string;
    dtterminopar: string;
    seqparc: string;
}

interface PessoaJuridicaData {
    HistoricoCDA: HistoricoCDA[];
    DadosCDA: DadosCDA[];
    ParcelamentoCDA: ParcelamentoCDA[];
}

export const ConsultaDebitos: React.FC = () => {
    const [data, setData] = useState<{ cda: string; contribuinte?: string; data: PessoaJuridicaData }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ cda: '', documento: '' });
    const [searched, setSearched] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: { [key: string]: boolean } }>({});
    const [page, setPage] = useState(1); // Página atual
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [totalCdas, setTotalCdas] = useState(1); // Total de páginas

    const toggleSection = (cda: string, section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [cda]: {
                ...prev[cda],
                [section]: !prev[cda]?.[section],
            },
        }));
    };

    {/* FUNÇÃO DE DOWNLOAD
        
        
        */}

    const handleDownloadPdf = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token de autenticação não encontrado!');
            return;
        }

        setLoading(true);

        api.get('/consultacda', {
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
                link.setAttribute('download', `Consulta de Débitos_${filters.cda || filters.documento}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Erro ao fazer download da planilha:', error);
                alert('Erro ao fazer download da planilha.');
            })
            .finally(() => setLoading(false));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSearched(false);
        setError(null);

        const token = localStorage.getItem('token');

        api.get('/consultacda', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cda: filters.cda || undefined,
                documento: filters.documento || undefined,
                page, // Passando a página atual
                per_page: 10, // Quantidade de itens por página
            },
        })
            .then((response) => {
                if (response.data?.DadosPorDocumento) {
                    const resultados = response.data.DadosPorDocumento.map((item: any) => ({
                        contribuinte: response.data.Contribuinte || 'N/A',
                        cda: item.CDA || 'N/A',
                        data: item,
                    }));
                    setData(resultados);
                    setTotalPages(Math.ceil(response.data.total_cdas / 10));
                    setTotalCdas(Math.ceil(response.data.total_cdas));
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

    const resetPagination = () => {
        setPage(1); // Reseta a página para o início
    };

    const handleClearFilters = () => {
        setFilters({ cda: '', documento: '' });
        setData(null);
        setSearched(false);
        setError(null);
        resetPagination();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage); // Atualiza a página
        setLoading(true);

        const token = localStorage.getItem('token');

        api.get('/consultacda', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cda: filters.cda || undefined,
                documento: filters.documento || undefined,
                page: newPage,
                per_page: 10, // Quantidade de itens por página
            },
        })
            .then((response) => {
                if (response.data?.DadosPorDocumento) {
                    const resultados = response.data.DadosPorDocumento.map((item: any) => ({
                        contribuinte: response.data.Contribuinte || 'N/A',
                        cda: item.CDA || 'N/A',
                        data: item,
                    }));
                    setData(resultados);
                    setTotalPages(Math.ceil(response.data.total_cdas / 10));
                } else if (response.data?.DadosCDA) {
                    setData([
                        {
                            contribuinte: response.data.DadosCDA?.[0]?.contribuinte || 'N/A',
                            cda: response.data.cda || 'N/A',
                            data: response.data,
                        },
                    ]);
                    setTotalPages(1);
                } else {
                    setError('Formato de resposta desconhecido.');
                }
            })
            .catch((error) => {
                console.error(error);
                setError('Erro ao carregar os dados.');
            })
            .finally(() => setLoading(false));
    };


    const renderPaginationItems = () => {
        const items = [];
        const startPage = Math.max(page - 2, 1);
        const endPage = Math.min(page + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className={i === page ? "bg-blue-500 text-white" : "text-blue-500"}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <>
            <Helmet title="Consulta de Débitos" />

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-700 text-center">Consulta de Débitos</h1>

                <form
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2"
                    onSubmit={handleSubmit}
                >
                    <span className="text-base font-semibold col-span-2 sm:col-span-3 lg:col-span-6">Filtros:</span>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">Nº CDA:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                placeholder="Busca por CDA"
                                className='pl-10 col-span-1'
                                value={filters.cda}
                                onChange={(e) => setFilters({ ...filters, cda: e.target.value })}
                            />
                        </div>

                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">Documento:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                placeholder="Busca por documento"
                                className='pl-10 col-span-1'
                                value={filters.documento}
                                onChange={(e) => setFilters({ ...filters, documento: e.target.value })}
                            />
                        </div>

                    </div>


                    <Button type="submit" className="default mt-8">
                        <Search className="h-4 w-4 mr-2" />
                        Pesquisar
                    </Button>

                    <Button onClick={handleClearFilters} variant="outline" size="default" className="w-full sm:w-auto mt-8">
                        <X className="h-4 w-4 mr-2" />
                        Remover filtros
                    </Button>

                </form>



                {/* Renderize o título aqui */}
                {loading && <div className="flex justify-center h-screen mt-10">
                    <GridLoader size={16} color="#6b25c7" />
                </div>}
                {error && <div className='text-red-500 text-center'><p className='text-muted-foreground text-lg font-semibold'>{error}</p></div>}
                {data && (
                    <div>
                        {data.map((item) => (
                            <div key={item.cda}>
                                {/* Render your results */}
                            </div>
                        ))}

                        <Pagination className="bottom-0 dark:bg-transparent py-2 cursor-pointer">
                            <PaginationContent>
                                {page > 1 && (
                                    <PaginationPrevious size="sm" onClick={() => handlePageChange(page - 1)}>
                                        {page === 2 ? 'Primeira Página' : 'Anterior'}
                                    </PaginationPrevious>
                                )}
                                {renderPaginationItems()}
                                {page < totalPages && (
                                    <PaginationNext size='sm' onClick={() => handlePageChange(page + 1)}>
                                        Próxima
                                    </PaginationNext>
                                )}
                            </PaginationContent>
                            <div className="ml-2 text-base mt-2 text-gray-600">
                                <span className='flex gap-2'>
                                    <p>Página {page} de {totalPages} ||</p>
                                    <p className='font-semibold text-indigo-600'> {totalCdas} CDA(s) encontrada(s)</p>

                                </span>

                            </div>
                        </Pagination>
                    </div>


                )}


                {searched && data && (
                    <div>


                        <div className='flex'>
                            <Button onClick={handleDownloadPdf} className="w-full sm:w-auto mt-8" variant="outline">
                                <AiFillFilePdf className="h-4 w-4 mr-2 text-rose-700" />
                                Download PDF
                            </Button>
                        </div>



                        {data.map(({ cda, data: cdaData, contribuinte }, index) => (
                            <div key={index} className="mb-8">
                                <div className='flex flex-col gap-4 items-center mt-6'>
                                    <h2 className="flex flex-col items-center text-2xl font-bold text-slate-700 justify-center">
                                        {contribuinte !== 'N/A' ? contribuinte : 'Contribuinte não encontrado'}

                                        {cdaData.DadosCDA && cdaData.DadosCDA.length > 0 && (
                                            <span className="text-lg text-indigo-500 ml-2">
                                                CDA: {cdaData.DadosCDA[0].cda}
                                            </span>
                                        )}


                                    </h2>



                                    <div className="w-full mx-auto p-2">

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cda, 'dadosCDA')}
                                        >
                                            <h2>Dados CDA:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cda]?.dadosCDA ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cda]?.dadosCDA && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cdaData.DadosCDA && cdaData.DadosCDA.length > 0 ? (
                                                    cdaData.DadosCDA.map((cadastro, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">CDA:</span>
                                                                    <span className="text-muted-foreground">{cadastro.cda}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data de Inscrição:</span>
                                                                    <span className="text-muted-foreground">{cadastro.dtinscricao}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Tipo Débito:</span>
                                                                    <span className="text-muted-foreground">{cadastro.tipoimposto}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Status Débito:</span>
                                                                    <span className="text-muted-foreground">{cadastro.statusdebito}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data de Referência:</span>
                                                                    <span className="text-muted-foreground">{cadastro.dtreferencia}</span>
                                                                </div>
                                                                
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Origem Débito:</span>
                                                                    <span className="text-muted-foreground">{cadastro.origemdivida}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Fundamento:</span>
                                                                    <span className="text-muted-foreground">{cadastro.fundamento}</span>
                                                                </div>
                                                                
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Valor:</span>
                                                                    <span className="text-muted-foreground">
                                                                        {Number(cadastro.vlcdaatualizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                    </span>
                                                                </div>

                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data Atualização Saldo:</span>
                                                                    <span className="text-muted-foreground">
                                                                        {cadastro.dtatualizacaosaldo}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Ajuizada:</span>
                                                                    <span className="text-muted-foreground">{cadastro.flajuizada}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data Ajuizamento:</span>
                                                                    <span className="text-muted-foreground">{cadastro.dtajuizamento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Prescrição:</span>
                                                                    <span className="text-muted-foreground">{cadastro.prescrito}</span>
                                                                </div>
                                                                
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Observação:</span>
                                                                    <span className="text-muted-foreground">{cadastro.sit_protesto}</span>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Nenhuma CDA encontrada.</div>
                                                )}
                                            </div>

                                        )}


                                        <div>

                                            <div
                                                className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                                onClick={() => toggleSection(cda, 'historico')}
                                            >
                                                <h2>Histórico:</h2>
                                                <span className="text-white text-xl">
                                                    {expandedSections[cda]?.historico ? '↑' : '↓'}
                                                </span>
                                            </div>

                                            {expandedSections[cda]?.historico && (

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                    {cdaData.HistoricoCDA && cdaData.HistoricoCDA.length > 0 ? (
                                                        cdaData.HistoricoCDA.map((historico, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                            >

                                                                <div className="flex flex-wrap gap-4">
                                                                <div className="flex flex-col gap-1 min-w-[250px]">
                                                                        <span className="font-semibold text-slate-700">Usuáro Situação:</span>
                                                                        <span className="text-muted-foreground">{historico.cdusuinclusao}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[200px]">
                                                                        <span className="font-semibold text-slate-700">Situação:</span>
                                                                        <span className="text-muted-foreground">{historico.situacao}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Data Situação:</span>
                                                                        <span className='text-muted-foreground'>
                                                                            {new Date(historico.dtsituacao).toLocaleDateString('pt-BR')}
                                                                        </span>

                                                                    </div>
                                                                    
                                                                    
                                                                    <div className="flex flex-col gap-1 min-w-[200px]">
                                                                        <span className="font-semibold text-slate-700">Observação:</span>
                                                                        <span className="text-muted-foreground">{historico.observacao}</span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div>
                                                            <p className='text-muted-foreground p-4'>Nenhum histórico encontrado.</p>
                                                        </div>
                                                    )}
                                                </div>

                                            )}


                                        </div>

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cda, 'parcelamento')}
                                        >
                                            <h2>Parcelamento:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cda]?.parcelamento ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cda]?.parcelamento && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cdaData.ParcelamentoCDA && cdaData.ParcelamentoCDA.length > 0 ? (
                                                    cdaData.ParcelamentoCDA.map((parcelamento, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Nº Parcelamento:</span>
                                                                    <span className="text-muted-foreground">{parcelamento.parcelamento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data do Parcelamento:</span>
                                                                    <span className="text-muted-foreground">{parcelamento.dtparcelamento}</span>
                                                                </div>

                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Nº de Parcelas:</span>
                                                                    <span className="text-muted-foreground">{parseInt(parcelamento.nuparcelas, 10)}</span>
                                                                </div>


                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Regra de Parcelamento:</span>
                                                                    <span className="text-muted-foreground">{parcelamento.regraparcelamento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Observação Parcelamento:</span>
                                                                    <span className="text-muted-foreground">{parcelamento.observparcelamento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Status Parcelamento:</span>
                                                                    <span className="text-muted-foreground">{parcelamento.sitparcelamento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data Término Parcelamento:</span>

                                                                    <span className="text-muted-foreground">
                                                                        {new Date(parcelamento.dtterminopar).toLocaleDateString('pt-BR')}
                                                                    </span>

                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <p className='text-muted-foreground p-4'>Nenhum parcelamento encontrado.</p>
                                                    </div>
                                                )}
                                            </div>

                                        )}


                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}


            </div>
        </>
    );
};

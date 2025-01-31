import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Search, SearchX } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GridLoader from 'react-spinners/GridLoader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


interface ProtestoData {

    apensamento: string;
    area: string;
    assunto: string;
    cdprocesso: string;
    cdprocessoapensado: string | null;
    chefia: string;
    classe: string;
    comarca: string;
    flpendaberta: string;
    judicialapensado: string | null;
    numformatado: string;
    numprocesso: string;
    orgao: string;
    nvprocesso: string;
    processoapensado: string | null;
    procuradoria: string;
    qtdcdas: number;
    somavlcdas: number;
    tramite: string;
    vara: string;
    vlacao: number;
}

export function AcompanhamentoEspecial() {
    const [processos, setProcessos] = useState<ProtestoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);


    const token = localStorage.getItem('token');



    const fetchProcessos = async (currentPage = 1, order = 'desc', downloadFormat = '') => {

        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/consultarecc', {
                params: {
                    page: currentPage,
                    per_page: 25,
                    download: downloadFormat,
                    order: order,



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
            console.error('Erro ao buscar dados de processos:', error);
            setProcessos([]);
            setError('Erro ao buscar dados de processos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcessos(page);
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
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
            <Helmet title="RECC" />

            <div className='flex flex-col gap-4'>
                <h1 className='text-2xl font-bold text-slate-700 text-center'>Acompanhamento Especial</h1>

                {
                    /**
                     *  <div className="flex gap-4 mt-4">
                
                                    <Button onClick={() => fetchProtestos(page, 'csv')} variant='default'>
                                        <GrDocumentExcel className="h-4 w-4 mr-2" />
                                        Baixar Planilha
                                    </Button>
                                </div>
                     * 
                     */
                }




                <div className="flex justify-start mt-2 mb-2">
                    <Pagination className="bottom-0 dark:bg-transparent py-2 cursor-pointer gap-2">
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
                        <div className="text-sm mt-2 text-gray-600">
                            Página {page} de {totalPages} ({totalItems} total de resultados)
                        </div>
                    </Pagination>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 space-y-2 sm:space-y-0">
                    <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-blue-300 text-center sm:text-left">
                        {Number(totalItems).toLocaleString('pt-BR')} resultados encontrados
                    </p>

                </div>



            </div>

            {loading && (
                <div className="flex justify-center items-start h-screen">
                    <GridLoader size={16} color="#6b25c7" />
                </div>
            )}

            {!loading && (!processos || processos.length === 0) && (
                <div className='text-xl items-center flex flex-col font-semibold text-justify mt-4 text-muted-foreground'>
                    <p>Não foi encontrado nenhuma CDA para o(s) filtro(s) selecionado(s).</p>
                    <p>Tente novamente com outros parâmetros.</p>
                    <p>{error}</p>
                    <SearchX className="h-12 w-12 mt-4" />
                </div>
            )}

            {processos.map((processo) => (
                <Card key={processo.cdprocesso} className='shadow-md shadow-slate-400/20 mt-4'>
                    <CardHeader className="flex-items-center flex-row justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg text-indigo-700 dark:text-blue-300">
                                Processo: {processo.numformatado}
                            </CardTitle>
                            <CardDescription>{processo.comarca}</CardDescription>


                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <span>

                            <p className="leading-7 [&:not(:first-child)]:mt-6">{processo.vara}</p>

                        </span>


                    </CardContent>



                    <CardFooter className="flex flex-wrap justify-start gap-2 md:gap-4 sm:flex-col md:flex-row">
                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="xs"  className='flex gap-2 w-full sm:w-auto'>
                                        <Search className='h-4 w-4' />
                                        Detalhes
                                    </Button>

                                </DialogTrigger>



                                <DialogContent className="max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className='text-indigo-600 text-center text-xl'>Processo: {processo.numformatado}</DialogTitle>
                                        <DialogDescription>Detalhes</DialogDescription>
                                    </DialogHeader>

                                    <div className='space-y-6'>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Chefia</TableCell>
                                                    <TableCell className='flex justify-end'>{processo.chefia}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Área</TableCell>
                                                    <TableCell className='flex justify-end'>{processo.area}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Classe</TableCell>
                                                    <TableCell className='flex justify-end'>{processo.classe}</TableCell>
                                                </TableRow>


                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Valor da Ação</TableCell>
                                                    <TableCell className='flex justify-end text-indigo-700 font-semibold'>{processo.vlacao !== undefined && processo.vlacao !== null
                                                        ? Number(processo.vlacao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                        : 'R$ 0,00'}</TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    </div>

                                </DialogContent>
                            </Dialog>



                        </div>

                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="xs" className='flex gap-2 text-indigo-800 hover:text-indigo-700 hover:bg-indigo-200/20 cursor-default w-full sm:w-auto'>

                                Valor: {processo.somavlcdas !== undefined && processo.somavlcdas !== null
                                    ? Number(processo.somavlcdas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : 'R$ 0,00'}
                            </Button>
                        </div>

                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-violet-200/20 text-violet-800 cursor-default w-full sm:w-auto'>

                                CDA: {processo.qtdcdas}

                            </Button>

                        </div>


                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-indigo-200/20 text-indigo-700 cursor-default w-full sm:w-auto'>

                                {processo.assunto}

                            </Button>

                        </div>
                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-blue-200/20 text-blue-800 cursor-default w-full sm:w-auto'>

                                {processo.tramite}

                            </Button>

                        </div>
                        

                    </CardFooter>
                </Card>
            ))}
        </>
    );
}

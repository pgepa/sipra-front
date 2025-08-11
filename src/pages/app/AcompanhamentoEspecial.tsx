import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Search, SearchX, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GridLoader from 'react-spinners/GridLoader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AiFillFilePdf } from 'react-icons/ai';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatarData } from '@/lib/utils';


interface ProtestoData {

    apensamento: string;
    atualizadoem: string;
    data_ajuizamento: string;
    fluxo: string;
    idprocesso: string;
    materia: string;
    tpprocesso: string;
    motivo: string;
    qualificacao: string;
    cdprocesso: string;
    idprocessoapensado: string | null;
    chefia: string;
    classe: string;
    judicialapensado: string | null;
    numformatado: string;
    numprocesso: string;
    orgao: string;
    nvprocesso: string;
    processoapensado: string | null;
    procuradoria: string;
    qtdcdas: number;
    somavlcdas: string;
    status: string;
    juizo: string;
    vlacao: string;
    pdf_links?: string[];
    pdf_links_cnpj?: string[];
    indicio: boolean;
    AE: boolean;
    parteprincipal: string;
    mesaprocurador: string;
    assuntoinstituicao: string;
    demandaaberta: string;
    comarca: string;
    vlprocesso: string;

}

interface Filters {
    numformatado: string;
    comarca: string;
    vlprocesso_min: string; // pode ser string porque input normalmente é string
    vlprocesso_max: string;
}

export function AcompanhamentoEspecial() {
    const [processos, setProcessos] = useState<ProtestoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [indicio, setIndicio] = useState(false);
    const [acompanhamentoEspecial, setAcompanhamentoEspecial] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [orderby] = useState<'somavlcdas'>('somavlcdas');
    const [filters, setFilters] = useState<Filters>({
        numformatado: '',
        comarca: '',
        vlprocesso_min: '',
        vlprocesso_max: '',
    });


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
                    orderby: orderby,
                    numformatado: filters.numformatado || undefined,
                    indicio: indicio ? true : undefined,
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
            console.error('Erro ao buscar dados de processos:', error);
            setProcessos([]);
            setError('Erro ao buscar dados de processos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1); // opcional: resetar página ao mudar filtro
        fetchProcessos(1, sortOrder);
    }, [indicio, acompanhamentoEspecial, sortOrder]);

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
            a.download = 'SIDA_Relatório de Pesquisa Patrimonial';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(error);
        }
    };
    const handleClearFilters = () => {
        setFilters({
            numformatado: '',
            comarca: '',
            vlprocesso_min: '',
            vlprocesso_max: '',


        });
        setIndicio(false);
        setAcompanhamentoEspecial(false);
        setPage(1);

    };




    return (
        <>
            <Helmet title="RECC" />

            <div className='flex flex-col gap-4'>

                <form
                    // Adicionamos 'items-end' para alinhar os itens na base, o que funciona bem para botões e campos
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-2 items-end'
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchProcessos(1);
                    }}
                >
                    {/* FILTRO 1: Número do Processo */}
                    <div className='space-y-2'>
                        <Label htmlFor='numProcesso' className='font-semibold text-sm text-gray-700'>Número do Processo:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                id='numProcesso'
                                placeholder='Busca por Nº Processo'
                                className='pl-10 w-full' // Use w-full para responsividade
                                value={filters.numformatado}
                                onChange={(e) => setFilters({ ...filters, numformatado: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* FILTRO 2: Comarca */}
                    <div className='space-y-2'>
                        <Label htmlFor='comarca' className='font-semibold text-sm text-gray-800'>Comarca:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                id='comarca'
                                placeholder='Busca por Comarca'
                                className='pl-10 w-full' // Use w-full para responsividade
                                value={filters.comarca}
                                onChange={(e) => setFilters({ ...filters, comarca: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='vlProcessoMin' className='font-semibold text-sm text-gray-700'>Valor Mínimo:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                id='vlProcessoMin'
                                placeholder='Valor Mínimo'
                                className='pl-10 w-full' // Use w-full para responsividade
                                value={filters.vlprocesso_min}
                                onChange={(e) => setFilters({ ...filters, vlprocesso_min: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='vlProcessoMax' className='font-semibold text-sm text-gray-700'>Valor Máximo:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                id='vlProcessoMax'
                                placeholder='Valor Máximo'
                                className='pl-10 w-full' // Use w-full para responsividade
                                value={filters.vlprocesso_max}
                                onChange={(e) => setFilters({ ...filters, vlprocesso_max: e.target.value })}
                            />
                        </div>
                    </div>



                    {/* FILTRO 3: Indício Patrimonial (Switch) */}
                    <div className='flex items-center justify-center gap-2 w-full h-10 px-3 border rounded-md'>
                        <Label htmlFor='indicio' className='font-semibold text-sm text-violet-700 cursor-pointer'>
                            Indício Patrimonial
                        </Label> 
                        <Switch id='indicio' checked={indicio} onCheckedChange={setIndicio} />
                    </div>

                    {/* FILTRO 4: Acompanhamento Especial (Switch) */}
                    <div className='flex items-center justify-center w-full h-10 px-3 border rounded-md'>
                        <Label htmlFor='acompanhamento' className='font-semibold text-sm text-violet-700 cursor-pointer'>
                            Acompanhamento Especial
                        </Label>
                        <Switch id='acompanhamento' checked={acompanhamentoEspecial} onCheckedChange={setAcompanhamentoEspecial} />
                    </div>

                    {/* BOTÃO 1: Pesquisar */}
                    <Button type='submit' className='default w-full'>
                        <Search className="h-4 w-4 mr-2" />
                        Pesquisar
                    </Button>

                    {/* BOTÃO 2: Limpar Filtros */}
                    <Button onClick={handleClearFilters} variant="outline" size="default" className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Remover filtros
                    </Button>

                </form>




                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 space-y-2 sm:space-y-0">
                    <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-blue-300 text-center sm:text-left">
                        {Number(totalItems).toLocaleString('pt-BR')} resultados encontrados
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <Label className="font-semibold text-sm text-gray-800 dark:text-white text-center sm:text-left">Ordenação:</Label>


                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                            <SelectTrigger className="w-full sm:w-auto">
                                <SelectValue placeholder="Escolha uma ordem" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Maior</SelectItem>
                                <SelectItem value="asc">Menor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                        <div className="space-y-1 flex justify-between w-full">
                            <div>

                                <CardTitle className="text-lg text-indigo-700 dark:text-blue-300 ">
                                    Processo: {processo.numformatado}
                                </CardTitle>
                                <CardDescription>{processo.comarca}</CardDescription>

                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-1">
                        <span>

                            <p className=" text-zinc-800"> {processo.parteprincipal}</p>

                        </span>


                    </CardContent>



                    <CardFooter className="flex flex-wrap justify-start gap-2 md:gap-4 sm:flex-col md:flex-row">
                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="xs" className='flex gap-2 w-full sm:w-auto'>
                                        <Search className='h-4 w-4' />
                                        Detalhes
                                    </Button>

                                </DialogTrigger>



                                <DialogContent className="max-h-[90vh] overflow-y-auto">

                                    <DialogHeader>
                                        <DialogTitle className='text-indigo-600 text-center text-xl'>Processo: {processo.numformatado}</DialogTitle>
                                        <DialogDescription>Detalhes</DialogDescription>
                                        <DialogDescription className="text-indigo-600 font-medium">{processo.parteprincipal}</DialogDescription>

                                    </DialogHeader>

                                    <div className='space-y-6'>
                                        <Table>
                                            <TableBody>

                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Mesa Procurador</TableCell>
                                                    <TableCell className='flex justify-end'>{processo.mesaprocurador}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Ajuizamento</TableCell>
                                                    <TableCell className='flex justify-end'>{formatarData(processo.data_ajuizamento)}</TableCell>
                                                </TableRow>


                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Assunto Instituição</TableCell>
                                                    <TableCell className='flex justify-end'>{processo.assuntoinstituicao}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Demanda em Aberto</TableCell>
                                                    <TableCell className='flex justify-end'>{processo.demandaaberta}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell className='text-muted-foreground'>Juízo</TableCell>
                                                    <TableCell className='flex text-end justify-end'>{processo.juizo}</TableCell>
                                                </TableRow>


                                            </TableBody>
                                        </Table>
                                    </div>

                                </DialogContent>
                            </Dialog>



                        </div>
                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="xs" className='flex gap-2 text-indigo-800 hover:text-indigo-700 hover:bg-indigo-200/20 cursor-default w-full sm:w-auto'>

                                Valor Processo: {processo.vlprocesso !== undefined && processo.vlprocesso !== null
                                    ? Number(processo.vlprocesso).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : 'R$ 0,00'}
                            </Button>
                        </div>

                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-violet-200/20 text-violet-800 cursor-default w-full sm:w-auto'>

                                CDA: {processo.qtdcdas}

                            </Button>

                        </div>



                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-blue-200/20 text-blue-800 cursor-default w-full sm:w-auto'>

                                {processo.status}

                            </Button>

                        </div>

                        {(processo.pdf_links || processo.pdf_links_cnpj) && (
                            <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                                {[...(processo.pdf_links || []), ...(processo.pdf_links_cnpj || [])].map((link, index) => (
                                    <Button
                                        key={index}
                                        variant="secondary"
                                        size="xs"
                                        className='flex gap-2 bg-rose-200/20 text-rose-700 w-full sm:w-auto'
                                        onClick={() => handleDownloadPdf(link)}
                                    >
                                        <AiFillFilePdf className="h-4 w-4 text-rose-700" />
                                        PDF {index + 1}
                                    </Button>
                                ))}
                            </div>
                        )}




                    </CardFooter>
                </Card>
            ))}

            <div className="flex justify-start mt-3 mb-2">
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
        </>
    );
}

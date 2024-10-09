import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { GrDocumentExcel } from "react-icons/gr";
import { format, parse } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GridLoader from 'react-spinners/GridLoader';
import { Label } from '@/components/ui/label';

interface ProtestoData {
    cda: string;
    contribuinte: string;
    docformatado: string;
    doc_raiz: string;
    tipodoc: string;
    natjuridica: string | null;
    porte: string | null;
    situacaocadastral: string | null;
    dtsituacaocadastral: string | null;
    dtinicioatividade: string | null;
    capitalsocial: string | null;
    descricao: string | null;
    dtinscricao: string;
    dtreferencia: string;
    tipotributo: string;
    fundamento: string;
    origemdivida: string;
    vlcdaoriginal: number;
    vlmultaatualizada: number;
    vljurosatualizado: number;
    vlimpatualizado: number;
    vlcdaatualizado: number;
    status_saj: string;
    dt_status_saj: string;
    ulthistorico: string | null;
    dt_ulthist: string | null;
    flajuizada: string;
    sit_protesto: string;
    parcelamento: string;
    prescrito: string;
    obs_end_protesto: string;
}

export function Protesto() {
    const [protestos, setProtestos] = useState<ProtestoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState({
        nudocumento: '',
        contribuinte: '',
        tipodoc: '',
        natjuridica: '',
        porte: '',
        situacaocadastral: '',
        tipotributo: '',
        fundamento: '',
        vlcdaatualizado_min: '',
        vlcdaatualizado_max: '',
        status_saj: '',
        flajuizada: '',
        parcelamento: '',
        prescrito: '',
        obs_end_protesto: '',
        origemdivida: '',
        ulthistorico: '',
        sit_protesto: '',
    });

    const token = localStorage.getItem('token');

    const fetchProtestos = async (currentPage = 1, downloadFormat = '') => {

        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/buscaprotesto', {
                params: {
                    page: currentPage,
                    per_page: 25,
                    download: downloadFormat,
                    ...filters
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: downloadFormat ? 'blob' : 'json',
            });

            if (downloadFormat) {
                const blob = new Blob([response.data], { type: downloadFormat === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `protestos.${downloadFormat}`;
                link.click();
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
    };

    useEffect(() => {
        fetchProtestos(page);
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

    const handleClearFilters = () => {
        setFilters({
            nudocumento: '',
            contribuinte: '',
            tipodoc: '',
            natjuridica: '',
            porte: '',
            situacaocadastral: '',
            tipotributo: '',
            fundamento: '',
            vlcdaatualizado_min: '',
            vlcdaatualizado_max: '',
            status_saj: '',
            flajuizada: '',
            parcelamento: '',
            prescrito: '',
            obs_end_protesto: '',
            origemdivida: '',
            ulthistorico: '',
            sit_protesto: '',
        });
        setPage(1);
        fetchProtestos(1);
    };




    return (
        <>
            <Helmet title="Protesto" />

            <div className='flex flex-col gap-4'>
                <h1 className='text-2xl font-bold text-slate-700'>Protesto</h1>



                <form
                    className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-2'
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchProtestos(1);
                    }}
                >
                    <span className='text-sm font-semibold col-span-2 sm:col-span-3 lg:col-span-5'>Filtros:</span>
                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Nº Documento:</Label>
                        <Input
                            placeholder='Informe somente números'
                            className='col-span-1'
                            value={filters.nudocumento}
                            onChange={(e) => setFilters({ ...filters, nudocumento: e.target.value })}
                        />

                    </div>
                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Contribuinte:</Label>
                        <Input
                            placeholder='Contribuinte'
                            className='col-span-1'
                            value={filters.contribuinte}
                            onChange={(e) => setFilters({ ...filters, contribuinte: e.target.value })}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Fundamento:</Label>
                        <Input
                            placeholder='Fundamento'
                            className='col-span-1'
                            value={filters.fundamento}
                            onChange={(e) => setFilters({ ...filters, fundamento: e.target.value })}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Origem da dívida:</Label>
                        <Input
                            placeholder='Origem da dívida'
                            className='col-span-1'
                            value={filters.origemdivida}
                            onChange={(e) => setFilters({ ...filters, origemdivida: e.target.value })}
                        />
                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Valor mínino atualizado:</Label>

                        <Input
                            placeholder='Informe somente números'
                            className='col-span-1'
                            value={filters.vlcdaatualizado_min}
                            onChange={(e) => setFilters({ ...filters, vlcdaatualizado_min: e.target.value })}
                        />

                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Valor máximo atualizado:</Label>

                        <Input
                            placeholder='informe somente números'
                            className='col-span-1'
                            value={filters.vlcdaatualizado_max}
                            onChange={(e) => setFilters({ ...filters, vlcdaatualizado_max: e.target.value })}
                        />

                    </div>


                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Tipo de documento:</Label>
                        <Select value={filters.tipodoc} onValueChange={(value) => setFilters({ ...filters, tipodoc: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="CPF ">CPF</SelectItem>
                                <SelectItem value="CNPJ">CNPJ</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Porte da empresa:</Label>

                        <Select value={filters.porte} onValueChange={(value) => setFilters({ ...filters, porte: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Empresa de Pequeno Porte">Empresa de Pequeno Porte</SelectItem>
                                <SelectItem value="Micro Empresa">Micro Empresa</SelectItem>
                                <SelectItem value="Demais">Demais</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Situação cadastral RFB:</Label>

                        <Select value={filters.situacaocadastral} onValueChange={(value) => setFilters({ ...filters, situacaocadastral: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Ativa">Ativa</SelectItem>
                                <SelectItem value="Baixada">Baixada</SelectItem>
                                <SelectItem value="Inapta">Inapta</SelectItem>
                                <SelectItem value="Nula">Nula</SelectItem>
                                <SelectItem value="Suspensa">Suspensa</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Situação Protesto:</Label>

                        <Select value={filters.sit_protesto} onValueChange={(value) => setFilters({ ...filters, sit_protesto: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Ag. Protesto">Ag. Protesto</SelectItem>
                                <SelectItem value="Cancelamento">Cancelamento</SelectItem>
                                <SelectItem value="Devolvido">Devolvido</SelectItem>
                                <SelectItem value="Kit Protesto Gerado">Kit Protesto Gerado</SelectItem>
                                <SelectItem value="Não Protestado">Não Protestado</SelectItem>
                                <SelectItem value="Protestado">Protestado</SelectItem>
                                <SelectItem value="Pago">Pago</SelectItem>
                                <SelectItem value="Sustado">Sustado</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Último histórico:</Label>

                        <Select value={filters.ulthistorico} onValueChange={(value) => setFilters({ ...filters, ulthistorico: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Aguardando ajuizamento">Aguardando ajuizamento</SelectItem>
                                <SelectItem value="Ajuizada">Ajuizada</SelectItem>
                                <SelectItem value="Cancelada">Cancelada</SelectItem>
                                <SelectItem value="EXCLUSÃO AJUIZAMENTO ANÁLISE CDAS LEGADO">Exclusão ajuizamento análise CDAS legado</SelectItem>
                                <SelectItem value="Exclusão do Ajuizamento">Exclusão do ajuizamento</SelectItem>
                                <SelectItem value="Execução fiscal excluída">Execução fiscal excluída</SelectItem>
                                <SelectItem value="Execução fiscal extinta">Execução fiscal extinta</SelectItem>
                                <SelectItem value="Inscrita">Inscrita</SelectItem>
                                <SelectItem value="Kit de ajuizamento excluído">Kit de ajuizamento excluído</SelectItem>
                                <SelectItem value="Kit de protesto excluído">Kit de protesto excluído</SelectItem>
                                <SelectItem value="Kit de protesto gerado">Kit de protesto gerado</SelectItem>
                                <SelectItem value="Processo protesto excluído">Processo protesto excluído</SelectItem>
                                <SelectItem value="Processo protesto extinto">Processo protesto extinto</SelectItem>
                                <SelectItem value="Protestada">Protestada</SelectItem>
                                <SelectItem value="Protestada por edital">Protestada por edital</SelectItem>
                                <SelectItem value="Protesto pago">Protesto pago</SelectItem>
                                <SelectItem value="Protesto sustado">Protesto sustado</SelectItem>
                                <SelectItem value="Quitada">Quitada</SelectItem>
                                <SelectItem value="Suspensa">Suspensa</SelectItem>


                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Tipo de Atributo:</Label>

                        <Select value={filters.tipotributo} onValueChange={(value) => setFilters({ ...filters, tipotributo: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Dívida Ativa ICMS">Dívida Ativa ICMS</SelectItem>
                                <SelectItem value="Dívida Ativa IPVA">Dívida Ativa IPVA</SelectItem>
                                <SelectItem value="Dívida Ativa ITCD">Dívida Ativa ITCD</SelectItem>
                                <SelectItem value="Dívida Ativa não tributária">Dívida Ativa não Tributária</SelectItem>
                                <SelectItem value="Dívida Ativa TFRH">Dívida Ativa TFRH</SelectItem>
                                <SelectItem value="Dívida Ativa TFRM">Dívida Ativa TFRM</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Status SAJ:</Label>

                        <Select value={filters.status_saj} onValueChange={(value) => setFilters({ ...filters, status_saj: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Inscrita">Inscrita</SelectItem>
                                <SelectItem value="Cancelada">Cancelada</SelectItem>
                                <SelectItem value="Exclusão">Exclusão</SelectItem>
                                <SelectItem value="Ajuizamento">Ajuizamento</SelectItem>
                                <SelectItem value="Análise CDAs Legado">Análise CDAs Legado</SelectItem>
                                <SelectItem value="Quitada">Quitada</SelectItem>
                                <SelectItem value="Suspensa">Suspensa</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Flag Ajuizada:</Label>

                        <Select value={filters.flajuizada} onValueChange={(value) => setFilters({ ...filters, flajuizada: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="S">SIM</SelectItem>
                                <SelectItem value="N">NÃO</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Parcelamento:</Label>

                        <Select value={filters.parcelamento} onValueChange={(value) => setFilters({ ...filters, parcelamento: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="S">SIM</SelectItem>
                                <SelectItem value="N">NÃO</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Prescrito:</Label>

                        <Select value={filters.prescrito} onValueChange={(value) => setFilters({ ...filters, prescrito: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Dentro do prazo prescricional">Dentro do prazo prescricional</SelectItem>
                                <SelectItem value="Possível Prescrição">Possível Prescrição</SelectItem>
                                <SelectItem value="Prestes a prescrever">Prestes a prescrever</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Endereço Protesto:</Label>

                        <Select value={filters.obs_end_protesto} onValueChange={(value) => setFilters({ ...filters, obs_end_protesto: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value="Endereço Extenso">Endereço Extenso</SelectItem>
                                <SelectItem value="Endereço Incompleto">Endereço Incompleto</SelectItem>
                                <SelectItem value="Endereço Insuficiente">Endereço Insuficiente</SelectItem>
                                <SelectItem value="Endereço Nulo">Endereço Nulo</SelectItem>
                                <SelectItem value="Endereço válido para Protesto">Endereço válido para Protesto</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>


                    <Button type='submit' className='default mt-8'>
                        <Search className="h-4 w-4 mr-2" />
                        Pesquisar
                    </Button>

                    <Button onClick={handleClearFilters} variant="outline" size="default" className="w-full sm:w-auto mt-8">
                        <X className="h-4 w-4 mr-2" />
                        Remover filtros
                    </Button>
                </form>


                <div className="flex gap-4 mt-4">

                    <Button onClick={() => fetchProtestos(page, 'csv')} variant='default'>
                        <GrDocumentExcel className="h-4 w-4 mr-2" />
                        Baixar Planilha
                    </Button>
                </div>



                <div className="flex justify-start mt-2">
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
                        <div className="text-sm mt-2 text-gray-600">
                            Página {page} de {totalPages} ({totalItems} linhas no total)
                        </div>
                    </Pagination>
                </div>

            </div>

            <div className='border rounded-md overflow-x-auto mt-4 max-w-full'>
                {loading ? (
                    <div className="flex justify-center h-screen mt-10">
                        <GridLoader size={16} color="#6b25c7" />
                    </div>
                ) : (
                    <>
                        {error ? (
                            <div className='text-red-500 text-center'>{error}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='w-[64px]'></TableHead>

                                            <TableHead>CDA</TableHead>
                                            <TableHead>Valor CDA Atualizada</TableHead>
                                            <TableHead>Status SAJ</TableHead>
                                            <TableHead>Último Histórico</TableHead>
                                            <TableHead>Data Último Histórico</TableHead>
                                            <TableHead >Origem da Dívida</TableHead>
                                            <TableHead>Data Inscrição</TableHead>
                                            <TableHead>Data Referência</TableHead>
                                            <TableHead>Fundamento</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {protestos.length > 0 ? (
                                            protestos.map((protesto) => (
                                                <TableRow key={protesto.cda}>
                                                    <TableCell>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="xs">
                                                                    <Search className='h-3 w-3' />
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>Contribuinte: {protesto.contribuinte}</DialogTitle>
                                                                    <DialogDescription>Detalhes do Contribuinte</DialogDescription>
                                                                </DialogHeader>

                                                                <div className='space-y-6'>
                                                                    <Table>
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Nº Documento</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.docformatado}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Tipo de Documento</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.tipodoc}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Natureza Jurídica</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.natjuridica}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Porte da Empresa</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.porte}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Situação Cadastral</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.situacaocadastral}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Data Situação Cadastral</TableCell>
                                                                                <TableCell className='flex justify-end'>
                                                                                    {protesto.dtsituacaocadastral
                                                                                        ? (() => {
                                                                                            const data = parse(protesto.dtsituacaocadastral, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", new Date());

                                                                                            if (!isNaN(data.getTime())) {
                                                                                                return format(data, 'dd/MM/yyyy');
                                                                                            } else {
                                                                                                return 'Data inválida';
                                                                                            }
                                                                                        })()
                                                                                        : '-'}
                                                                                </TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Data Início de Atividade</TableCell>
                                                                                <TableCell className='flex justify-end'>
                                                                                    {protesto.dtinicioatividade
                                                                                        ? (() => {
                                                                                            const data = parse(protesto.dtinicioatividade, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", new Date());

                                                                                            if (!isNaN(data.getTime())) {
                                                                                                return format(data, 'dd/MM/yyyy');
                                                                                            } else {
                                                                                                return 'Data inválida';
                                                                                            }
                                                                                        })()
                                                                                        : '-'}
                                                                                </TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Capital Social</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.capitalsocial !== undefined && protesto.capitalsocial !== null
                                                                                    ? Number(protesto.capitalsocial).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                                    : 'R$ 0,00'}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Descrição</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.descricao}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Tipo de Tributo</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.tipotributo}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Valor CDA Original</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.vlcdaoriginal !== undefined && protesto.vlcdaoriginal !== null
                                                                                    ? Number(protesto.vlcdaoriginal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                                    : 'R$ 0,00'}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Multa Atualizada</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.vlmultaatualizada !== undefined && protesto.vlmultaatualizada !== null
                                                                                    ? Number(protesto.vlmultaatualizada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                                    : 'R$ 0,00'}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Juros Atualizados</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.vljurosatualizado !== undefined && protesto.vljurosatualizado !== null
                                                                                    ? Number(protesto.vljurosatualizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                                    : 'R$ 0,00'}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Imposto Atualizado</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.vlimpatualizado !== undefined && protesto.vlimpatualizado !== null
                                                                                    ? Number(protesto.vlimpatualizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                                    : 'R$ 0,00'}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Data Status SAJ</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.dt_status_saj
                                                                                    ? (() => {

                                                                                        const data = new Date(protesto.dt_status_saj.replace(' ', 'T'));
                                                                                        console.log('Data analisada:', data);


                                                                                        if (!isNaN(data.getTime())) {
                                                                                            return format(data, 'dd/MM/yyyy');
                                                                                        } else {
                                                                                            return 'Data inválida';
                                                                                        }
                                                                                    })()
                                                                                    : '-'}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Flag Ajuizada</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.flajuizada}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Situação Protesto</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.sit_protesto}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Parcelamento</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.parcelamento}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Prescrito</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.prescrito}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Endereço Protesto</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.obs_end_protesto}</TableCell>
                                                                            </TableRow>

                                                                        </TableBody>
                                                                    </Table>
                                                                </div>

                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>


                                                    <TableCell className='font-mono font-medium'>{protesto.cda}</TableCell>

                                                    <TableCell className='font-medium'>
                                                        {protesto.vlcdaatualizado !== undefined && protesto.vlcdaatualizado !== null
                                                            ? Number(protesto.vlcdaatualizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                            : 'R$ 0,00'}
                                                    </TableCell>

                                                    <TableCell>{protesto.status_saj}</TableCell>

                                                    <TableCell>{protesto.ulthistorico}</TableCell>

                                                    <TableCell>
                                                        {protesto.dt_ulthist
                                                            ? (() => {
                                                                // Aqui, usamos o construtor Date para analisar a data diretamente
                                                                const data = new Date(protesto.dt_ulthist.replace(' ', 'T')); // Converte para formato ISO
                                                                console.log('Data analisada:', data);

                                                                // Verifica se a data é válida
                                                                if (!isNaN(data.getTime())) {
                                                                    return format(data, 'dd/MM/yyyy'); // Formato desejado
                                                                } else {
                                                                    return 'Data inválida';
                                                                }
                                                            })()
                                                            : '-'}
                                                    </TableCell>

                                                    <TableCell>{protesto.origemdivida}</TableCell>

                                                    <TableCell>
                                                        {protesto.dtinscricao
                                                            ? (() => {
                                                                // Aqui, usamos o construtor Date para analisar a data diretamente
                                                                const data = new Date(protesto.dtinscricao.replace(' ', 'T')); // Converte para formato ISO
                                                                console.log('Data analisada:', data);

                                                                // Verifica se a data é válida
                                                                if (!isNaN(data.getTime())) {
                                                                    return format(data, 'dd/MM/yyyy'); // Formato desejado
                                                                } else {
                                                                    return 'Data inválida';
                                                                }
                                                            })()
                                                            : '-'}
                                                    </TableCell>

                                                    <TableCell>
                                                        {protesto.dtreferencia
                                                            ? (() => {
                                                                // Aqui, usamos o construtor Date para analisar a data diretamente
                                                                const data = new Date(protesto.dtreferencia.replace(' ', 'T')); // Converte para formato ISO
                                                                console.log('Data analisada:', data);

                                                                // Verifica se a data é válida
                                                                if (!isNaN(data.getTime())) {
                                                                    return format(data, 'dd/MM/yyyy'); // Formato desejado
                                                                } else {
                                                                    return 'Data inválida';
                                                                }
                                                            })()
                                                            : '-'}
                                                    </TableCell>





                                                    <TableCell>{protesto.fundamento}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={32} className='text-center font-semibold text-muted-foreground text-lg'>
                                                    <p>Não foi encontrado nenhum registro para o(s) filtro(s) selecionado(s).</p>
                                                    <p>Tente novamente como outros parâmetros.</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                            </div>
                        )}


                    </>
                )}
            </div>
        </>
    );
}

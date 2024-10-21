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
import { Checkbox } from "@/components/ui/checkbox"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';


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
    periodoprotesto: string;
    cdprocesso: string;
    obs_ulthist: string;
    indiciopatrimonial: string;
    qtdveiculos: string;
    qtdsemas: string;
    qtdadepara: string;
    nudocumento: string;
    dtajuizamento: string;
}

export function Ajuizadas() {
    const [protestos, setProtestos] = useState<ProtestoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        nudocumento: '',
        contribuinte: '',
        doc_raiz: '',
        porte: [] as string[],
        situacaocadastral: [] as string[],
        tipotributo: [] as string[],
        vlcdaatualizado_min: '',
        vlcdaatualizado_max: '',
        status_saj: [] as string[],
        parcelamento: '',
        prescrito: [] as string[],
        origemdivida: '',
        ulthistorico: [] as string[],
        indiciopatrimonial: '',
    });



    const token = localStorage.getItem('token');

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';  
        setSortOrder(newSortOrder);  
        setPage(1);  
    };

    const fetchProtestos = async (currentPage = 1, order = 'desc', downloadFormat = '') => {

        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/buscaajuizadas', {
                params: {
                    page: currentPage,
                    per_page: 25,
                    download: downloadFormat,
                    order: order,
                    ...filters,

                    
                    porte: filters.porte.join(","),
                    situacaocadastral: filters.situacaocadastral.join(","),
                    ulthistorico: filters.ulthistorico.join(","),
                    tipotributo: filters.tipotributo.join(","),
                    status_saj: filters.status_saj.join(","),
                    prescrito: filters.prescrito.join(","),
                    
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
        fetchProtestos(page, sortOrder);  
    }, [page, sortOrder]);

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
            porte: [],
            situacaocadastral: [],
            tipotributo: [],
            vlcdaatualizado_min: '',
            vlcdaatualizado_max: '',
            status_saj: [],
            parcelamento: '',
            prescrito: [],
            origemdivida: '',
            ulthistorico: [],
            indiciopatrimonial: '',
            doc_raiz: '',
        });
        setPage(1);
        fetchProtestos(1);
    };

    const handleCheckboxChange = (type: 'porte' | 'situacaocadastral' | 'ulthistorico' | 'tipotributo' | 'status_saj' | 'prescrito', value: string) => {
        setFilters((prevFilters) => {
            const newFilter = prevFilters[type].includes(value)
                ? prevFilters[type].filter((item: string) => item !== value)
                : [...prevFilters[type], value];

            return { ...prevFilters, [type]: newFilter };
        });
    };
    

    const portes = [
        "Empresa de Pequeno Porte",
        "Micro Empresa",
        "Demais",
    ];

    const situacaoCadastral =[
        "Ativa",
        "Baixada",
        "Inapta",
        "Nula",
        "Suspensa",
    ]

    const historicos = [
      "Aguardando ajuizamento",
      "Ajuizada",
      "Cancelada",
      "EXCLUSÃO AJUIZAMENTO ANÁLISE CDAS LEGADO",
      "Exclusão do Ajuizamento",
      "Execução fiscal excluída",
      "Execução fiscal extinta",
      "Inscrita",
      "Kit de ajuizamento excluído",
      "Kit de protesto excluído",
      "Kit de protesto gerado",
      "Protesto pago",
      "Protesto sustado",
      "Processo protesto excluído",
      "Processo protesto extinto",
      "Protestada",
      "Protestada por edital",
      "Quitada",
      "Suspensa",                         

    ]

    const tributos = [
        "Dívida Ativa ICMS",
        "Dívida Ativa IPVA",
        "Dívida Ativa ITCD",
        "Dívida Ativa não tributária",
        "Dívida Ativa TFRH",
        "Dívida Ativa TFRM",       
                                
    ]

    const statusSaj = [
        
        "Inscrita",
        "Exclusão",
        "Ajuizamento",
        "Análise CDAs Legado",
        "Suspensa",
    ]

    const prescritos = [
        "Dentro do prazo prescricional",
        "Possível Prescrição",
        "Prestes a prescrever",
    ]

    
    


    return (
        <>
            <Helmet title="Ajuizadas" />

            <div className='flex flex-col gap-4'>
                <h1 className='text-2xl font-bold text-slate-700'>Ajuizadas</h1>



                <form
                    className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2'
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchProtestos(1);
                    }}
                >
                    <span className='text-sm font-semibold col-span-2 sm:col-span-3 lg:col-span-6'>Filtros:</span>
                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Nº CPF/CNPJ:</Label>
                        <Input
                            placeholder='Informe o número do documento'
                            className='col-span-1'
                            value={filters.nudocumento}
                            onChange={(e) => setFilters({ ...filters, nudocumento: e.target.value })}
                        />

                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>CNPJ Raiz:</Label>
                        <Input
                            placeholder='Informe somente números'
                            className='col-span-1'
                            value={filters.doc_raiz}
                            onChange={(e) => setFilters({ ...filters, doc_raiz: e.target.value })}
                        />

                    </div>
                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Nome Contribuinte:</Label>
                        <Input
                            placeholder='Contribuinte'
                            className='col-span-1'
                            value={filters.contribuinte}
                            onChange={(e) => setFilters({ ...filters, contribuinte: e.target.value })}
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

                        <Label className='font-semibold text-sm text-gray-800'>Valor Mínimo:</Label>

                        <Input
                            placeholder='Informe somente números'
                            className='col-span-1'
                            value={filters.vlcdaatualizado_min}
                            onChange={(e) => setFilters({ ...filters, vlcdaatualizado_min: e.target.value })}
                        />

                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Valor Máximo:</Label>

                        <Input
                            placeholder='informe somente números'
                            className='col-span-1'
                            value={filters.vlcdaatualizado_max}
                            onChange={(e) => setFilters({ ...filters, vlcdaatualizado_max: e.target.value })}
                        />

                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Porte:</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                    <span className='font-normal truncate'>
                                        {filters.porte.length > 0 ? filters.porte.join(", ") : "Escolha uma opção"}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4">
                                {portes.map((option) => (
                                    <DropdownMenuItem key={option} className="flex items-center">
                                        <Checkbox
                                            checked={filters.porte.includes(option)}
                                            onCheckedChange={() => handleCheckboxChange('porte', option)}
                                        />
                                        <Label className="ml-2 font-normal">{option}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='space-y-2'>

                        <Label className='font-semibold text-sm text-gray-800'>Indício Patrimonial:</Label>

                        <Select value={filters.indiciopatrimonial} onValueChange={(value) => setFilters({ ...filters, indiciopatrimonial: value })}>
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
                        <Label className='font-semibold text-sm text-gray-800'>Situação cadastral (RFB):</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                    <span className='font-normal truncate'>
                                        {filters.situacaocadastral.length > 0 ? filters.situacaocadastral.join(", ") : "Escolha uma opção"}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4">
                                {situacaoCadastral.map((option) => (
                                    <DropdownMenuItem key={option} className="flex items-center">
                                        <Checkbox
                                            checked={filters.situacaocadastral.includes(option)}
                                            onCheckedChange={() => handleCheckboxChange('situacaocadastral', option)}
                                        />
                                        <Label className="ml-2 font-normal">{option}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Último histórico:</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                    <span className='font-normal truncate'>{filters.ulthistorico.length > 0 ? filters.ulthistorico.join(", ") : "Escolha uma opção"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4 max-h-48 overflow-y-auto">
                                {historicos.map((option) => (
                                    <DropdownMenuItem key={option} className="flex items-center">
                                        <Checkbox
                                            checked={filters.ulthistorico.includes(option)}
                                            onCheckedChange={() => handleCheckboxChange('ulthistorico', option)}
                                        />
                                        <Label className="ml-2 font-normal">{option}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Tipo de Tributo:</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                    <span className='font-normal truncate'>{filters.tipotributo.length > 0 ? filters.tipotributo.join(", ") : "Escolha uma opção"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4">
                                {tributos.map((option) => (
                                    <DropdownMenuItem key={option} className="flex items-center">
                                        <Checkbox
                                            checked={filters.tipotributo.includes(option)}
                                            onCheckedChange={() => handleCheckboxChange('tipotributo', option)}
                                        />
                                        <Label className="ml-2 font-normal">{option}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    <div className='space-y-2'>
                        <Label className='font-semibold text-sm text-gray-800'>Status (SAJ):</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                    <span className='font-normal truncate'>{filters.status_saj.length > 0 ? filters.status_saj.join(", ") : "Escolha uma opção"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4">
                                {statusSaj.map((option) => (
                                    <DropdownMenuItem key={option} className="flex items-center">
                                        <Checkbox
                                            checked={filters.status_saj.includes(option)}
                                            onCheckedChange={() => handleCheckboxChange('status_saj', option)}
                                        />
                                        <Label className="ml-2 font-normal">{option}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                    <span className='font-normal truncate'>{filters.prescrito.length > 0 ? filters.prescrito.join(", ") : "Escolha uma opção"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4">
                                {prescritos.map((option) => (
                                    <DropdownMenuItem key={option} className="flex items-center">
                                        <Checkbox
                                            checked={filters.prescrito.includes(option)}
                                            onCheckedChange={() => handleCheckboxChange('prescrito', option)}
                                        />
                                        <Label className="ml-2 font-normal">{option}</Label>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                                            <TableHead onClick={toggleSortOrder} className="cursor-pointer">
                                                Valor CDA Atualizada {sortOrder === 'asc' ? '↑' : '↓'}
                                            </TableHead>
                                            <TableHead>Status (SAJ)</TableHead>
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
                                                                <Button variant="default" size="xs">
                                                                    <Search className='h-3 w-3' />
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>Nome Contribuinte: {protesto.contribuinte}</DialogTitle>
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
                                                                                <TableCell className='flex text-justify'>{protesto.descricao}</TableCell>
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
                                                                                <TableCell className='text-muted-foreground'>Ajuizada</TableCell>
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
                                                                                <TableCell className='text-muted-foreground'>Data Ajuizamento</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.dtajuizamento}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Quant. Registros DETRAN</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.qtdveiculos}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Quant. Registros SEMAS</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.qtdsemas}</TableCell>
                                                                            </TableRow>

                                                                            <TableRow>
                                                                                <TableCell className='text-muted-foreground'>Quant. Registros ADEPARA</TableCell>
                                                                                <TableCell className='flex justify-end'>{protesto.qtdadepara}</TableCell>
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
                                                                
                                                                const data = new Date(protesto.dt_ulthist.replace(' ', 'T')); 
                                                                console.log('Data analisada:', data);

                                                                
                                                                if (!isNaN(data.getTime())) {
                                                                    return format(data, 'dd/MM/yyyy'); 
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
                                                                
                                                                const data = new Date(protesto.dtinscricao.replace(' ', 'T')); 
                                                                console.log('Data analisada:', data);

                                                                
                                                                if (!isNaN(data.getTime())) {
                                                                    return format(data, 'dd/MM/yyyy'); 
                                                                } else {
                                                                    return 'Data inválida';
                                                                }
                                                            })()
                                                            : '-'}
                                                    </TableCell>

                                                    <TableCell>
                                                        {protesto.dtreferencia
                                                            ? (() => {
                                                                
                                                                const data = new Date(protesto.dtreferencia.replace(' ', 'T')); 
                                                                console.log('Data analisada:', data);

                                                                
                                                                if (!isNaN(data.getTime())) {
                                                                    return format(data, 'dd/MM/yyyy'); 
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

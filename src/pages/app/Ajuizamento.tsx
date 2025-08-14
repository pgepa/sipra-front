import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, FileText, Search, SquareArrowOutUpRight, User, X } from 'lucide-react';
import { GrDocumentExcel } from "react-icons/gr";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GridLoader from 'react-spinners/GridLoader';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { formatarBooleano, formatarData, formatarMoeda } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface ProtestoData {
    cda: string;
    contribuinte: string;
    docformatado: string;
    docraiz: string;
    tpdoc: string;
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
    statusdebito: string;
    dtstatus: string;
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
    documento: string;
}

export function Ajuizamento() {
    const [protestos, setProtestos] = useState<ProtestoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isCNPJSelected, setIsCNPJSelected] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        documento: '',
        contribuinte: '',
        tpdoc: '',
        docraiz: '',
        porte: [] as string[],
        situacaocadastral: [] as string[],
        tipotributo: [] as string[],
        vlcdaatualizado_min: '',
        vlcdaatualizado_max: '',
        statusdebito: [] as string[],
        parcelamento: '',
        prescrito: [] as string[],
        origemdivida: '',
        indiciopatrimonial: '',
    });



    const token = localStorage.getItem('token');


    const fetchProtestos = async (currentPage = 1, order = 'desc', downloadFormat = '') => {

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


                    porte: filters.porte.join(","),
                    situacaocadastral: filters.situacaocadastral.join(","),
                    tipotributo: filters.tipotributo.join(","),
                    statusdebito: filters.statusdebito.join(","),
                    prescrito: filters.prescrito.join(","),

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
            documento: '',
            contribuinte: '',
            tpdoc: '',
            porte: [],
            situacaocadastral: [],
            tipotributo: [],
            vlcdaatualizado_min: '',
            vlcdaatualizado_max: '',
            statusdebito: [],
            parcelamento: '',
            prescrito: [],
            origemdivida: '',
            indiciopatrimonial: '',
            docraiz: '',
        });
        setPage(1);
        fetchProtestos(1);
        setIsCNPJSelected(false);
    };

    const handleCheckboxChange = (type: 'porte' | 'situacaocadastral' | 'tipotributo' | 'statusdebito' | 'prescrito', value: string) => {
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

    const situacaoCadastral = [
        "Ativa",
        "Baixada",
        "Inapta",
        "Nula",
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

    const statusDebito = [

        "Ativo",
        "Extinto",
        "Suspenso",
        "Cancelado",
    ]

    const prescritos = [
        "Dentro do prazo prescricional",
        "Possível Prescrição",
        "Prestes a prescrever",
    ]

    const handleDocumentTypeChange = (value: string) => {
        setFilters({ ...filters, tpdoc: value });
        setIsCNPJSelected(value === "CNPJ");
    };

    const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex flex-col">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-base text-foreground font-semibold">{value || '-'}</dd>
        </div>
    );


    return (
        <>
            <Helmet title="Ajuizamento" />

            <div className='flex flex-col gap-4'>

                <Card className="shadow-md shadow-slate-400/20 border-slate-200">

                    <CardHeader>
                        <CardTitle className='text-violet-800'>Filtros de Pesquisa</CardTitle>
                        <CardDescription>Utilize os campos abaixo para refinar sua busca de processos.</CardDescription>
                    </CardHeader>

                    <CardContent>

                        <form
                            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-end'
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetchProtestos(1);
                            }}
                        >

                            <div className='space-y-2'>
                                <Label className='font-semibold text-sm text-gray-800'>CPF/CNPJ:</Label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </span>
                                    <Input
                                        placeholder='Buscar por CPF/CNPJ'
                                        className='pl-10 col-span-1'
                                        value={filters.documento}
                                        onChange={(e) => setFilters({ ...filters, documento: e.target.value })}
                                    />

                                </div>


                            </div>

                            <div className='space-y-2'>
                                <Label className='font-semibold text-sm text-gray-800'>CNPJ Raiz:</Label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </span>
                                    <Input
                                        placeholder='Buscar por CNPJ/Raiz'
                                        className='pl-10 col-span-1'
                                        value={filters.docraiz}
                                        onChange={(e) => setFilters({ ...filters, docraiz: e.target.value })}
                                    />
                                </div>

                            </div>
                            <div className='space-y-2'>
                                <Label className='font-semibold text-sm text-gray-800'>Nome Contribuinte:</Label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </span>
                                    <Input
                                        placeholder='Contribuinte'
                                        className='pl-10 col-span-1'
                                        value={filters.contribuinte}
                                        onChange={(e) => setFilters({ ...filters, contribuinte: e.target.value })}
                                    />
                                </div>
                            </div>


                            <div className='space-y-2'>
                                <Label className='font-semibold text-sm text-gray-800'>Origem da Dívida:</Label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </span>
                                    <Input
                                        placeholder='Origem da dívida'
                                        className='pl-10 col-span-1'
                                        value={filters.origemdivida}
                                        onChange={(e) => setFilters({ ...filters, origemdivida: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>

                                <Label className='font-semibold text-sm text-gray-800'>Valor Mínimo:</Label>

                                <div className="relative">

                                    <Input
                                        placeholder='R$ 1.000,00'
                                        type="number"
                                        className='col-span-1'
                                        value={filters.vlcdaatualizado_min}
                                        onChange={(e) => setFilters({ ...filters, vlcdaatualizado_min: e.target.value })}
                                    />
                                </div>


                            </div>

                            <div className='space-y-2'>
                                <Label className='font-semibold text-sm text-gray-800'>Valor Máximo:</Label>

                                <div className="relative">
                                    <Input
                                        placeholder='R$ 50.000,00'
                                        type="number"
                                        className='col-span-1'
                                        value={filters.vlcdaatualizado_max}
                                        onChange={(e) => setFilters({ ...filters, vlcdaatualizado_max: e.target.value })}
                                    />
                                </div>


                            </div>

                            <div className='space-y-2'>

                                <Label className='font-semibold text-sm text-gray-800'>Documento:</Label>
                                <Select value={filters.tpdoc} onValueChange={handleDocumentTypeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Escolha uma opção" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CPF">CPF</SelectItem>
                                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>


                            <div className='space-y-2'>
                                <Label className='font-semibold text-sm text-gray-800'>Porte:</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full text-left flex justify-between items-center" disabled={!isCNPJSelected}>
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
                                <Label className='font-semibold text-sm text-gray-800'>Situação Cadastral (RFB):</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full text-left flex justify-between items-center" disabled={!isCNPJSelected}>
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
                                <Label className='font-semibold text-sm text-gray-800'>Tributo:</Label>
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
                                <Label className='font-semibold text-sm text-gray-800'>Status:</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full text-left flex justify-between items-center">
                                            <span className='font-normal truncate'>{filters.statusdebito.length > 0 ? filters.statusdebito.join(", ") : "Escolha uma opção"}</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="p-4">
                                        {statusDebito.map((option) => (
                                            <DropdownMenuItem key={option} className="flex items-center">
                                                <Checkbox
                                                    checked={filters.statusdebito.includes(option)}
                                                    onCheckedChange={() => handleCheckboxChange('statusdebito', option)}
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
                                <Label className='font-semibold text-sm text-gray-800'>Prescrição Originária:</Label>
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

                    </CardContent>
                </Card>




                <div className="flex gap-4 mt-4">

                    <Button onClick={() => fetchProtestos(page, sortOrder, 'csv')} variant='default'>
                        <GrDocumentExcel className="h-4 w-4 mr-2" />
                        Baixar Planilha
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 space-y-2 sm:space-y-0">
                    <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-blue-300 text-center sm:text-left">
                        {Number(totalItems).toLocaleString('pt-BR')} resultados encontrados
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <Label className="font-semibold text-sm text-gray-800 dark:text-white text-center sm:text-left">Ordenação:</Label>
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')} >
                            <SelectTrigger className="w-full sm:w-auto">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Maior Valor</SelectItem>
                                <SelectItem value="asc">Menor Valor</SelectItem>
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

            {!loading && (!protestos || protestos.length === 0) && (
                <div className='text-xl items-center flex flex-col font-semibold text-justify mt-4 text-muted-foreground bg-white py-20 rounded-lg shadow-md'>

                    <FileText className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">Nenhum resultado encontrado</h3>
                    <p className="mt-1 text-sm text-slate-500">Tente ajustar os filtros para encontrar o que procura.</p>

                    <p>{error}</p>

                </div>
            )}

            {protestos.map((protesto, index) => (
                <Card key={`${protesto}-${index}`} className='shadow-md shadow-slate-400/20 mt-4'>
                    <CardHeader className="flex-items-center flex-row justify-between space-y-0 pb-4">

                        <div>
                            <CardTitle className="text-lg text-violet-600 dark:text-blue-300">
                                {protesto.contribuinte} - {protesto.docformatado}
                            </CardTitle>
                            <CardDescription className='flex gap-2'>
                                <FileText className="h-4 w-4" />
                                CDA: {protesto.cda}
                            </CardDescription>

                        </div>

                        <div>
                            <Label className='mr-2 text-slate-500'>Status Débito:</Label>
                            <Badge variant={protesto.statusdebito === 'Ativo' ? 'default' : 'secondary'}
                                className={protesto.statusdebito === 'Ativo' ? 'bg-green-100 text-green-800 border-green-200 hover:text-white' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                                {protesto.statusdebito}
                            </Badge>
                        </div>

                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex items-center gap-3 text-md text-slate-700">
                            <Briefcase className="h-5 w-5 text-slate-400" />
                            Origem da Dívida: {protesto.origemdivida}
                        </div>

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

                                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
                                    <DialogHeader className="pt-6 px-6">
                                        <div className="flex items-center gap-4">
                                            {protesto.tpdoc === 'CNPJ'
                                                ? <Building2 className="h-8 w-8 text-primary" />
                                                : <User className="h-8 w-8 text-primary" />
                                            }
                                            <div>
                                                <DialogTitle className='text-2xl font-bold text-foreground'>
                                                    {protesto.contribuinte}
                                                </DialogTitle>
                                                <DialogDescription className="text-base">
                                                    {protesto.docformatado}
                                                </DialogDescription>
                                            </div>
                                        </div>
                                    </DialogHeader>

                                    <div className="px-6 pb-6 space-y-8">

                                        <section>
                                            <h2 className="text-lg font-semibold text-primary mb-3 pb-2 border-b">Identificação</h2>
                                            <dl className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
                                                <InfoItem label="Natureza Jurídica" value={protesto.natjuridica} />
                                                <InfoItem label="Porte da Empresa" value={protesto.porte} />
                                                <InfoItem label="Tipo de Tributo" value={protesto.tipotributo} />
                                                <InfoItem label="Tipo de Documento" value={protesto.tpdoc} />                                               
                                                
                                            </dl>
                                        </section>
                                        <section>
                                            <h2 className="text-lg font-semibold text-primary mb-3 pb-2 border-b">Valores (R$)</h2>
                                            <dl className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
                                                <InfoItem label="Capital Social" value={formatarMoeda(protesto.capitalsocial)} />
                                                <InfoItem label="CDA Original" value={formatarMoeda(protesto.vlcdaoriginal)} />
                                                <InfoItem label="Multa Atualizada" value={formatarMoeda(protesto.vlmultaatualizada)} />
                                                <InfoItem label="Juros Atualizados" value={formatarMoeda(protesto.vljurosatualizado)} />
                                                <InfoItem label="Imposto Atualizado" value={formatarMoeda(protesto.vlimpatualizado)} />
                                                <InfoItem label="CDA Atualizada" value={formatarMoeda(protesto.vlcdaatualizado)} />
                                            </dl>
                                        </section>
                                        <section>
                                            <h2 className="text-lg font-semibold text-primary mb-3 pb-2 border-b">Situação e Prazos</h2>
                                            <dl className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
                                                <InfoItem label="Situação Cadastral" value={protesto.situacaocadastral} />
                                                <InfoItem label="Data Sit. Cadastral" value={formatarData(protesto.dtsituacaocadastral)} />
                                                <InfoItem label="Início da Atividade" value={formatarData(protesto.dtinicioatividade)} />
                                                <InfoItem label="Data de Inscrição" value={formatarData(protesto.dtinscricao)} />
                                                <InfoItem label="Ajuizada" value={formatarBooleano(protesto.flajuizada)} />
                                                <InfoItem label="Situação Protesto" value={protesto.sit_protesto} />
                                                <InfoItem label="Parcelamento" value={formatarBooleano(protesto.parcelamento)} />
                                                <InfoItem label="Prescrito" value={protesto.prescrito} />
                                                <InfoItem label="Data Status" value={formatarData(protesto.dtstatus)} />
                                                <InfoItem label="Data Referência" value={formatarData(protesto.dtreferencia)} />
                                                <InfoItem label="Endereço Protesto" value={protesto.obs_end_protesto} />
                                            </dl>
                                        </section>
                                         <section>
                                            <h2 className="text-lg font-semibold text-primary mb-3 pb-2 border-b">Indicadores Patrimoniais</h2>
                                            <dl className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
                                               <InfoItem label="Registros DETRAN" value={protesto.qtdveiculos} />
                                                <InfoItem label="Registros SEMAS" value={protesto.qtdsemas} />
                                                <InfoItem label="Registros ADEPARÁ" value={protesto.qtdadepara} />

                                            </dl>
                                        </section>
                                        <section>
                                            <h2 className="text-lg font-semibold text-primary mb-3 pb-2 border-b">Detalhes Protesto</h2>
                                            <dl className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
                                                <InfoItem label="Descrição" value={protesto.descricao} />
                                                <InfoItem label="Fundamento" value={protesto.fundamento} />
                                                <InfoItem label="Origem da Dívida" value={protesto.origemdivida} />

                                            </dl>
                                        </section>

                                    </div>

                                </DialogContent>
                            </Dialog>



                        </div>

                        <div className="relative flex flex-row items-center justify-center gap-2 w-full sm:w-auto">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="xs" className='flex gap-2 text-indigo-800 hover:text-indigo-700 hover:bg-indigo-200/20 w-full sm:w-auto'>

                                        <SquareArrowOutUpRight className="h-4 w-4" />

                                        Valor CDA: {protesto.vlcdaatualizado !== undefined && protesto.vlcdaatualizado !== null
                                            ? Number(protesto.vlcdaatualizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                            : 'R$ 0,00'}
                                    </Button>

                                </DialogTrigger>



                                <DialogContent className="max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className='text-indigo-600 text-center text-xl'> Valor da CDA - {protesto.cda}</DialogTitle>

                                    </DialogHeader>

                                    <div className='space-y-6'>
                                        <Table>
                                            <TableBody>

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
                                                    <TableCell className='text-muted-foreground'>Valor da CDA atualizado</TableCell>
                                                    <TableCell className='flex justify-end text-indigo-700 font-semibold'>{protesto.vlcdaatualizado !== undefined && protesto.vlcdaatualizado !== null
                                                        ? Number(protesto.vlcdaatualizado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                        : 'R$ 0,00'}</TableCell>
                                                </TableRow>






                                            </TableBody>
                                        </Table>
                                    </div>

                                </DialogContent>
                            </Dialog>



                        </div>


                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-blue-200/20 text-blue-800 w-full sm:w-auto cursor-default'>

                                {protesto.tipotributo}

                            </Button>


                        </div>
                        <div className="relative flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" size="xs" className='flex gap-2 bg-violet-200/20 text-violet-800 w-full sm:w-auto cursor-default'>
                                Referência: {formatarData(protesto.dtreferencia)}
                            </Button>

                        </div>


                    </CardFooter>
                </Card>
            ))}

            <div className="flex justify-start mt-3 mb-2">
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
                        Página {page} de {totalPages} ({totalItems} total de resultados)
                    </div>
                </Pagination>
            </div>
        </>
    );
}

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

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
    });

    const token = localStorage.getItem('token');

    const fetchProtestos = async (currentPage = 1) => {

        try {
            setLoading(true);
            setError(null); // Limpa o erro ao iniciar uma nova busca
            const response = await api.get('/buscaprotesto', {
                params: { page: currentPage, per_page: 25, ...filters },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setProtestos(response.data.data);
            setTotalItems(response.data.total_items);
            setTotalPages(Math.ceil(response.data.total_items / 25));


        } catch (error) {
            console.error('Erro ao buscar dados de protestos:', error);
            setProtestos([]);
            // Exibe o erro após um atraso de 2 segundos
            setTimeout(() => {
                setError('Erro ao buscar dados de protestos. Tente novamente mais tarde.');
            }, 2000);
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
        });
        setPage(1); // Reinicia a paginação para a primeira página
        fetchProtestos(1); // Refaz a busca com os filtros limpos
    };
    

    return (
        <>
            <Helmet title="Protesto" />

            <div className='flex flex-col gap-4'>
                <h1 className='text-2xl font-bold text-slate-700'>Protesto</h1>



                <form
                    className='flex items-center gap-2 mt-2'
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchProtestos(1);
                    }}
                >
                    <span className='text-sm font-semibold'>Filtros:</span>
                    <Input
                        placeholder='Nº Documento'
                        className='w-[200px]'
                        value={filters.nudocumento}
                        onChange={(e) => setFilters({ ...filters, nudocumento: e.target.value })}
                    />
                    <Input
                        placeholder='Contribuinte'
                        className='w-[320px]'
                        value={filters.contribuinte}
                        onChange={(e) => setFilters({ ...filters, contribuinte: e.target.value })}
                    />
                    <Input
                        placeholder='Fundamento'
                        className='w-[320px]'
                        value={filters.fundamento}
                        onChange={(e) => setFilters({ ...filters, fundamento: e.target.value })}
                    />


                    <Select value={filters.tipodoc} onValueChange={(value) => setFilters({ ...filters, tipodoc: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="CPF ">CPF</SelectItem>
                            <SelectItem value="CNPJ">CNPJ</SelectItem>

                        </SelectContent>
                    </Select>

                    <Select value={filters.porte} onValueChange={(value) => setFilters({ ...filters, porte: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Porte da Empresa" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="Empresa de Pequeno Porte">Empresa de Pequeno Porte</SelectItem>
                            <SelectItem value="Micro Empresa">Micro Empresa</SelectItem>
                            <SelectItem value="Demais">Demais</SelectItem>

                        </SelectContent>
                    </Select>

                    <Select value={filters.situacaocadastral} onValueChange={(value) => setFilters({ ...filters, situacaocadastral: value })}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Situação Cadastral RFB" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="Ativa">Ativa</SelectItem>
                            <SelectItem value="Baixada">Baixada</SelectItem>
                            <SelectItem value="Inapta">Inapta</SelectItem>
                            <SelectItem value="Nula">Nula</SelectItem>
                            <SelectItem value="Suspensa">Suspensa</SelectItem>

                        </SelectContent>
                    </Select>

                    <Select value={filters.tipotributo} onValueChange={(value) => setFilters({ ...filters, tipotributo: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Tipo de Atributo" />
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

                    <Select value={filters.status_saj} onValueChange={(value) => setFilters({ ...filters, status_saj: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status SAJ" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                            <SelectItem value="Exclusão">Exclusão</SelectItem>
                            <SelectItem value="Ajuizamento">Ajuizamento</SelectItem>
                            <SelectItem value="Análise CDAs Legado">Análise CDAs Legado</SelectItem>
                            <SelectItem value="Quitada">Quitada</SelectItem>
                            <SelectItem value="Suspensa">Suspensa</SelectItem>

                        </SelectContent>
                    </Select>

                    <Select value={filters.flajuizada} onValueChange={(value) => setFilters({ ...filters, flajuizada: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Flag Ajuizada" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="S">SIM</SelectItem>
                            <SelectItem value="N">NÃO</SelectItem>
                            
                        </SelectContent>
                    </Select>

                    <Select value={filters.parcelamento} onValueChange={(value) => setFilters({ ...filters, parcelamento: value })}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Parcelamento" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="S">SIM</SelectItem>
                            <SelectItem value="N">NÃO</SelectItem>
                            
                        </SelectContent>
                    </Select>

                    <Select value={filters.prescrito} onValueChange={(value) => setFilters({ ...filters, prescrito: value })}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Prescrito" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="Dentro do prazo prescricional">Dentro do prazo prescricional</SelectItem>
                            <SelectItem value="Possível Prescrição">Possível Prescrição</SelectItem>
                            <SelectItem value="Prestes a prescrever">Prestes a prescrever</SelectItem>
                            
                        </SelectContent>
                    </Select>

                    <Select value={filters.obs_end_protesto} onValueChange={(value) => setFilters({ ...filters, obs_end_protesto: value })}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Endereço Protesto" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="Endereço Extenso">Endereço Extenso</SelectItem>
                            <SelectItem value="Endereço Incompleto">Endereço Incompleto</SelectItem>
                            <SelectItem value="Endereço Insuficiente">Prestes a prescrever</SelectItem>
                            <SelectItem value="Endereço Nulo">Endereço Nulo</SelectItem>
                            <SelectItem value="Endereço válido para Protesto">Endereço válido para Protesto</SelectItem>
                            
                        </SelectContent>
                    </Select>




                    <Button type='submit' className='default'>
                        <Search className="h-4 w-4 mr-2" />
                        Pesquisar
                    </Button>

                    <Button onClick={handleClearFilters} variant="outline" size="default" className="w-full sm:w-auto">
                        <X className="h-4 w-4 mr-2" />
                        Remover filtros
                    </Button>
                </form>

                {/* Paginação alinhada ao início */}

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

            <div className='border rounded-md overflow-x-auto mt-4'>
                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <>
                        {error ? (
                            <div className='text-red-500 text-center'>{error}</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='min-w-[180px]'>Nº Documento</TableHead>
                                        <TableHead className='min-w-[320px]'>Contribuinte</TableHead>
                                        <TableHead className='min-w-[160px]'>Tipo de Documento</TableHead>
                                        <TableHead className='min-w-[180px]'>Natureza Jurídica</TableHead>
                                        <TableHead className='min-w-[180px]'>Porte da Empresa</TableHead>
                                        <TableHead className='min-w-[160px]'>Situação Cadastral</TableHead>
                                        <TableHead className='min-w-[180px]'>Data Situação Cadastral</TableHead>
                                        <TableHead className='min-w-[180px]'>Data Início de Atividade</TableHead>
                                        <TableHead className='min-w-[160px]'>Capital Social</TableHead>
                                        <TableHead className='min-w-[320px]'>Descrição</TableHead>
                                        <TableHead className='min-w-[160px]'>CDA</TableHead>
                                        <TableHead className='min-w-[160px]'>Data Inscrição</TableHead>
                                        <TableHead className='min-w-[160px]'>Data Referência</TableHead>
                                        <TableHead className='min-w-[160px]'>Tipo de Tributo</TableHead>
                                        <TableHead className='min-w-[160px]'>Origem da Dívida</TableHead>
                                        <TableHead className='min-w-[160px]'>Valor CDA Original</TableHead>
                                        <TableHead className='min-w-[160px]'>Multa Atualizada</TableHead>
                                        <TableHead className='min-w-[160px]'>Juros Atualizados</TableHead>
                                        <TableHead className='min-w-[160px]'>Valor IMP Atualizado</TableHead>
                                        <TableHead className='min-w-[160px]'>Valor CDA Atualizada</TableHead>
                                        <TableHead className='min-w-[160px]'>Status SAJ</TableHead>
                                        <TableHead className='min-w-[160px]'>Data Status SAJ</TableHead>
                                        <TableHead className='min-w-[160px]'>Último Histórico</TableHead>
                                        <TableHead className='min-w-[160px]'>Data Último Histórico</TableHead>
                                        <TableHead className='min-w-[120px]'>Flag Ajuizada</TableHead>
                                        <TableHead className='min-w-[160px]'>Sit Protesto</TableHead>
                                        <TableHead className='min-w-[120px]'>Parcelamento</TableHead>
                                        <TableHead className='min-w-[160px]'>Prescrito</TableHead>
                                        <TableHead className='min-w-[220px]'>Endereço Protesto</TableHead>
                                        <TableHead className='min-w-[320px]'>Fundamento</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {protestos.length > 0 ? (
                                        protestos.map((protesto) => (
                                            <TableRow key={protesto.cda}>
                                                <TableCell>{protesto.docformatado}</TableCell>
                                                <TableCell>{protesto.contribuinte}</TableCell>
                                                <TableCell>{protesto.tipodoc}</TableCell>
                                                <TableCell>{protesto.natjuridica}</TableCell>
                                                <TableCell>{protesto.porte}</TableCell>
                                                <TableCell>{protesto.situacaocadastral}</TableCell>
                                                <TableCell>{protesto.dtsituacaocadastral}</TableCell>
                                                <TableCell>{protesto.dtinicioatividade}</TableCell>
                                                <TableCell>{protesto.capitalsocial}</TableCell>
                                                <TableCell>{protesto.descricao}</TableCell>
                                                <TableCell>{protesto.cda}</TableCell>
                                                <TableCell>{protesto.dtinscricao}</TableCell>
                                                <TableCell>{protesto.dtreferencia}</TableCell>
                                                <TableCell>{protesto.tipotributo}</TableCell>
                                                <TableCell>{protesto.origemdivida}</TableCell>
                                                <TableCell>{protesto.vlcdaoriginal}</TableCell>
                                                <TableCell>{protesto.vlmultaatualizada}</TableCell>
                                                <TableCell>{protesto.vljurosatualizado}</TableCell>
                                                <TableCell>{protesto.vlimpatualizado}</TableCell>
                                                <TableCell>{protesto.vlcdaatualizado}</TableCell>
                                                <TableCell>{protesto.status_saj}</TableCell>
                                                <TableCell>{protesto.dt_status_saj}</TableCell>
                                                <TableCell>{protesto.ulthistorico}</TableCell>
                                                <TableCell>{protesto.dt_ulthist}</TableCell>
                                                <TableCell>{protesto.flajuizada}</TableCell>
                                                <TableCell>{protesto.sit_protesto}</TableCell>
                                                <TableCell>{protesto.parcelamento}</TableCell>
                                                <TableCell>{protesto.prescrito}</TableCell>
                                                <TableCell>{protesto.obs_end_protesto}</TableCell>
                                                <TableCell>{protesto.fundamento}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={32} className='text-center'>
                                                Nenhum protesto encontrado
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}


                    </>
                )}
            </div>
        </>
    );
}

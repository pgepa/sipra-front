import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';

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


            setProtestos( response.data.data); 
            setTotalPages(response.data.totalPages || 1);

            
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
                        className='w-[320px]'
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
                        placeholder='Tipo de Documento'
                        className='w-[320px]'
                        value={filters.tipodoc}
                        onChange={(e) => setFilters({ ...filters, tipodoc: e.target.value })}
                    />
                    <button type='submit' className='btn-primary'>Buscar</button>
                </form>
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
                                        <TableHead className='min-w-[160px]'>Contribuinte</TableHead>
                                        <TableHead className='min-w-[200px]'>Tipo de Documento</TableHead>
                                        <TableHead className='min-w-[180px]'>Natureza Jurídica</TableHead>
                                        <TableHead className='min-w-[180px]'>Porte da Empresa</TableHead>
                                        <TableHead className='min-w-[180px]'>Situação Cadastral</TableHead>
                                        <TableHead className='min-w-[180px]'>Data Situação Cadastral</TableHead>
                                        <TableHead className='min-w-[180px]'>Data Início de Atividade</TableHead>
                                        <TableHead className='min-w-[160px]'>Capital Social</TableHead>
                                        <TableHead className='min-w-[180px]'>Descrição</TableHead>
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
                                        <TableHead className='min-w-[160px]'>Flag Ajuizada</TableHead>
                                        <TableHead className='min-w-[160px]'>Sit Protesto</TableHead>
                                        <TableHead className='min-w-[160px]'>Parcelamento</TableHead>
                                        <TableHead className='min-w-[160px]'>Prescrito</TableHead>
                                        <TableHead className='min-w-[160px]'>Observação End Protesto</TableHead>
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

                        {/* Paginação */}
                        <div className='flex justify-center mt-4'>
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className='btn-secondary mx-2'
                            >
                                Anterior
                            </button>
                            <span className='mx-2'>
                                Página {page} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className='btn-secondary mx-2'
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

import React, { useState } from 'react';
import { api } from '@/lib/axios';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { AiFillFilePdf } from 'react-icons/ai';

interface DadosCadastrais {
    docformatado: string;
    razaosocial: string;
    porte: string;
    natjuridica: string;
    descricao: string;
    dtinicioatividade: string;
    capitalsocial: string;
    situacaocadastral: string;
    dtsituacaocadastral: string;
    endereco: string;
    complemento: string;
    bairro: string;
    cep: string;
    uf: string;
    email: string;
    ddd: string;
    telefone: string;
    jucepa_situacao: string;
    jucepa_status: string;

}

interface QuadroSocietario {
    nr_cgc: string;
    razaosocial: string;
    no_pessoa: string;
    tiposocio: string;
    nr_docsocio: string;
    no_vinculo: string;
    dt_entrada_sociedade: string;
    dt_saida_sociedade: string;
    statussociedade: string;
}

interface Debitos {
    documento: string;
    qtdcdas: string;
    somavlcdas: string;
    qtdconsolidado: string;
    vlconsolidado: string;
    qtdprazoprescr: string;
    qtdprescricao: string;
    qtdprestesprescr: string;

}

interface ParticipacaoProcessos {
    nudocformatado: string;
    tpparte: string;
    processosaj: string;
    numjudicial: string;
    classe: string;
    assunto: string;
    comarca: string;
    vara: string;
}

interface Detran {
    placa: string;
    renavam: string;
    docproprietario: string;
    proprietario: string;
    docarrendatario: string;
    arrendatario: string;
    marcamodelo: string;
    anomodelo: string;
    procedencia: string;
    licenciamento: string;
    ocorr_policial: string;
    imped_judicial_admin: string;
    proprietarioanterior: string;
}

interface Semas {
    docproprietario: string;
    nomeproprietario: string;
    nomepropriedade: string;
    municipio: string;
    areatotal: string;
    situacao: string;
    no_car: string;
}

interface Adepara {
    docprodutor: string;
    nomeprodutor: string;
    nomepropriedade: string;
    municipio: string;
    aretotal: string;
    areadepastocultivado: string;
    bov_total: string;
}

interface Anac {
    anofabricacao: string;
    docbruto: string;
    docproprietario: string;
    ds_gravame: string;
    marcamodelo: string;
    nr_assentos: string;
    proprietario: string;
    sg_uf: string;

}


interface PessoaJuridicaData {
    cnpj: string;
    vwcargaveiculos: Detran[];
    vwdebitos: Debitos[];
    vwrfbjucepa: DadosCadastrais[];
    vwjucepasocios: QuadroSocietario[];
    vwpartesprocesso: ParticipacaoProcessos[];
    vwcarsemas: Semas[];
    vwadepara: Adepara[];
    anac: Anac[];
}




export const ConsultaPessoaJuridica: React.FC = () => {
    const [data, setData] = useState<{ cnpj: string; data: PessoaJuridicaData }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ cnpj: '', doc_raiz: '' });
    const [searched, setSearched] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: { [key: string]: boolean } }>({});




    const toggleSection = (cnpj: string, section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [cnpj]: {
                ...prev[cnpj],
                [section]: !prev[cnpj]?.[section],
            },
        }));
    };


    const handleDownloadPdf = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token de autenticação não encontrado!');
            return;
        }

        setLoading(true);

        api.get('/indiciopatrimonial', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cnpj: filters.cnpj || undefined,
                doc_raiz: filters.doc_raiz || undefined,
                download: 'pdf',
            },
            responseType: 'blob',
        })
            .then((response) => {

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Indício Patrimonial_${filters.cnpj || filters.doc_raiz}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Erro ao fazer download do PDF:', error);
                alert('Erro ao fazer download do PDF.');
            })
            .finally(() => setLoading(false));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSearched(false);
        setError(null);

        const token = localStorage.getItem('token');

        api.get('/indiciopatrimonial', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cnpj: filters.cnpj || undefined,
                doc_raiz: filters.doc_raiz || undefined,
            }
        })
            .then((response) => {
                console.log(response.data);
                const resultados = Object.entries(response.data).map(([cnpj, data]) => ({
                    cnpj,
                    data: data as PessoaJuridicaData,
                }));


                setData(resultados);
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

    const handleClearFilters = () => {
        setFilters({ cnpj: '', doc_raiz: '' });
        setData(null);
        setSearched(false);
        setError(null);
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };



    return (
        <>
            <Helmet title="Consulta Pessoa Jurídica" />

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-700">Consultar Índicio Patrimonial - CNPJ</h1>

                <form
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2"
                    onSubmit={handleSubmit}
                >
                    <span className="text-sm font-semibold col-span-2 sm:col-span-3 lg:col-span-6">Filtros:</span>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">Nº CNPJ:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                placeholder="Buscar por CNPJ"
                                className='pl-10 col-span-1'
                                value={filters.cnpj}
                                onChange={(e) => setFilters({ ...filters, cnpj: e.target.value })}
                            />
                        </div>

                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">CNPJ/Raiz:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                                placeholder="Buscar por CNPJ/Raiz"
                                className='pl-10 col-span-1'
                                value={filters.doc_raiz}
                                onChange={(e) => setFilters({ ...filters, doc_raiz: e.target.value })}
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
                {loading && (
                    <div className="flex justify-center h-screen mt-10">
                        <GridLoader size={16} color="#6b25c7" />
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center text-red-500">
                        {error}
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

                        {data.map(({ cnpj, data: cnpjData }, index) => (
                            <div key={index} className="mb-8">
                                <div className='flex flex-col gap-4 items-center mt-6'>
                                    <h2 className="text-2xl font-bold text-slate-700 justify-center">{cnpj}</h2>



                                    <div className="w-full mx-auto p-2">

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cnpj, 'dadosCadastrais')}
                                        >
                                            <h2>Dados Cadastrais:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cnpj]?.dadosCadastrais ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cnpj]?.dadosCadastrais && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cnpjData.vwrfbjucepa && cnpjData.vwrfbjucepa.length > 0 ? (
                                                    cnpjData.vwrfbjucepa.map((cadastro, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Documento:</span>
                                                                    <span className="text-muted-foreground">{cadastro.docformatado}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Razão Social:</span>
                                                                    <span className="text-muted-foreground">{cadastro.razaosocial}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Porte:</span>
                                                                    <span className="text-muted-foreground">{cadastro.porte}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Natureza Jurídica:</span>
                                                                    <span className="text-muted-foreground">{cadastro.natjuridica}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Descrição:</span>
                                                                    <span className="text-muted-foreground">{cadastro.descricao}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data Início atividade:</span>
                                                                    <span className="text-muted-foreground">{cadastro.dtinicioatividade}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Capital Social:</span>
                                                                    <span className="text-muted-foreground">
                                                                        {Number(cadastro.capitalsocial).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Situação Cadastral:</span>
                                                                    <span className="text-muted-foreground">{cadastro.situacaocadastral}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Data Situação Cadastral:</span>
                                                                    <span className="text-muted-foreground">
                                                                        {cadastro.dtsituacaocadastral}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Endereço:</span>
                                                                    <span className="text-muted-foreground">{cadastro.endereco}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Complemento:</span>
                                                                    <span className="text-muted-foreground">{cadastro.complemento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Bairro:</span>
                                                                    <span className="text-muted-foreground">{cadastro.bairro}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">CEP:</span>
                                                                    <span className="text-muted-foreground">{cadastro.cep}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">UF:</span>
                                                                    <span className="text-muted-foreground">{cadastro.uf}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">E-mail:</span>
                                                                    <span className="text-muted-foreground">{cadastro.email}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Telefone:</span>
                                                                    <span className="text-muted-foreground">({cadastro.ddd}) {cadastro.telefone}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Situação JUCEPA:</span>
                                                                    <span className="text-muted-foreground">{cadastro.jucepa_situacao}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Status JUCEPA:</span>
                                                                    <span className="text-muted-foreground">{cadastro.jucepa_status}</span>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Nenhum dado cadastral encontrado.</div>
                                                )}
                                            </div>

                                        )}


                                        <div>

                                            <div
                                                className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                                onClick={() => toggleSection(cnpj, 'socios')}
                                            >
                                                <h2>Quadro Societário:</h2>
                                                <span className="text-white text-xl">
                                                    {expandedSections[cnpj]?.socios ? '↑' : '↓'}
                                                </span>
                                            </div>

                                            {expandedSections[cnpj]?.socios && (

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                    {cnpjData.vwjucepasocios && cnpjData.vwjucepasocios.length > 0 ? (
                                                        cnpjData.vwjucepasocios.map((socio, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                            >
                                                                <div
                                                                    className="w-2 h-full mr-4 rounded-lg"
                                                                    style={{ backgroundColor: getRandomColor() }}
                                                                />
                                                                <div className="flex flex-wrap gap-4">
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">CNPJ:</span>
                                                                        <span className="text-muted-foreground">{socio.nr_cgc}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Razão Social:</span>
                                                                        <span className="text-muted-foreground">{socio.razaosocial}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Pessoa:</span>
                                                                        <span className="text-muted-foreground">{socio.no_pessoa}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Tipo Sócio:</span>
                                                                        <span className="text-muted-foreground">{socio.tiposocio}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Doc. Sócio:</span>
                                                                        <span className="text-muted-foreground">{socio.nr_docsocio}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Vínculo:</span>
                                                                        <span className="text-muted-foreground">{socio.no_vinculo}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Entrada Sociedade:</span>
                                                                        <span className="text-muted-foreground">{socio.dt_entrada_sociedade}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Saída Sociedade:</span>
                                                                        <span className="text-muted-foreground">{socio.dt_saida_sociedade}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Status Sociedade:</span>
                                                                        <span className="text-muted-foreground">{socio.statussociedade}</span>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div>
                                                            <p className='text-muted-foreground p-4'>Nenhum sócio encontrado.</p>
                                                        </div>
                                                    )}
                                                </div>

                                            )}


                                        </div>

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cnpj, 'debitos')}
                                        >
                                            <h2>Débitos:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cnpj]?.debitos ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cnpj]?.debitos && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cnpjData.vwdebitos && cnpjData.vwdebitos.length > 0 ? (
                                                    cnpjData.vwdebitos.map((debito, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Documento:</span>
                                                                    <span className="text-muted-foreground">{debito.documento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Qtd. CDAs:</span>
                                                                    <span className="text-muted-foreground">{debito.qtdcdas}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Soma Valor CDAs:</span>
                                                                    <span className="text-muted-foreground">

                                                                        {Number(debito.somavlcdas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Qtd. Consolidado:</span>
                                                                    <span className="text-muted-foreground">{debito.qtdconsolidado}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">Valor Consolidado:</span>
                                                                    <span className="text-muted-foreground">
                                                                        {Number(debito.vlconsolidado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">CDAs dentro do prazo prescricional:</span>
                                                                    <span className="text-muted-foreground">{debito.qtdprazoprescr}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">CDAs com provável prescrição:</span>
                                                                    <span className="text-muted-foreground">{debito.qtdprescricao}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-semibold text-slate-700">CDAs prestres a prescever:</span>
                                                                    <span className="text-muted-foreground">{debito.qtdprestesprescr}</span>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <p className='text-muted-foreground p-4'>Nenhum débito encontrado.</p>
                                                    </div>
                                                )}
                                            </div>

                                        )}


                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cnpj, 'partesProcessos')}
                                        >
                                            <h2>Participação em processos:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cnpj]?.partesProcessos ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cnpj]?.partesProcessos && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {cnpjData.vwpartesprocesso && cnpjData.vwpartesprocesso.length > 0 ? (
                                                    cnpjData.vwpartesprocesso.map((processo, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >

                                                            <div
                                                                className="w-2 h-full mr-4 rounded-lg"
                                                                style={{ backgroundColor: getRandomColor() }}
                                                            />

                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Documento:</span>
                                                                    <span className="text-muted-foreground">{processo.nudocformatado}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Tipo Participação:</span>
                                                                    <span className="text-muted-foreground">{processo.tpparte}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Processo:</span>
                                                                    <span className="text-muted-foreground">{processo.processosaj}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Nº Judicial:</span>
                                                                    <span className="text-muted-foreground">{processo.numjudicial}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Classe:</span>
                                                                    <span className="text-muted-foreground">{processo.classe}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Assunto:</span>
                                                                    <span className="text-muted-foreground">{processo.assunto}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Comarca:</span>
                                                                    <span className="text-muted-foreground">{processo.comarca}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Vara Judicial:</span>
                                                                    <span className="text-muted-foreground">{processo.vara}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <p className='text-muted-foreground p-4'>Nenhum processo encontrado.</p>
                                                    </div>
                                                )}
                                            </div>

                                        )}

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cnpj, 'detran')}
                                        >
                                            <h2>DETRAN:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cnpj]?.detran ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cnpj]?.detran && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cnpjData.vwcargaveiculos && cnpjData.vwcargaveiculos.length > 0 ? (
                                                    cnpjData.vwcargaveiculos.map((veiculo, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >
                                                            <div
                                                                className="w-2 h-full mr-4 rounded-lg"
                                                                style={{ backgroundColor: getRandomColor() }}
                                                            />
                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Placa:</span>
                                                                    <span className="text-muted-foreground">{veiculo.placa}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Renavam:</span>
                                                                    <span className="text-muted-foreground">{veiculo.renavam}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Doc. Proprietário:</span>
                                                                    <span className="text-muted-foreground">{veiculo.docproprietario}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Arrendatário:</span>
                                                                    <span className="text-muted-foreground">{veiculo.arrendatario}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Marca/Modelo:</span>
                                                                    <span className="text-muted-foreground">{veiculo.marcamodelo}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Ano Modelo:</span>
                                                                    <span className="text-muted-foreground">{veiculo.anomodelo}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Procedência:</span>
                                                                    <span className="text-muted-foreground">{veiculo.procedencia}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Obs. Licenciamento:</span>
                                                                    <span className="text-muted-foreground">{veiculo.licenciamento}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Ocorrência Policial:</span>
                                                                    <span className="text-muted-foreground">{veiculo.ocorr_policial}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Proprietário Anterior:</span>
                                                                    <span className="text-muted-foreground">{veiculo.proprietarioanterior}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 col-span-1">
                                                                    <span className="font-semibold text-slate-700">Impedimento Judicial/Administrativo:</span>
                                                                    <span className="text-muted-foreground">{veiculo.imped_judicial_admin}</span>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <p className='text-muted-foreground p-4'>Nenhum veículo encontrado.</p>
                                                    </div>
                                                )}
                                            </div>

                                        )}

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cnpj, 'semas')}
                                        >
                                            <h2>SEMAS:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cnpj]?.semas ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cnpj]?.semas && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cnpjData.vwcarsemas && cnpjData.vwcarsemas.length > 0 ? (
                                                    cnpjData.vwcarsemas.map((semas, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >

                                                            <div
                                                                className="w-2 h-full mr-4 rounded-lg"
                                                                style={{ backgroundColor: getRandomColor() }}
                                                            />

                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Documento:</span>
                                                                    <span className="text-muted-foreground">{semas.docproprietario}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Proprietário:</span>
                                                                    <span className="text-muted-foreground">{semas.nomeproprietario}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Propriedade:</span>
                                                                    <span className="text-muted-foreground">{semas.nomepropriedade}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Município:</span>
                                                                    <span className="text-muted-foreground">{semas.municipio}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Área Total:</span>
                                                                    <span className="text-muted-foreground">{semas.areatotal}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Situação:</span>
                                                                    <span className="text-muted-foreground">{semas.situacao}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Nº CAR:</span>
                                                                    <span className="text-muted-foreground">{semas.no_car}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <p className='text-muted-foreground p-4'>Nenhum registro encontrado.</p>
                                                    </div>
                                                )}
                                            </div>

                                        )}

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(cnpj, 'adepara')}
                                        >
                                            <h2>ADEPARA:</h2>
                                            <span className="text-white text-xl">
                                                {expandedSections[cnpj]?.adepara ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {expandedSections[cnpj]?.adepara && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cnpjData.vwadepara && cnpjData.vwadepara.length > 0 ? (
                                                    cnpjData.vwadepara.map((adepara, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >

                                                            <div
                                                                className="w-2 h-full mr-4 rounded-lg"
                                                                style={{ backgroundColor: getRandomColor() }}
                                                            />

                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Documento:</span>
                                                                    <span className="text-muted-foreground">{adepara.docprodutor}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Produtor:</span>
                                                                    <span className="text-muted-foreground">{adepara.nomeprodutor}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Propriedade:</span>
                                                                    <span className="text-muted-foreground">{adepara.nomepropriedade}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Município:</span>
                                                                    <span className="text-muted-foreground">{adepara.municipio}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Área Total:</span>
                                                                    <span className="text-muted-foreground">{adepara.aretotal}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Área Pasto Cultivado:</span>
                                                                    <span className="text-muted-foreground">{adepara.areadepastocultivado}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Qtd. Bovinos:</span>
                                                                    <span className="text-muted-foreground">{adepara.bov_total}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <p className='text-muted-foreground p-4'>Nenhum registro encontrado.</p>
                                                    </div>
                                                )}
                                            </div>

                                        )}

                                        <div>

                                            <div
                                                className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                                onClick={() => toggleSection(cnpj, 'anac')}
                                            >
                                                <h2>ANAC:</h2>
                                                <span className="text-white text-xl">
                                                    {expandedSections[cnpj]?.anac ? '↑' : '↓'}
                                                </span>
                                            </div>

                                            {expandedSections[cnpj]?.anac && (

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                    {cnpjData.anac && cnpjData.anac.length > 0 ? (
                                                        cnpjData.anac.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                            >
                                                                <div
                                                                    className="w-2 h-full mr-4 rounded-lg"
                                                                    style={{ backgroundColor: getRandomColor() }}
                                                                />
                                                                <div className="flex flex-wrap gap-4">
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Proprietário:</span>
                                                                        <span className="text-muted-foreground">{item.proprietario}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Documento:</span>
                                                                        <span className="text-muted-foreground">{item.docproprietario}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Marca/Modelo:</span>
                                                                        <span className="text-muted-foreground">{item.marcamodelo}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Ano de Fabricação:</span>
                                                                        <span className="text-muted-foreground text-center">{item.anofabricacao}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Gravame:</span>
                                                                        <span className="text-muted-foreground">{item.ds_gravame}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">Nº de Assentos:</span>
                                                                        <span className="text-muted-foreground text-center">{item.nr_assentos}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                                                        <span className="font-semibold text-slate-700">UF:</span>
                                                                        <span className="text-muted-foreground">{item.sg_uf}</span>
                                                                    </div>                                                                   


                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div>
                                                            <p className='text-muted-foreground p-4'>Nenhum sócio encontrado.</p>
                                                        </div>
                                                    )}
                                                </div>

                                            )}


                                        </div>


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

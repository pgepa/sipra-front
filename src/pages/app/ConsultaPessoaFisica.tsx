import React, { useState, Dispatch, SetStateAction } from 'react';
import { api } from '@/lib/axios';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { AiFillFilePdf } from 'react-icons/ai';
import { formatarData } from '@/lib/utils';

interface DadosCadastrais {

    endereco: string;
    bairro: string;
    cep: string;
    cidade: string;
    email: string;
    telefone: string;
    pessoa: string;
    documento: string;

}

interface QuadroSocietario {
    nr_docsocio: string;
    no_pessoa: string;
    no_vinculo: string;
    dt_entrada_sociedade: string;
    dt_saida_sociedade: string;
    statussociedade: string;
    nr_cgc: string;
    razaosocial: string;
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
    nudocumento: string;
    tpparte: string;
    processosaj: string;
    numjudicial: string;
    classe: string;
    assuntoinstituicao: string;
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

interface Precatorio {
    credito: string;
    credor: string;
    entidade: string;
    valor: string;
}


interface PessoaFisicaData {
    cpf: string;
    DETRAN: Detran[];
    Debitos: Debitos[];
    DadosCadastrais: DadosCadastrais[];
    QuadroSocietario: QuadroSocietario[];
    ParticipacaoemProcessos: ParticipacaoProcessos[];
    SEMAS: Semas[];
    ADEPARA: Adepara[];
    Precatorio: Precatorio[];
}



export const ConsultaPessoaFisica: React.FC = () => {
    const [data, setData] = useState<{ cpf: string; data: PessoaFisicaData }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSocios, setShowSocios] = useState(false);
    const [showDebitos, setShowDebitos] = useState(false);
    const [showPartesProcessos, setShowPartesProcessos] = useState(false);
    const [showDetran, setShowDetran] = useState(false);
    const [showSemas, setShowSemas] = useState(false);
    const [showAdepara, setShowAdepara] = useState(false);
    const [showPrecatorio, setShowPrecatorio] = useState(false);
    const [showDadosCadastrais, setShowDadosCadastrais] = useState(false);
    const [filters, setFilters] = useState({ cpf: ''});
    const [searched, setSearched] = useState(false);
    


    type ToggleSectionFunction = Dispatch<SetStateAction<boolean>>;

    const toggleSection = (setFunction: ToggleSectionFunction) => {
        setFunction((prev) => !prev);
    };

    const handleDownloadPdf = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token de autenticação não encontrado!');
            return;
        }

        setLoading(true);

        api.get('/indiciopatrimonialcpf', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cpf: filters.cpf || undefined,
                
                download: 'pdf',
            },
            responseType: 'blob',
        })
            .then((response) => {

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Indício Patrimonial_${filters.cpf}.pdf`);
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

        api.get('/indiciopatrimonialcpf', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cpf: filters.cpf || undefined,
            }
        })
            .then((response) => {
                console.log(response.data);
                const resultados = Object.entries(response.data).map(([cpf, data]) => ({
                    cpf,
                    data: data as PessoaFisicaData,
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
        setFilters({ cpf:''});
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
            <Helmet title="Consulta Pessoa Física" />

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-700">Consultar Índicio Patrimonial - CPF</h1>

                <form
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2"
                    onSubmit={handleSubmit}
                >
                    <span className="text-sm font-semibold col-span-2 sm:col-span-3 lg:col-span-6">Filtros:</span>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">CPF:</Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                            <Input
                            placeholder="Buscar por CPF"
                            className='pl-10 col-span-1'
                            value={filters.cpf}
                            onChange={(e) => setFilters({ ...filters, cpf: e.target.value })}
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

                        {data.map(({ cpf, data: cpfData }, index) => (
                            <div key={index} className="mb-8">
                                <div className='flex flex-col gap-4 items-center mt-6'>
                                    <h2 className="text-2xl font-bold text-slate-700 justify-center">{cpf}</h2>



                                    <div className="w-full mx-auto p-2">

                                        <div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(setShowDadosCadastrais)}
                                        >
                                            <h2>Dados Cadastrais:</h2>
                                            <span className="text-white text-xl">
                                                {showDadosCadastrais ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showDadosCadastrais && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cpfData.DadosCadastrais && cpfData.DadosCadastrais.length > 0 ? (
                                                    cpfData.DadosCadastrais.map((cadastro, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Nome do Contribuinte:</span>
                                                                <span className="text-muted-foreground">{cadastro.pessoa}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Documento:</span>
                                                                <span className="text-muted-foreground">{cadastro.documento}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Endereço:</span>
                                                                <span className="text-muted-foreground">{cadastro.endereco}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Bairro:</span>
                                                                <span className="text-muted-foreground">{cadastro.bairro}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Cidade:</span>
                                                                <span className="text-muted-foreground">{cadastro.cidade}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">CEP:</span>
                                                                <span className="text-muted-foreground">{cadastro.cep}</span>
                                                            </div>

                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">E-mail:</span>
                                                                <span className="text-muted-foreground">{cadastro.email}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Telefone:</span>
                                                                <span className="text-muted-foreground">
                                                                    {cadastro.telefone}
                                                                </span>
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
                                                onClick={() => toggleSection(setShowSocios)}
                                            >
                                                <h2>Quadro Societário:</h2>
                                                <span className="text-white text-xl">
                                                    {showSocios ? '↑' : '↓'}
                                                </span>
                                            </div>

                                            {showSocios && (

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                    {cpfData.QuadroSocietario && cpfData.QuadroSocietario.length > 0 ? (
                                                        cpfData.QuadroSocietario.map((socio, index) => (
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
                                                                    <span className="text-muted-foreground">{socio.nr_docsocio}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Pessoa:</span>
                                                                    <span className="text-muted-foreground">{socio.no_pessoa}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Vínculo:</span>
                                                                    <span className="text-muted-foreground">{socio.no_vinculo}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Entrada Sociedade:</span>
                                                                    <span className="text-muted-foreground">{formatarData(socio.dt_entrada_sociedade)}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Saída Sociedade:</span>
                                                                    <span className="text-muted-foreground">{formatarData(socio.dt_saida_sociedade)}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Status Sociedade:</span>
                                                                    <span className="text-muted-foreground">{socio.statussociedade}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">CNPJ:</span>
                                                                    <span className="text-muted-foreground">{socio.nr_cgc}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 min-w-[150px]">
                                                                    <span className="font-semibold text-slate-700">Razão Social:</span>
                                                                    <span className="text-muted-foreground">{socio.razaosocial}</span>
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
                                            onClick={() => toggleSection(setShowDebitos)}
                                        >
                                            <h2>Débitos:</h2>
                                            <span className="text-white text-xl">
                                                {showDebitos ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showDebitos && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cpfData.Debitos && cpfData.Debitos.length > 0 ? (
                                                    cpfData.Debitos.map((debito, index) => (
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
                                            onClick={() => toggleSection(setShowPartesProcessos)}
                                        >
                                            <h2>Participação em processos:</h2>
                                            <span className="text-white text-xl">
                                                {showPartesProcessos ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showPartesProcessos && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {cpfData.ParticipacaoemProcessos && cpfData.ParticipacaoemProcessos.length > 0 ? (
                                                    cpfData.ParticipacaoemProcessos.map((processo, index) => (
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
                                                                <span className="text-muted-foreground">{processo.nudocumento}</span>
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
                                                                <span className="text-muted-foreground">{processo.assuntoinstituicao}</span>
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
                                            onClick={() => toggleSection(setShowDetran)}
                                        >
                                            <h2>DETRAN:</h2>
                                            <span className="text-white text-xl">
                                                {showDetran ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showDetran && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cpfData.DETRAN && cpfData.DETRAN.length > 0 ? (
                                                    cpfData.DETRAN.map((veiculo, index) => (
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
                                                                <span className="font-semibold text-slate-700">Proprietário:</span>
                                                                <span className="text-muted-foreground">{veiculo.proprietario}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 min-w-[150px]">
                                                                <span className="font-semibold text-slate-700">Doc. Arrendatário:</span>
                                                                <span className="text-muted-foreground">{veiculo.docarrendatario}</span>
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
                                            onClick={() => toggleSection(setShowSemas)}
                                        >
                                            <h2>SEMAS:</h2>
                                            <span className="text-white text-xl">
                                                {showSemas ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showSemas && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cpfData.SEMAS && cpfData.SEMAS.length > 0 ? (
                                                    cpfData.SEMAS.map((semas, index) => (
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
                                            onClick={() => toggleSection(setShowAdepara)}
                                        >
                                            <h2>ADEPARA:</h2>
                                            <span className="text-white text-xl">
                                                {showAdepara ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showAdepara && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cpfData.ADEPARA && cpfData.ADEPARA.length > 0 ? (
                                                    cpfData.ADEPARA.map((adepara, index) => (
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

<div
                                            className="flex items-center gap-2 text-lg font-bold mt-4 mb-4 text-white p-3 bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border-b border-gray-200"
                                            onClick={() => toggleSection(setShowPrecatorio)}
                                        >
                                            <h2>Precatório:</h2>
                                            <span className="text-white text-xl">
                                                {showPrecatorio ? '↑' : '↓'}
                                            </span>
                                        </div>

                                        {showPrecatorio && (

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                {cpfData.Precatorio && cpfData.Precatorio.length > 0 ? (
                                                    cpfData.Precatorio.map((precatorios, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                                        >                                                          

                                                            <div className="flex flex-wrap gap-4">
                                                            <div className="flex flex-col gap-1 min-w-[150px]">
                                                                <span className="font-semibold text-slate-700">Credor:</span>
                                                                <span className="text-muted-foreground">{precatorios.credor}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 min-w-[150px]">
                                                                <span className="font-semibold text-slate-700">Crédito:</span>
                                                                <span className="text-muted-foreground">{precatorios.credito}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 min-w-[150px]">
                                                                <span className="font-semibold text-slate-700">Entidade:</span>
                                                                <span className="text-muted-foreground">{precatorios.entidade}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-slate-700">Valor:</span>
                                                                <span className="text-muted-foreground">
                                                                    {Number(precatorios.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                </span>
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

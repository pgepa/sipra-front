import React, { useState } from 'react';
import { api } from '@/lib/axios';
import { Badge } from "@/components/ui/badge";
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

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
    anofabricacao: string;
    anomodelo: string;
    licenciamento: string;
    marcamodelo: string;
    placa: string;
    renavam: string;
    tpveiculo: string;
}


interface PessoaJuridicaData {
    cnpj: string;
    vwcargaveiculos: Detran[];
    vwdebitos: Debitos[];
    vwrfbjucepa: DadosCadastrais[];
    vwjucepasocios: QuadroSocietario[];
    vwpartesprocesso: ParticipacaoProcessos[];
}

export const ConsultaPessoaJuridica: React.FC = () => {
    const [data, setData] = useState<PessoaJuridicaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        cnpj: '',
        doc_raiz: '',
    });
    const [searched, setSearched] = useState(false);
    const [title, setTitle] = useState<string>(''); // Declare o estado para o título

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSearched(false);
        const token = localStorage.getItem('token');

        api.get('/indiciopatrimonial', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                cnpj: filters.cnpj || undefined,
                doc_raiz: filters.doc_raiz || undefined,
            },
        })
            .then((response) => {
                console.log(response.data);
                const cnpjKey = Object.keys(response.data)[0]; // Obtém a chave CNPJ
                const pessoaJuridicaData = response.data[cnpjKey]; // Acessa os dados associados

                setData(pessoaJuridicaData); // Atualiza o estado com os dados
                setLoading(false);
                setSearched(true);
                setTitle(`${cnpjKey}`);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                setSearched(true);
                setError('Ocorreu um erro ao buscar os dados.');
            });
    };

    const handleClearFilters = () => {
        setFilters({
            cnpj: '',
            doc_raiz: '',
        });
        setData(null);
        setSearched(false);
        setTitle('');
    };

    return (
        <>
            <Helmet title="Consulta Pessoa Jurídica" />

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-700">Consulta Índicio Patrimonial - CNPJ</h1>

                <form
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2"
                    onSubmit={handleSubmit}
                >
                    <span className="text-sm font-semibold col-span-2 sm:col-span-3 lg:col-span-6">Filtros:</span>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">Nº CNPJ:</Label>
                        <Input
                            placeholder="Buscar por CNPJ"
                            className="col-span-1"
                            value={filters.cnpj}
                            onChange={(e) => setFilters({ ...filters, cnpj: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-sm text-gray-800">CNPJ/Raiz:</Label>
                        <Input
                            placeholder="Buscar por CNPJ/Raiz"
                            className="col-span-1"
                            value={filters.doc_raiz}
                            onChange={(e) => setFilters({ ...filters, doc_raiz: e.target.value })}
                        />
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
                {!loading && searched && data && (
                    <div className='flex flex-col gap-4 items-center mt-6'>
                        <h2 className="text-2xl font-bold text-slate-700 justify-center">{title}</h2> {/* Exibir título */}
                        <div className="w-full mx-auto p-2">

                            <h2 className="text-xl font-bold mb-4 text-slate-700">Dados Cadastrais:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {data.vwrfbjucepa && data.vwrfbjucepa.length > 0 ? (
                                    data.vwrfbjucepa.map((cadastro, index) => (
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
                                                    <span className="text-muted-foreground">{cadastro.capitalsocial}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Situação Cadastral:</span>
                                                    <span className="text-muted-foreground">{cadastro.situacaocadastral}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Data Situação Cadastral:</span>
                                                    <span className="text-muted-foreground">{cadastro.dtsituacaocadastral}</span>
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

                            <h2 className="text-xl font-bold mb-4 text-slate-700 p-4">Quadro Societário:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {data.vwjucepasocios && data.vwjucepasocios.length > 0 ? (
                                    data.vwjucepasocios.map((socio, index) => (
                                        <div
                                            key={index}
                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">CNPJ:</span>
                                                    <span className="text-muted-foreground">{socio.nr_cgc}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Razão Social:</span>
                                                    <span className="text-muted-foreground">{socio.razaosocial}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Pessoa:</span>
                                                    <span className="text-muted-foreground">{socio.no_pessoa}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Tipo Sócio:</span>
                                                    <span className="text-muted-foreground">{socio.tiposocio}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Doc. Sócio:</span>
                                                    <span className="text-muted-foreground">{socio.nr_docsocio}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Vínculo:</span>
                                                    <span className="text-muted-foreground">{socio.no_vinculo}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Entrada Sociedade:</span>
                                                    <span className="text-muted-foreground">{socio.dt_entrada_sociedade}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Saída Sociedade:</span>
                                                    <span className="text-muted-foreground">{socio.dt_saida_sociedade}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
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

                            <h2 className="text-xl font-bold mb-4 text-slate-700 p-4">Débitos:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {data.vwdebitos && data.vwdebitos.length > 0 ? (
                                    data.vwdebitos.map((debito, index) => (
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
                                                    <span className="text-muted-foreground">{debito.somavlcdas}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Qtd. Consolidado:</span>
                                                    <span className="text-muted-foreground">{debito.qtdconsolidado}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Valor Consolidado:</span>
                                                    <span className="text-muted-foreground">{debito.vlconsolidado}</span>
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

                            <h2 className="text-xl font-bold mb-4 text-slate-700 p-4">Participação em processos:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {data.vwpartesprocesso && data.vwpartesprocesso.length > 0 ? (
                                    data.vwpartesprocesso.map((processo, index) => (
                                        <div
                                            key={index}
                                            className="flex col-span-4 justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Documento:</span>
                                                    <span className="text-muted-foreground">{processo.nudocformatado}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Tipo Participação:</span>
                                                    <span className="text-muted-foreground">{processo.tpparte}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Processo:</span>
                                                    <span className="text-muted-foreground">{processo.processosaj}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Nº Judicial:</span>
                                                    <span className="text-muted-foreground">{processo.numjudicial}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Classe:</span>
                                                    <span className="text-muted-foreground">{processo.classe}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Assunto:</span>
                                                    <span className="text-muted-foreground">{processo.assunto}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Comarca:</span>
                                                    <span className="text-muted-foreground">{processo.comarca}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-700">Vara Judicial:</span>
                                                    <span className="text-muted-foreground">{processo.vara}</span>
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


                            <h2 className="text-xl font-bold p-4 text-slate-700">Veículos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.vwcargaveiculos && data.vwcargaveiculos.length > 0 ? (
                                    data.vwcargaveiculos.map((veiculo, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <span className="text-lg font-semibold flex gap-2 text-gray-800">
                                                    <Badge variant="default" className="text-base">Modelo: {veiculo.marcamodelo}</Badge>
                                                </span>
                                                <span className="text-muted-foreground">Ano Fabricação: {veiculo.anofabricacao}</span>
                                                <span className="text-muted-foreground">Placa: {veiculo.placa}</span>
                                                <span className="text-muted-foreground">Renavam: {veiculo.renavam}</span>
                                                <span className="text-muted-foreground">Licenciamento: {veiculo.licenciamento}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>Nenhum veículo encontrado.</div>
                                )}
                            </div>

                            <h2 className="text-xl font-bold mb-4 mt-8 text-slate-700">Débitos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {data.vwdebitos && data.vwdebitos.length > 0 ? (
                                    data.vwdebitos.map((debito, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b border-gray-200"
                                        >
                                            <div className="flex flex-col gap-2 ">
                                                <span className="text-lg font-semibold flex gap-2 text-gray-800">
                                                    <Badge variant="default" className="text-base">Documento: {debito.documento}</Badge>
                                                </span>
                                                <span className="text-muted-foreground">Quantidade CDAS: {debito.qtdcdas}</span>
                                                <span className="text-muted-foreground">Quantidade Consolidada: {debito.qtdconsolidado}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>Nenhum débito encontrado.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!loading && searched && data === null && (
                    <div className="text-center">Nenhum dado encontrado para os filtros aplicados.</div>
                )}

                {loading && <div className="text-center">Carregando...</div>}

                {error && <div className="text-center text-red-500">{error}</div>}
            </div>
        </>
    );
};

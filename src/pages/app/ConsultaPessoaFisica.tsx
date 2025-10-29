import { useState } from 'react';
import { api } from '@/lib/axios';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import { AiFillFilePdf } from 'react-icons/ai';
import { formatarData } from '@/lib/utils';
import { SearchInput } from '@/components/SearchInput';
import { FilterSection } from '@/components/FilterSection';
import { EmptyState } from '@/components/EmptyState';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { DataCard, DataField } from '@/components/DataCard';

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

export function ConsultaPessoaFisica() {
    const [data, setData] = useState<{ cpf: string; data: PessoaFisicaData }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ cpf: '' });
    const [searched, setSearched] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{
        [key: string]: { [key: string]: boolean };
    }>({});

    const toggleSection = (cpf: string, section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [cpf]: {
                ...prev[cpf],
                [section]: !prev[cpf]?.[section],
            },
        }));
    };

    const getRandomColor = () => {
        const colors = [
            '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b',
            '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleDownloadPdf = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token de autenticação não encontrado!');
            return;
        }

        setLoading(true);
        api
            .get('/indiciopatrimonialcpf', {
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
                link.setAttribute('download', `Indicio_Patrimonial_${filters.cpf}.pdf`);
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

        api
            .get('/indiciopatrimonialcpf', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    cpf: filters.cpf || undefined,
                },
            })
            .then((response) => {
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
        setFilters({ cpf: '' });
        setData(null);
        setSearched(false);
        setError(null);
    };

    return (
        <>
            <Helmet title="Consulta Pessoa Física" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Consultar CPF
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consulte informações patrimoniais de pessoas físicas
                    </p>
                </div>

                {/* Filters Card */}
                <Card className="shadow-lg border-gray-200 dark:border-gray-800">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-violet-700 dark:text-violet-400">
                            Filtros de Pesquisa
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Informe o CPF para consultar
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FilterSection label="CPF">
                                    <SearchInput
                                        placeholder="000.000.000-00"
                                        value={filters.cpf}
                                        onChange={(value) => setFilters({ ...filters, cpf: value })}
                                    />
                                </FilterSection>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    type="submit"
                                    className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700 transition-colors"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Pesquisar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleClearFilters}
                                    variant="outline"
                                    className="flex-1 sm:flex-none"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Limpar Filtros
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <GridLoader size={16} color="#7c3aed" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && searched && !data && <EmptyState error={error} />}

                {/* Results */}
                {searched && data && data.length > 0 && (
                    <div className="space-y-6">
                        {/* Download Button */}
                        <div className="flex justify-end">
                            <Button onClick={handleDownloadPdf} variant="outline" className="gap-2">
                                <AiFillFilePdf className="h-5 w-5 text-rose-600" />
                                Download PDF
                            </Button>
                        </div>

                        {/* Results for each CPF */}
                        {data.map(({ cpf, data: cpfData }, index) => (
                            <Card key={index} className="shadow-lg border-gray-200 dark:border-gray-800">
                                <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950">
                                    <CardTitle className="text-2xl text-violet-700 dark:text-violet-400">
                                        {cpf}
                                    </CardTitle>
                                    {cpfData.DadosCadastrais?.[0] && (
                                        <CardDescription className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                            {cpfData.DadosCadastrais[0].pessoa}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-4 pt-6">
                                    {/* Dados Cadastrais */}
                                    <CollapsibleSection
                                        title="Dados Cadastrais"
                                        isExpanded={expandedSections[cpf]?.dadosCadastrais}
                                        onToggle={() => toggleSection(cpf, 'dadosCadastrais')}
                                        count={cpfData.DadosCadastrais?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.DadosCadastrais && cpfData.DadosCadastrais.length > 0 ? (
                                                cpfData.DadosCadastrais.map((cadastro, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Nome" value={cadastro.pessoa} className="col-span-full" />
                                                            <DataField label="Documento" value={cadastro.documento} />
                                                            <DataField label="Endereço" value={cadastro.endereco} className="col-span-full lg:col-span-2" />
                                                            <DataField label="Bairro" value={cadastro.bairro} />
                                                            <DataField label="Cidade" value={cadastro.cidade} />
                                                            <DataField label="CEP" value={cadastro.cep} />
                                                            <DataField label="E-mail" value={cadastro.email} className="col-span-full lg:col-span-2" />
                                                            <DataField label="Telefone" value={cadastro.telefone} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum dado cadastral encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Quadro Societário */}
                                    <CollapsibleSection
                                        title="Quadro Societário"
                                        isExpanded={expandedSections[cpf]?.socios}
                                        onToggle={() => toggleSection(cpf, 'socios')}
                                        count={cpfData.QuadroSocietario?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.QuadroSocietario && cpfData.QuadroSocietario.length > 0 ? (
                                                cpfData.QuadroSocietario.map((socio, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Documento" value={socio.nr_docsocio} />
                                                            <DataField label="Pessoa" value={socio.no_pessoa} />
                                                            <DataField label="Vínculo" value={socio.no_vinculo} />
                                                            <DataField label="Entrada Sociedade" value={formatarData(socio.dt_entrada_sociedade)} />
                                                            <DataField label="Saída Sociedade" value={formatarData(socio.dt_saida_sociedade)} />
                                                            <DataField label="Status Sociedade" value={socio.statussociedade} />
                                                            <DataField label="CNPJ" value={socio.nr_cgc} />
                                                            <DataField label="Razão Social" value={socio.razaosocial} className="col-span-full" />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum sócio encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Débitos */}
                                    <CollapsibleSection
                                        title="Débitos"
                                        isExpanded={expandedSections[cpf]?.debitos}
                                        onToggle={() => toggleSection(cpf, 'debitos')}
                                        count={cpfData.Debitos?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.Debitos && cpfData.Debitos.length > 0 ? (
                                                cpfData.Debitos.map((debito, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            <DataField label="Documento" value={debito.documento} />
                                                            <DataField label="Qtd. CDAs" value={debito.qtdcdas} />
                                                            <DataField
                                                                label="Soma Valor CDAs"
                                                                value={Number(debito.somavlcdas).toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL',
                                                                })}
                                                            />
                                                            <DataField label="Qtd. Consolidado" value={debito.qtdconsolidado} />
                                                            <DataField
                                                                label="Valor Consolidado"
                                                                value={Number(debito.vlconsolidado).toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL',
                                                                })}
                                                            />
                                                            <DataField label="CDAs no Prazo" value={debito.qtdprazoprescr} />
                                                            <DataField label="CDAs com Prescrição" value={debito.qtdprescricao} />
                                                            <DataField label="CDAs Prestes a Prescrever" value={debito.qtdprestesprescr} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum débito encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Participação em Processos */}
                                    <CollapsibleSection
                                        title="Participação em Processos"
                                        isExpanded={expandedSections[cpf]?.partesProcessos}
                                        onToggle={() => toggleSection(cpf, 'partesProcessos')}
                                        count={cpfData.ParticipacaoemProcessos?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.ParticipacaoemProcessos && cpfData.ParticipacaoemProcessos.length > 0 ? (
                                                cpfData.ParticipacaoemProcessos.map((processo, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Documento" value={processo.nudocumento} />
                                                            <DataField label="Tipo Participação" value={processo.tpparte} />
                                                            <DataField label="Processo" value={processo.processosaj} />
                                                            <DataField label="Nº Judicial" value={processo.numjudicial} />
                                                            <DataField label="Classe" value={processo.classe} />
                                                            <DataField label="Assunto" value={processo.assuntoinstituicao} />
                                                            <DataField label="Comarca" value={processo.comarca} />
                                                            <DataField label="Vara Judicial" value={processo.vara} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum processo encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* DETRAN */}
                                    <CollapsibleSection
                                        title="DETRAN - Veículos"
                                        isExpanded={expandedSections[cpf]?.detran}
                                        onToggle={() => toggleSection(cpf, 'detran')}
                                        count={cpfData.DETRAN?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.DETRAN && cpfData.DETRAN.length > 0 ? (
                                                cpfData.DETRAN.map((veiculo, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                            <DataField label="Placa" value={veiculo.placa} />
                                                            <DataField label="Renavam" value={veiculo.renavam} />
                                                            <DataField label="Doc. Proprietário" value={veiculo.docproprietario} />
                                                            <DataField label="Proprietário" value={veiculo.proprietario} />
                                                            <DataField label="Doc. Arrendatário" value={veiculo.docarrendatario} />
                                                            <DataField label="Arrendatário" value={veiculo.arrendatario} />
                                                            <DataField label="Marca/Modelo" value={veiculo.marcamodelo} />
                                                            <DataField label="Ano Modelo" value={veiculo.anomodelo} />
                                                            <DataField label="Procedência" value={veiculo.procedencia} />
                                                            <DataField label="Licenciamento" value={veiculo.licenciamento} />
                                                            <DataField label="Ocorrência Policial" value={veiculo.ocorr_policial} />
                                                            <DataField label="Proprietário Anterior" value={veiculo.proprietarioanterior} />
                                                            <DataField label="Impedimento Judicial/Admin" value={veiculo.imped_judicial_admin} className="col-span-full" />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum veículo encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* SEMAS */}
                                    <CollapsibleSection
                                        title="SEMAS - Propriedades Rurais"
                                        isExpanded={expandedSections[cpf]?.semas}
                                        onToggle={() => toggleSection(cpf, 'semas')}
                                        count={cpfData.SEMAS?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.SEMAS && cpfData.SEMAS.length > 0 ? (
                                                cpfData.SEMAS.map((semas, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Documento" value={semas.docproprietario} />
                                                            <DataField label="Proprietário" value={semas.nomeproprietario} />
                                                            <DataField label="Propriedade" value={semas.nomepropriedade} />
                                                            <DataField label="Município" value={semas.municipio} />
                                                            <DataField label="Área Total" value={semas.areatotal} />
                                                            <DataField label="Situação" value={semas.situacao} />
                                                            <DataField label="Nº CAR" value={semas.no_car} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum registro encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* ADEPARA */}
                                    <CollapsibleSection
                                        title="ADEPARA - Produção Agropecuária"
                                        isExpanded={expandedSections[cpf]?.adepara}
                                        onToggle={() => toggleSection(cpf, 'adepara')}
                                        count={cpfData.ADEPARA?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.ADEPARA && cpfData.ADEPARA.length > 0 ? (
                                                cpfData.ADEPARA.map((adepara, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Documento" value={adepara.docprodutor} />
                                                            <DataField label="Produtor" value={adepara.nomeprodutor} />
                                                            <DataField label="Propriedade" value={adepara.nomepropriedade} />
                                                            <DataField label="Município" value={adepara.municipio} />
                                                            <DataField label="Área Total" value={adepara.aretotal} />
                                                            <DataField label="Área Pasto Cultivado" value={adepara.areadepastocultivado} />
                                                            <DataField label="Qtd. Bovinos" value={adepara.bov_total} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum registro encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Precatório */}
                                    <CollapsibleSection
                                        title="Precatórios"
                                        isExpanded={expandedSections[cpf]?.precatorio}
                                        onToggle={() => toggleSection(cpf, 'precatorio')}
                                        count={cpfData.Precatorio?.length}
                                    >
                                        <div className="space-y-3">
                                            {cpfData.Precatorio && cpfData.Precatorio.length > 0 ? (
                                                cpfData.Precatorio.map((precatorio, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            <DataField label="Credor" value={precatorio.credor} />
                                                            <DataField label="Crédito" value={precatorio.credito} />
                                                            <DataField label="Entidade" value={precatorio.entidade} />
                                                            <DataField
                                                                label="Valor"
                                                                value={Number(precatorio.valor).toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL',
                                                                })}
                                                            />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum registro encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

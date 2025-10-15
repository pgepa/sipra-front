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

interface Contratos {
    docbruto: string;
    dofornecedor: string;
    dt_assinaturacontrato: string;
    dt_fimvigencia: string;
    dt_iniciovigencia: string;
    formacontratacao: string;
    nomefornecedor: string;
    situacao: string;
    unidadegestora_contratante: string;
    vlcontratado: string;
}

interface Faturamento {
    nudocumento: string;
    observacao: string;
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
    contratos: Contratos[];
    faturamento: Faturamento[];
}

export function ConsultaPessoaJuridica() {
    const [data, setData] = useState<{ cnpj: string; data: PessoaJuridicaData }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ cnpj: '', doc_raiz: '' });
    const [searched, setSearched] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{
        [key: string]: { [key: string]: boolean };
    }>({});

    const toggleSection = (cnpj: string, section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [cnpj]: {
                ...prev[cnpj],
                [section]: !prev[cnpj]?.[section],
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
            .get('/indiciopatrimonial', {
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
                link.setAttribute(
                    'download',
                    `Indicio_Patrimonial_${filters.cnpj || filters.doc_raiz}.pdf`
                );
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
            .get('/indiciopatrimonial', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    cnpj: filters.cnpj || undefined,
                    doc_raiz: filters.doc_raiz || undefined,
                },
            })
            .then((response) => {
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

    return (
        <>
            <Helmet title="Consulta Pessoa Jurídica" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Consulta de Indício Patrimonial - CNPJ
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consulte informações patrimoniais de pessoas jurídicas
                    </p>
                </div>

                {/* Filters Card */}
                <Card className="shadow-lg border-gray-200 dark:border-gray-800">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-violet-700 dark:text-violet-400">
                            Filtros de Pesquisa
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Informe o CNPJ ou CNPJ Raiz para consultar
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FilterSection label="CNPJ">
                                    <SearchInput
                                        placeholder="00.000.000/0000-00"
                                        value={filters.cnpj}
                                        onChange={(value) => setFilters({ ...filters, cnpj: value })}
                                    />
                                </FilterSection>

                                <FilterSection label="CNPJ Raiz">
                                    <SearchInput
                                        placeholder="00.000.000"
                                        value={filters.doc_raiz}
                                        onChange={(value) => setFilters({ ...filters, doc_raiz: value })}
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
                            <Button
                                onClick={handleDownloadPdf}
                                variant="outline"
                                className="gap-2"
                            >
                                <AiFillFilePdf className="h-5 w-5 text-rose-600" />
                                Download PDF
                            </Button>
                        </div>

                        {/* Results for each CNPJ */}
                        {data.map(({ cnpj, data: cnpjData }, index) => (
                            <Card
                                key={index}
                                className="shadow-lg border-gray-200 dark:border-gray-800"
                            >
                                <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950">
                                    <CardTitle className="text-2xl text-violet-700 dark:text-violet-400">
                                        {cnpj}
                                    </CardTitle>
                                    {cnpjData.vwrfbjucepa?.[0] && (
                                        <CardDescription className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                            {cnpjData.vwrfbjucepa[0].razaosocial}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-4 pt-6">
                                    {/* Dados Cadastrais */}
                                    <CollapsibleSection
                                        title="Dados Cadastrais"
                                        isExpanded={expandedSections[cnpj]?.dadosCadastrais}
                                        onToggle={() => toggleSection(cnpj, 'dadosCadastrais')}
                                        count={cnpjData.vwrfbjucepa?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwrfbjucepa && cnpjData.vwrfbjucepa.length > 0 ? (
                                                cnpjData.vwrfbjucepa.map((cadastro, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                            <DataField label="Documento" value={cadastro.docformatado} />
                                                            <DataField label="Razão Social" value={cadastro.razaosocial} />
                                                            <DataField label="Porte" value={cadastro.porte} />
                                                            <DataField label="Natureza Jurídica" value={cadastro.natjuridica} />
                                                            <DataField label="Descrição" value={cadastro.descricao} className="col-span-full" />
                                                            <DataField label="Início Atividade" value={cadastro.dtinicioatividade} />
                                                            <DataField
                                                                label="Capital Social"
                                                                value={Number(cadastro.capitalsocial).toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL',
                                                                })}
                                                            />
                                                            <DataField label="Situação Cadastral" value={cadastro.situacaocadastral} />
                                                            <DataField label="Data Situação" value={cadastro.dtsituacaocadastral} />
                                                            <DataField label="Endereço" value={cadastro.endereco} className="col-span-full lg:col-span-2" />
                                                            <DataField label="Complemento" value={cadastro.complemento} />
                                                            <DataField label="Bairro" value={cadastro.bairro} />
                                                            <DataField label="CEP" value={cadastro.cep} />
                                                            <DataField label="UF" value={cadastro.uf} />
                                                            <DataField label="E-mail" value={cadastro.email} className="col-span-full lg:col-span-2" />
                                                            <DataField label="Telefone" value={`(${cadastro.ddd}) ${cadastro.telefone}`} />
                                                            <DataField label="Situação JUCEPA" value={cadastro.jucepa_situacao} />
                                                            <DataField label="Status JUCEPA" value={cadastro.jucepa_status} />
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
                                        isExpanded={expandedSections[cnpj]?.socios}
                                        onToggle={() => toggleSection(cnpj, 'socios')}
                                        count={cnpjData.vwjucepasocios?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwjucepasocios && cnpjData.vwjucepasocios.length > 0 ? (
                                                cnpjData.vwjucepasocios.map((socio, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="CNPJ" value={socio.nr_cgc} />
                                                            <DataField label="Razão Social" value={socio.razaosocial} />
                                                            <DataField label="Pessoa" value={socio.no_pessoa} />
                                                            <DataField label="Tipo Sócio" value={socio.tiposocio} />
                                                            <DataField label="Doc. Sócio" value={socio.nr_docsocio} />
                                                            <DataField label="Vínculo" value={socio.no_vinculo} />
                                                            <DataField label="Entrada Sociedade" value={formatarData(socio.dt_entrada_sociedade)} />
                                                            <DataField label="Saída Sociedade" value={formatarData(socio.dt_saida_sociedade)} />
                                                            <DataField label="Status Sociedade" value={socio.statussociedade} />
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
                                        isExpanded={expandedSections[cnpj]?.debitos}
                                        onToggle={() => toggleSection(cnpj, 'debitos')}
                                        count={cnpjData.vwdebitos?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwdebitos && cnpjData.vwdebitos.length > 0 ? (
                                                cnpjData.vwdebitos.map((debito, idx) => (
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
                                        isExpanded={expandedSections[cnpj]?.partesProcessos}
                                        onToggle={() => toggleSection(cnpj, 'partesProcessos')}
                                        count={cnpjData.vwpartesprocesso?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwpartesprocesso && cnpjData.vwpartesprocesso.length > 0 ? (
                                                cnpjData.vwpartesprocesso.map((processo, idx) => (
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
                                        isExpanded={expandedSections[cnpj]?.detran}
                                        onToggle={() => toggleSection(cnpj, 'detran')}
                                        count={cnpjData.vwcargaveiculos?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwcargaveiculos && cnpjData.vwcargaveiculos.length > 0 ? (
                                                cnpjData.vwcargaveiculos.map((veiculo, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                            <DataField label="Placa" value={veiculo.placa} />
                                                            <DataField label="Renavam" value={veiculo.renavam} />
                                                            <DataField label="Doc. Proprietário" value={veiculo.docproprietario} />
                                                            <DataField label="Proprietário" value={veiculo.proprietario} />
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
                                        isExpanded={expandedSections[cnpj]?.semas}
                                        onToggle={() => toggleSection(cnpj, 'semas')}
                                        count={cnpjData.vwcarsemas?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwcarsemas && cnpjData.vwcarsemas.length > 0 ? (
                                                cnpjData.vwcarsemas.map((semas, idx) => (
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
                                        isExpanded={expandedSections[cnpj]?.adepara}
                                        onToggle={() => toggleSection(cnpj, 'adepara')}
                                        count={cnpjData.vwadepara?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.vwadepara && cnpjData.vwadepara.length > 0 ? (
                                                cnpjData.vwadepara.map((adepara, idx) => (
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

                                    {/* ANAC */}
                                    <CollapsibleSection
                                        title="ANAC - Aeronaves"
                                        isExpanded={expandedSections[cnpj]?.anac}
                                        onToggle={() => toggleSection(cnpj, 'anac')}
                                        count={cnpjData.anac?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.anac && cnpjData.anac.length > 0 ? (
                                                cnpjData.anac.map((item, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Proprietário" value={item.proprietario} />
                                                            <DataField label="Documento" value={item.docproprietario} />
                                                            <DataField label="Marca/Modelo" value={item.marcamodelo} />
                                                            <DataField label="Ano Fabricação" value={item.anofabricacao} />
                                                            <DataField label="Gravame" value={item.ds_gravame} />
                                                            <DataField label="Nº Assentos" value={item.nr_assentos} />
                                                            <DataField label="UF" value={item.sg_uf} />
                                                        </div>
                                                    </DataCard>
                                                ))
                                            ) : (
                                                <EmptyState title="Nenhum registro encontrado" description="" />
                                            )}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Contratos */}
                                    <CollapsibleSection
                                        title="Contratos Públicos"
                                        isExpanded={expandedSections[cnpj]?.contratos}
                                        onToggle={() => toggleSection(cnpj, 'contratos')}
                                        count={cnpjData.contratos?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.contratos && cnpjData.contratos.length > 0 ? (
                                                cnpjData.contratos.map((contrato, idx) => (
                                                    <DataCard key={idx} colorBar={getRandomColor()}>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <DataField label="Fornecedor" value={contrato.nomefornecedor} />
                                                            <DataField label="Documento" value={contrato.dofornecedor} />
                                                            <DataField label="Contratante" value={contrato.unidadegestora_contratante} className="col-span-full" />
                                                            <DataField label="Assinatura" value={contrato.dt_assinaturacontrato} />
                                                            <DataField label="Início Vigência" value={contrato.dt_iniciovigencia} />
                                                            <DataField label="Fim Vigência" value={contrato.dt_fimvigencia} />
                                                            <DataField label="Forma Contratação" value={contrato.formacontratacao} />
                                                            <DataField label="Situação" value={contrato.situacao} />
                                                            <DataField
                                                                label="Valor Contratado"
                                                                value={Number(contrato.vlcontratado).toLocaleString('pt-BR', {
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

                                    {/* Faturamento */}
                                    <CollapsibleSection
                                        title="Faturamento"
                                        isExpanded={expandedSections[cnpj]?.faturamento}
                                        onToggle={() => toggleSection(cnpj, 'faturamento')}
                                        count={cnpjData.faturamento?.length}
                                    >
                                        <div className="space-y-3">
                                            {cnpjData.faturamento && cnpjData.faturamento.length > 0 ? (
                                                cnpjData.faturamento.map((item, idx) => (
                                                    <DataCard key={idx}>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            <DataField label="Documento" value={item.nudocumento} />
                                                            <DataField label="Observação" value={item.observacao} className="col-span-full" />
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

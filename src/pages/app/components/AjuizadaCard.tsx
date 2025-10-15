import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Building2, User, FileText, Scale, Search, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { formatarData } from '@/lib/utils';
import { AjuizadaData } from '../types/ajuizadas.types';

interface AjuizadaCardProps {
    ajuizada: AjuizadaData;
}

export function AjuizadaCard({ ajuizada }: AjuizadaCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatarMoeda = (valor: string | number | null | undefined): string => {
        const numero = Number(valor);
        if (valor === null || valor === undefined || isNaN(numero)) {
            return 'R$ 0,00';
        }
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatarBooleano = (valor: string | null | undefined): string => {
        if (valor === 'S') return 'Sim';
        if (valor === 'N') return 'Não';
        return valor || '-';
    };

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            Ativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200',
            Extinto: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
            Suspenso: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200',
            Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex flex-col space-y-1">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value || '-'}</dd>
        </div>
    );

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900 rounded-lg">
                            {ajuizada.tpdoc === 'CNPJ' ? (
                                <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            ) : (
                                <User className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {ajuizada.contribuinte}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {ajuizada.tpdoc}: {ajuizada.docformatado}
                            </p>
                            <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>CDA: {ajuizada.cda}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Scale className="h-3 w-3" />
                                    <span>Processo: {ajuizada.numjudicial}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(ajuizada.statusdebito)}>
                            {ajuizada.statusdebito}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Main Info */}
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>Origem: {ajuizada.origemdivida}</span>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InfoItem label="Tipo Tributo" value={ajuizada.tipotributo} />
                            <InfoItem label="Valor CDA Atualizado" value={formatarMoeda(ajuizada.vlcdaatualizado)} />
                            <InfoItem label="Data Referência" value={formatarData(ajuizada.dtreferencia)} />
                            <InfoItem label="Comarca" value={ajuizada.comarca} />
                            <InfoItem label="Classe" value={ajuizada.classe} />
                            <InfoItem label="Juízo" value={ajuizada.juizo} />
                        </dl>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-1 sm:flex-none"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Ver Menos
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Ver Mais
                        </>
                    )}
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700">
                            <Search className="h-4 w-4 mr-2" />
                            Detalhes
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-4">
                                {ajuizada.tpdoc === 'CNPJ' ? (
                                    <Building2 className="h-8 w-8 text-violet-600" />
                                ) : (
                                    <User className="h-8 w-8 text-violet-600" />
                                )}
                                <div>
                                    <DialogTitle className="text-2xl">{ajuizada.contribuinte}</DialogTitle>
                                    <DialogDescription className="text-base">{ajuizada.docformatado}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Identificação
                                </h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem label="Nº Processo Judicial" value={ajuizada.numjudicial} />
                                    <InfoItem label="Natureza Jurídica" value={ajuizada.natjuridica} />
                                    <InfoItem label="Porte da Empresa" value={ajuizada.porte} />
                                    <InfoItem label="Tipo de Tributo" value={ajuizada.tipotributo} />
                                </dl>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Valores (R$)
                                </h4>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="text-muted-foreground">Capital Social</TableCell>
                                            <TableCell className="text-right">{formatarMoeda(ajuizada.capitalsocial)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-muted-foreground">CDA Original</TableCell>
                                            <TableCell className="text-right">{formatarMoeda(ajuizada.vlcdaoriginal)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-muted-foreground">Multa Atualizada</TableCell>
                                            <TableCell className="text-right">{formatarMoeda(ajuizada.vlmultaatualizada)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-muted-foreground">Juros Atualizados</TableCell>
                                            <TableCell className="text-right">{formatarMoeda(ajuizada.vljurosatualizado)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-muted-foreground">Imposto Atualizado</TableCell>
                                            <TableCell className="text-right">{formatarMoeda(ajuizada.vlimpatualizado)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-muted-foreground font-semibold">CDA Atualizada</TableCell>
                                            <TableCell className="text-right font-semibold text-violet-700">
                                                {formatarMoeda(ajuizada.vlcdaatualizado)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Situação e Prazos
                                </h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem label="Situação Cadastral" value={ajuizada.situacaocadastral} />
                                    <InfoItem label="Data Sit. Cadastral" value={formatarData(ajuizada.dtsituacaocadastral)} />
                                    <InfoItem label="Início da Atividade" value={formatarData(ajuizada.dtinicioatividade)} />
                                    <InfoItem label="Data de Inscrição" value={formatarData(ajuizada.dtinscricao)} />
                                    <InfoItem label="Ajuizada" value={formatarBooleano(ajuizada.flajuizada)} />
                                    <InfoItem label="Situação Protesto" value={ajuizada.sit_protesto} />
                                    <InfoItem label="Parcelamento" value={formatarBooleano(ajuizada.parcelamento)} />
                                    <InfoItem label="Prescrito" value={ajuizada.prescrito} />
                                </dl>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Indicadores Patrimoniais
                                </h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem label="Registros DETRAN" value={ajuizada.qtdveiculos} />
                                    <InfoItem label="Registros SEMAS" value={ajuizada.qtdsemas} />
                                    <InfoItem label="Registros ADEPARÁ" value={ajuizada.qtdadepara} />
                                </dl>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Detalhes do Processo
                                </h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem label="Descrição" value={ajuizada.descricao} />
                                    <InfoItem label="Fundamento" value={ajuizada.fundamento} />
                                    <InfoItem label="Origem da Dívida" value={ajuizada.origemdivida} />
                                </dl>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Badge variant="secondary" className="bg-blue-200/20 text-blue-800 cursor-default">
                    {ajuizada.tipotributo}
                </Badge>

                <Badge variant="secondary" className="bg-violet-200/20 text-violet-800 cursor-default">
                    Ref: {formatarData(ajuizada.dtreferencia)}
                </Badge>
            </CardFooter>
        </Card>
    );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, User, FileText, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { formatarBooleano, formatarData, formatarMoeda } from '@/lib/utils';
import { ProtestoData } from '../types/protesto.types';

interface ProtestoCardViewProps {
    protesto: ProtestoData;
}

export function ProtestoCardView({ protesto }: ProtestoCardViewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            Ativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Extinto: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            Suspenso: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
    };

    const getProtestoStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            'Aguardando envio': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'Aguardando recebimento': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
            Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            Devolvido: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            Enviado: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            Gerado: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            Retirado: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            Sustado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
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
                            {protesto.tipodoc === 'CNPJ' ? (
                                <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            ) : (
                                <User className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {protesto.contribuinte}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {protesto.tipodoc}: {protesto.docformatado}
                            </p>
                            {protesto.municipio && protesto.uf && (
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="h-3 w-3" />
                                    <span>{protesto.municipio} - {protesto.uf}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(protesto.statusdebito)}>
                            {protesto.statusdebito}
                        </Badge>
                        <Badge className={getProtestoStatusColor(protesto.sit_protesto)}>
                            {protesto.sit_protesto}
                        </Badge>
                        {protesto.flajuizada === 'S' && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Ajuizada
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Main Info Grid */}
                <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <InfoItem label="CDA" value={protesto.cda} />
                    <InfoItem label="Valor Atualizado" value={formatarMoeda(protesto.vlcdaatualizado)} />
                    <InfoItem label="Tipo Tributo" value={protesto.tipotributo} />
                    <InfoItem label="Data Inscrição" value={formatarData(protesto.dtinscricao)} />
                </dl>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InfoItem label="Origem Dívida" value={protesto.origemdivida} />
                            <InfoItem label="Fundamento" value={protesto.fundamento} />
                            <InfoItem label="Data Referência" value={formatarData(protesto.dtreferencia)} />
                            <InfoItem label="Valor Original" value={formatarMoeda(protesto.vlcdaoriginal)} />
                            <InfoItem label="Multa Atualizada" value={formatarMoeda(protesto.vlmultaatualizada)} />
                            <InfoItem label="Juros Atualizado" value={formatarMoeda(protesto.vljurosatualizado)} />
                            <InfoItem label="Parcelamento" value={formatarBooleano(protesto.parcelamento)} />
                            <InfoItem label="Prescrição" value={protesto.prescrito} />
                            <InfoItem label="Período Protesto" value={protesto.periodoprotesto} />
                            <InfoItem label="Endereço Protesto" value={protesto.obs_end_protesto} />
                        </dl>

                        {protesto.tipodoc === 'CNPJ' && (
                            <>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Informações da Empresa
                                    </h4>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <InfoItem label="CNPJ Raiz" value={protesto.doc_raiz} />
                                        <InfoItem label="Porte" value={protesto.porte} />
                                        <InfoItem label="Situação Cadastral" value={protesto.situacaocadastral} />
                                        <InfoItem label="Natureza Jurídica" value={protesto.natjuridica} />
                                        <InfoItem label="Capital Social" value={protesto.capitalsocial ? formatarMoeda(Number(protesto.capitalsocial)) : '-'} />
                                        <InfoItem label="Data Situação" value={formatarData(protesto.dtsituacaocadastral)} />
                                        <InfoItem label="Início Atividade" value={formatarData(protesto.dtinicioatividade)} />
                                    </dl>
                                </div>

                                {protesto.descricao && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <InfoItem label="Descrição da Atividade" value={protesto.descricao} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                                <FileText className="h-4 w-4 mr-2" />
                                Detalhes Completos
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Detalhes do Protesto</DialogTitle>
                                <DialogDescription>
                                    Informações completas sobre o protesto CDA {protesto.cda}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Informações Gerais
                                    </h4>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem label="Contribuinte" value={protesto.contribuinte} />
                                        <InfoItem label="Documento" value={`${protesto.tipodoc}: ${protesto.docformatado}`} />
                                        <InfoItem label="CDA" value={protesto.cda} />
                                        <InfoItem label="Status Débito" value={protesto.statusdebito} />
                                        <InfoItem label="Data Status" value={formatarData(protesto.dtstatus)} />
                                        <InfoItem label="Situação Protesto" value={protesto.sit_protesto} />
                                        <InfoItem label="Ajuizada" value={formatarBooleano(protesto.flajuizada)} />
                                        <InfoItem label="Município" value={protesto.municipio} />
                                        <InfoItem label="UF" value={protesto.uf} />
                                    </dl>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Valores
                                    </h4>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem label="Valor Original" value={formatarMoeda(protesto.vlcdaoriginal)} />
                                        <InfoItem label="Valor Atualizado" value={formatarMoeda(protesto.vlcdaatualizado)} />
                                        <InfoItem label="Multa Atualizada" value={formatarMoeda(protesto.vlmultaatualizada)} />
                                        <InfoItem label="Juros Atualizado" value={formatarMoeda(protesto.vljurosatualizado)} />
                                        <InfoItem label="IMP Atualizado" value={formatarMoeda(protesto.vlimpatualizado)} />
                                    </dl>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Informações do Débito
                                    </h4>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem label="Tipo Tributo" value={protesto.tipotributo} />
                                        <InfoItem label="Origem Dívida" value={protesto.origemdivida} />
                                        <InfoItem label="Fundamento" value={protesto.fundamento} />
                                        <InfoItem label="Data Inscrição" value={formatarData(protesto.dtinscricao)} />
                                        <InfoItem label="Data Referência" value={formatarData(protesto.dtreferencia)} />
                                        <InfoItem label="Parcelamento" value={formatarBooleano(protesto.parcelamento)} />
                                        <InfoItem label="Prescrição" value={protesto.prescrito} />
                                        <InfoItem label="Período Protesto" value={protesto.periodoprotesto} />
                                        <InfoItem label="Endereço Protesto" value={protesto.obs_end_protesto} />
                                    </dl>
                                </div>

                                {protesto.tipodoc === 'CNPJ' && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Informações da Empresa
                                        </h4>
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InfoItem label="CNPJ Raiz" value={protesto.doc_raiz} />
                                            <InfoItem label="Porte" value={protesto.porte} />
                                            <InfoItem label="Situação Cadastral" value={protesto.situacaocadastral} />
                                            <InfoItem label="Natureza Jurídica" value={protesto.natjuridica} />
                                            <InfoItem label="Capital Social" value={protesto.capitalsocial ? formatarMoeda(Number(protesto.capitalsocial)) : '-'} />
                                            <InfoItem label="Data Situação Cadastral" value={formatarData(protesto.dtsituacaocadastral)} />
                                            <InfoItem label="Início Atividade" value={formatarData(protesto.dtinicioatividade)} />
                                        </dl>
                                        {protesto.descricao && (
                                            <div className="mt-4">
                                                <InfoItem label="Descrição da Atividade" value={protesto.descricao} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Landmark, Briefcase, Search, Scale, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import { formatarData } from '@/lib/utils';
import { AcompanhamentoData } from '../types/acompanhamento.types';

interface AcompanhamentoCardProps {
    processo: AcompanhamentoData;
    onDownloadPdf: (url: string) => void;
}

export function AcompanhamentoCard({ processo, onDownloadPdf }: AcompanhamentoCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatarMoeda = (valor: string | number | null | undefined): string => {
        const numero = Number(valor);
        if (valor === null || valor === undefined || isNaN(numero)) {
            return 'R$ 0,00';
        }
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            ATIVA: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200',
            INATIVA: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
            SUSPENSA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const pdfLinks = [...(processo.pdf_links || []), ...(processo.pdf_links_cnpj || [])];

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-violet-600 dark:text-violet-400">
                            Processo: {processo.numformatado}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <Landmark className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{processo.comarca}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(processo.status)}>
                            {processo.status}
                        </Badge>
                        {processo.AE && (
                            <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300 border-violet-200">
                                Acomp. Especial
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Main Info */}
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-2">{processo.parteprincipal}</span>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Mesa Procurador</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{processo.mesaprocurador || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Ajuizamento</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{formatarData(processo.data_ajuizamento)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Embargos</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {processo.flembargos === 'S' ? 'SIM' : processo.flembargos === 'N' ? 'NÃO' : '-'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Falência/Recuperação</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {processo.flfalenciarecupera === 'S' ? 'SIM' : processo.flfalenciarecupera === 'N' ? 'NÃO' : '-'}
                                </span>
                            </div>
                            <div className="flex flex-col col-span-full">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Status JUCEPA</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{processo.status_jucepa || '-'}</span>
                            </div>
                            <div className="flex flex-col col-span-full">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Assunto Instituição</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{processo.assuntoinstituicao || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Demanda em Aberto</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{processo.demandaaberta || '-'}</span>
                            </div>
                            <div className="flex flex-col col-span-full">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Juízo</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{processo.juizo || '-'}</span>
                            </div>
                        </div>
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
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-violet-600">
                                Processo: {processo.numformatado}
                            </DialogTitle>
                            <DialogDescription>{processo.parteprincipal}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Mesa Procurador</TableCell>
                                        <TableCell className="text-right">{processo.mesaprocurador || '-'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Ajuizamento</TableCell>
                                        <TableCell className="text-right">{formatarData(processo.data_ajuizamento)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Embargos</TableCell>
                                        <TableCell className="text-right">
                                            {processo.flembargos === 'S' ? 'SIM' : processo.flembargos === 'N' ? 'NÃO' : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Falência/Recuperação</TableCell>
                                        <TableCell className="text-right">
                                            {processo.flfalenciarecupera === 'S' ? 'SIM' : processo.flfalenciarecupera === 'N' ? 'NÃO' : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Status JUCEPA</TableCell>
                                        <TableCell className="text-right">{processo.status_jucepa || '-'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Assunto Instituição</TableCell>
                                        <TableCell className="text-right">{processo.assuntoinstituicao || '-'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Demanda em Aberto</TableCell>
                                        <TableCell className="text-right">{processo.demandaaberta || '-'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Juízo</TableCell>
                                        <TableCell className="text-right">{processo.juizo || '-'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Valor do Processo</TableCell>
                                        <TableCell className="text-right font-semibold text-violet-700">
                                            {formatarMoeda(processo.vlprocesso)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-500">Quantidade de CDAs</TableCell>
                                        <TableCell className="text-right">{processo.qtdcdas}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-violet-700 cursor-default">
                    <Scale className="h-4 w-4 mr-2" />
                    {formatarMoeda(processo.vlprocesso)}
                </Button>

                <Badge variant="secondary" className="bg-violet-200/20 text-violet-800 px-3 py-1.5">
                    CDA: {processo.qtdcdas}
                </Badge>

                {pdfLinks.length > 0 && (
                    <>
                        {pdfLinks.map((link, index) => (
                            <Button
                                key={index}
                                variant="secondary"
                                size="sm"
                                className="flex-1 sm:flex-none bg-rose-200/20 text-rose-700 hover:bg-rose-200/30"
                                onClick={() => onDownloadPdf(link)}
                            >
                                <FileDown className="h-4 w-4 mr-2" />
                                PDF {index + 1}
                            </Button>
                        ))}
                    </>
                )}
            </CardFooter>
        </Card>
    );
}

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FluxogramaItem {
    id: string;
    title: string;
    filename: string;
}

const fluxogramas: FluxogramaItem[] = [
    {
        id: 'ngd',
        title: 'Fluxograma - Citação Frustada',
        filename: 'Fluxograma-NGD.pdf',
    },
    {
        id: 'ngd-constricao',
        title: 'Fluxograma - Constrição Frustrada',
        filename: 'Fluxograma-NGD-Constricao-Frustrada.pdf',
    },
];

export function Fluxogramas() {
    // Detectar o perfil baseado na URL atual
    const currentPath = window.location.hash.replace('#', '');
    const getBasePath = () => {
        if (currentPath.startsWith('/chefia')) return '/chefia/fluxogramas';
        if (currentPath.startsWith('/procurador')) return '/procurador/fluxogramas';
        if (currentPath.startsWith('/assessor')) return '/assessor/fluxogramas';
        if (currentPath.startsWith('/estagiario')) return '/estagiario/fluxogramas';
        return '/fluxogramas';
    };

    const basePath = getBasePath();

    return (
        <>
            <Helmet title="Fluxogramas" />
            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Fluxogramas
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visualize os fluxogramas de processos do sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fluxogramas.map((fluxograma) => (
                        <Link
                            key={fluxograma.id}
                            to={`${basePath}/${fluxograma.id}`}
                            className="group"
                        >
                            <Card className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-base font-medium text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                        {fluxograma.title}
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                                        <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <ExternalLink className="h-4 w-4" />
                                        <span>Clique para visualizar</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importar os PDFs
import fluxogramaNGD from '@/assets/Fluxograma-NGD.pdf';
import fluxogramaNGDConstricao from '@/assets/Fluxograma-NGD-Constricao-Frustrada.pdf';

interface FluxogramaData {
    title: string;
    file: string;
}

const fluxogramas: Record<string, FluxogramaData> = {
    'ngd': {
        title: 'Fluxograma NGD',
        file: fluxogramaNGD,
    },
    'ngd-constricao': {
        title: 'Fluxograma NGD - Constrição Frustrada',
        file: fluxogramaNGDConstricao,
    },
};

export function FluxogramaViewer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Detectar o perfil baseado na URL atual
    const currentPath = window.location.hash.replace('#', '');
    const getBackPath = () => {
        if (currentPath.startsWith('/chefia')) return '/chefia/fluxogramas';
        if (currentPath.startsWith('/procurador')) return '/procurador/fluxogramas';
        if (currentPath.startsWith('/assessor')) return '/assessor/fluxogramas';
        if (currentPath.startsWith('/estagiario')) return '/estagiario/fluxogramas';
        return '/fluxogramas';
    };

    const backPath = getBackPath();
    const fluxograma = id ? fluxogramas[id] : null;

    if (!fluxograma) {
        return (
            <>
                <Helmet title="Fluxograma não encontrado" />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
                    <p className="text-gray-600 dark:text-gray-400">Fluxograma não encontrado</p>
                    <Button onClick={() => navigate(backPath)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Button>
                </div>
            </>
        );
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fluxograma.file;
        link.download = `${fluxograma.title}.pdf`;
        link.click();
    };

    return (
        <>
            <Helmet title={fluxograma.title} />
            <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-950">
                {/* Header */}
                <div className="flex-shrink-0 m-4 mb-0">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-t-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(backPath)}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Button>
                            <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                {fluxograma.title}
                            </h1>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Download</span>
                        </Button>
                    </div>
                </div>

                {/* PDF Viewer - Tela Cheia */}
                <div className="flex-1 mx-4 mb-4">
                    <iframe
                        src={fluxograma.file}
                        className="w-full h-full border border-t-0 border-gray-200 dark:border-gray-800 rounded-b-xl shadow-lg bg-white"
                        title={fluxograma.title}
                    />
                </div>
            </div>
        </>
    );
}

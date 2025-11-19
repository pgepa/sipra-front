import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UploadFile } from '@/components/UploadFile';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import { Trash2, Loader2 } from 'lucide-react';

export function UploadCentrot() {
    const [isLoading, setIsLoading] = useState(false);

    const handleTruncate = async () => {
        const token = localStorage.getItem('token');

        setIsLoading(true);

        try {
            const response = await api.post('/truncatecenprot', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 300000,
            });

            if (response.status === 200) {
                alert('Tabela truncada com sucesso!');
            } else {
                throw new Error('Erro ao truncar a tabela');
            }
        } catch (error) {
            console.error('Erro ao truncar:', error);
            alert('Ocorreu um erro ao tentar truncar a tabela.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet title="Upload CENPROT" />
            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Upload de Dados CENPROT
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Faça upload de arquivos da Central de Protesto
                    </p>
                </div>

                <UploadFile
                    title="Importar Arquivo CENPROT"
                    description="Selecione o arquivo CSV ou Excel contendo os dados do CENPROT para importação"
                    endpoint="/uploadcenprot"
                    acceptedFormats=".csv,.xlsx,.xls"
                    renderAfterUploadButton={
                        <Button
                            onClick={handleTruncate}
                            disabled={isLoading}
                            variant="destructive"
                            size="lg"
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Truncando...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-5 w-5" />
                                    Truncar Tabela CENPROT
                                </>
                            )}
                        </Button>
                    }
                />
            </div>
        </>
    );
}

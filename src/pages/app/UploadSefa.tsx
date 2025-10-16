import { Helmet } from 'react-helmet-async';
import { UploadFile } from '@/components/UploadFile';

export function UploadSefa() {
    return (
        <>
            <Helmet title="Upload SEFA" />
            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Upload de Dados SEFA
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Faça upload de arquivos da Secretaria da Fazenda
                    </p>
                </div>

                <UploadFile
                    title="Importar Arquivo SEFA"
                    description="Selecione o arquivo CSV ou Excel contendo os dados da SEFA para importação"
                    endpoint="/upload/sefa"
                    acceptedFormats=".csv,.xlsx,.xls"
                />
            </div>
        </>
    );
}

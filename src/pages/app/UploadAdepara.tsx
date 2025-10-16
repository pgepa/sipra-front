import { Helmet } from 'react-helmet-async';
import { UploadFile } from '@/components/UploadFile';

export function UploadAdepara() {
    return (
        <>
            <Helmet title="Upload ADEPARA" />
            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Upload de Dados ADEPARA
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Faça upload de arquivos da Agência de Defesa Agropecuária
                    </p>
                </div>

                <UploadFile
                    title="Importar Arquivo ADEPARA"
                    description="Selecione o arquivo CSV ou Excel contendo os dados da ADEPARA para importação"
                    endpoint="/uploadadepa"
                    acceptedFormats=".csv,.xlsx,.xls"
                    maxSizeMB={50}
                />
            </div>
        </>
    );
}

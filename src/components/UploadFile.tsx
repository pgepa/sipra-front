import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';

interface UploadFileProps {
    title: string;
    description: string;
    endpoint: string;
    acceptedFormats?: string;
    maxSizeMB?: number;
    renderAfterUploadButton?: React.ReactNode;
}

export function UploadFile({
    title,
    description,
    endpoint,
    acceptedFormats = '.csv,.xlsx,.xls',
    maxSizeMB,
    renderAfterUploadButton,
}: UploadFileProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const token = localStorage.getItem('token');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (maxSizeMB) {
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > maxSizeMB) {
                    setUploadError(`O arquivo deve ter no máximo ${maxSizeMB}MB`);
                    return;
                }
            }
            setSelectedFile(file);
            setFileName(file.name);
            setUploadSuccess(false);
            setUploadError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError('Por favor, selecione um arquivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploading(true);
            setUploadError(null);

            await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setUploadSuccess(true);
            setSelectedFile(null);
            setFileName(null);
        } catch (error: any) {
            console.error('Erro ao fazer upload:', error);
            setUploadError(
                error.response?.data?.message || 'Erro ao fazer upload do arquivo. Tente novamente.'
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="shadow-lg border-gray-200 dark:border-gray-800 max-w-2xl mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-violet-700 dark:text-violet-400">
                    {title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* File Input */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-12 h-12 mb-4 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Clique para selecionar</span> ou arraste o arquivo
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Formatos aceitos: {acceptedFormats}
                                    {maxSizeMB && ` (máx. ${maxSizeMB}MB)`}
                                </p>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept={acceptedFormats}
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* Selected File */}
                    {fileName && (
                        <div className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                            <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                                {fileName}
                            </span>
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="w-full bg-violet-600 hover:bg-violet-700 transition-colors"
                    size="lg"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-5 w-5" />
                            Fazer Upload
                        </>
                    )}
                </Button>

                {/* Additional content after upload button */}
                {renderAfterUploadButton && (
                    <div className="space-y-0">
                        {renderAfterUploadButton}
                    </div>
                )}

                {/* Success Message */}
                {uploadSuccess && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            Arquivo enviado com sucesso!
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {uploadError && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                            {uploadError}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

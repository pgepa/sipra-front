import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import BarLoader from "react-spinners/BarLoader";
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';

export function UploadJucepaPj() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [fileName, setFileName] = useState<string | null>(null); 
    const [uploadProgress, setUploadProgress] = useState<number>(0); 
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false); 
    const [uploadError, setUploadError] = useState<boolean>(false); 
    const [isLoading, setIsLoading] = useState<boolean>(false); 

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setUploadSuccess(false);
            setUploadProgress(0);
            setUploadError(false); 
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileName(null);
        setUploadProgress(0);
        setUploadSuccess(false);
        setUploadError(false); 
    };

    const handleSubmit = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            setIsLoading(true); 

            try {
                const response = await api.post('/uploadjucepapj', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const total = progressEvent.total || 1; 
                        const progress = Math.round((progressEvent.loaded / total) * 100);
                        setUploadProgress(progress);
                    },
                    timeout: 300000, 
                });

                if (response.status === 200) {
                    setUploadSuccess(true);
                    setUploadError(false);
                } else {
                    throw new Error('Erro no envio do arquivo');
                }
            } catch (error) {
                console.error('Erro de upload:', error);
                setUploadError(true);
                setUploadSuccess(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Selecione um arquivo antes de enviar.');
        }
    };

    return (
        <>
            <Helmet title="Jucepa PJ" />
            <div className="flex justify-center items-start min-h-screen">
                <div className="w-full max-w-lg p-8 bg-white rounded-md shadow-md">
                    <h1 className="text-2xl font-semibold text-slate-800 text-center mb-6">Upload base de dados - Jucepa PJ</h1>

                    <div className="mb-4">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Selecione um arquivo CSV ou Excel:
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            onChange={handleFileChange}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>

                    {fileName && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-700">Arquivo selecionado: <strong>{fileName}</strong></p>
                            <button
                                onClick={handleRemoveFile}
                                className="text-red-600 text-sm underline hover:text-red-800"
                            >
                                Remover arquivo
                            </button>
                        </div>
                    )}

                    {uploadProgress > 0 && (
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-violet-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{uploadProgress}% enviado</p>
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className="mb-4">
                            <p className="text-green-600 font-medium">Banco de dados atualizado com sucesso!</p>
                        </div>
                    )}

                    {uploadError && (
                        <div className="mb-4">
                            <p className="text-red-600 font-medium">Erro ao enviar o arquivo.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="mb-4 w-full flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-700 mt-1">Migrando dados...</p>
                        <div className="w-full flex">
                            <BarLoader  className="flex-grow" color="#9655eb"   />
                        </div>
                    </div>
                    
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading} 
                        className="w-full py-2 px-4 text-sm font-medium rounded-lg disabled:opacity-50"
                    >
                        Enviar Arquivo
                    </Button>
                </div>
            </div>
        </>
    );
}

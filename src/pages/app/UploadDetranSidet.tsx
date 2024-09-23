import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

export function UploadDetranSidet() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado para armazenar o arquivo selecionado
    const [fileName, setFileName] = useState<string | null>(null); // Estado para o nome do arquivo

    // Função para manipular a seleção de arquivo
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    // Função para desfazer o upload
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileName(null);
    };

    // Função para enviar o arquivo (mock para enviar para a API)
    const handleSubmit = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Substitua pelo seu código de envio da API
            console.log('Enviando o arquivo para a API:', selectedFile);

            // Exemplo de requisição usando fetch:
            /*
            fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => console.log('Sucesso:', data))
            .catch(error => console.error('Erro:', error));
            */
        } else {
            alert("Selecione um arquivo antes de enviar.");
        }
    };

    return (
        <>
            <Helmet title="Detran Sidet" />
            <div className="flex justify-center items-start min-h-screen">
                <div className="w-full max-w-lg p-8 bg-white rounded-md shadow-md">
                    <h1 className="text-2xl text-slate-800 text-center mb-6">Upload base de dados - Detran Sidet</h1>

                    {/* Input para selecionar o arquivo */}
                    <div className="mb-4">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Selecione um arquivo CSV ou Excel:
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            onChange={handleFileChange}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>

                    {/* Exibe o nome do arquivo selecionado */}
                    {fileName && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-700">Arquivo selecionado: <strong>{fileName}</strong></p>
                            {/* Botão para remover o arquivo */}
                            <button
                                onClick={handleRemoveFile}
                                className="text-red-600 text-sm underline hover:text-red-800"
                            >
                                Remover arquivo
                            </button>
                        </div>
                    )}

                    {/* Botão para enviar o arquivo */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
                    >
                        Enviar Arquivo
                    </button>
                </div>
            </div>
        </>
    );
}

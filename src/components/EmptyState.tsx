import { FileText } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    error?: string | null;
}

export function EmptyState({
    title = 'Nenhum resultado encontrado',
    description = 'Tente ajustar os filtros para encontrar o que procura.',
    error,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                {description}
            </p>
            {error && (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}

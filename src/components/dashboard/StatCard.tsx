import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    loading?: boolean;
    formatAsCurrency?: boolean;
    description?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-violet-600 dark:text-violet-400',
    iconBgColor = 'bg-violet-100 dark:bg-violet-900/30',
    trend,
    loading = false,
    formatAsCurrency = false,
    description,
}: StatCardProps) {
    const formatValue = (val: string | number): string => {
        if (typeof val === 'number') {
            if (formatAsCurrency) {
                return val.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
            return val.toLocaleString('pt-BR');
        }

        // Tentar converter para número e formatar
        const numValue = parseFloat(val);
        if (!isNaN(numValue)) {
            // Se formatAsCurrency for true, formatar como moeda
            if (formatAsCurrency) {
                return numValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
            return numValue.toLocaleString('pt-BR');
        }

        return val;
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {title}
                </CardTitle>
                <div className={cn('p-2 rounded-lg', iconBgColor)}>
                    <Icon className={cn('h-5 w-5', iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : (
                    <>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatValue(value)}
                        </div>
                        {description && (
                            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                        {trend && (
                            <p
                                className={cn(
                                    'text-xs mt-1',
                                    trend.isPositive
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                )}
                            >
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

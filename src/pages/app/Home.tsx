import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '@/lib/axios';
import { StatCard } from '@/components/dashboard/StatCard';
import {
    FileText,
    AlertCircle,
    FolderOpen,
    DollarSign,
    TrendingUp,
    Wallet,
    Activity,
} from 'lucide-react';
import GridLoader from 'react-spinners/GridLoader';
import logo from '@/assets/Logo_Nova.png';
import { DashboardCard } from './types/dashboard.types';

export function Home() {
    const [cards, setCards] = useState<DashboardCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await api.get('/cards', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCards(response.data);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar dados do dashboard:', err);
                setError('Erro ao carregar dados do dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getCardIcon = (cardName: string) => {
        const name = cardName.toLowerCase();
        if (name.includes('soma') && name.includes('cda')) return DollarSign;
        if (name.includes('ef')) return FileText;
        if (name.includes('demanda')) return AlertCircle;
        if (name.includes('cda')) return FolderOpen;
        if (name.includes('pagamento')) return TrendingUp;
        if (name.includes('repasse')) return Wallet;
        return Activity;
    };

    const getCardColors = (cardName: string) => {
        const name = cardName.toLowerCase();
        if (name.includes('ef')) {
            return {
                iconColor: 'text-blue-600 dark:text-blue-400',
                iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
            };
        }
        if (name.includes('demanda')) {
            return {
                iconColor: 'text-orange-600 dark:text-orange-400',
                iconBgColor: 'bg-orange-100 dark:bg-orange-900/30',
            };
        }
        if (name.includes('cda') && !name.includes('soma')) {
            return {
                iconColor: 'text-violet-600 dark:text-violet-400',
                iconBgColor: 'bg-violet-100 dark:bg-violet-900/30',
            };
        }
        if (name.includes('soma') && name.includes('cda')) {
            return {
                iconColor: 'text-green-600 dark:text-green-400',
                iconBgColor: 'bg-green-100 dark:bg-green-900/30',
            };
        }
        if (name.includes('pagamento')) {
            return {
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                iconBgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            };
        }
        if (name.includes('repasse')) {
            return {
                iconColor: 'text-cyan-600 dark:text-cyan-400',
                iconBgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
            };
        }
        return {
            iconColor: 'text-gray-600 dark:text-gray-400',
            iconBgColor: 'bg-gray-100 dark:bg-gray-900/30',
        };
    };

    if (loading) {
        return (
            <>
                <Helmet title="Home" />
                <div className="flex h-screen items-center justify-center">
                    <GridLoader size={16} color="#7c3aed" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Helmet title="Home" />
                <div className="flex flex-col items-center justify-center h-screen gap-4">
                    <img className="w-64 h-auto object-contain opacity-50" src={logo} alt="Logo SIDA" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </>
        );
    }

    // Ordenar cards na ordem especificada
    const orderedCards = [
        cards.find((c) => c.card.includes('EFs')),
        cards.find((c) => c.card.includes('Demandas')),
        cards.find((c) => c.card.includes('Qtd. CDAs')),
        cards.find((c) => c.card.includes('Soma Valor CDAs')),
        cards.find((c) => c.card.includes('Pagamentos')),
        cards.find((c) => c.card.includes('Repasse')),
    ].filter(Boolean) as DashboardCard[];

    return (
        <>
            <Helmet title="Home" />
            <div className="relative h-screen overflow-hidden -mt-16">


                {/* Desktop Mind Map Layout */}
                <div className="hidden xl:flex xl:items-center xl:justify-center relative w-full h-full">
                    {/* Mind Map Container */}
                    <div className="relative w-full max-w-[1400px] aspect-[16/10]">
                        {/* Connection Lines - SVG (Desktop only) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                            {/* Lines from center to cards */}
                            <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="50%" x2="20%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                        </svg>

                        {/* Center Logo */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="relative p-8 bg-white dark:bg-gray-800 rounded-full shadow-2xl border-4 border-violet-200 dark:border-violet-800">
                                <img
                                    src={logo}
                                    alt="Logo SIDA"
                                    className="w-48 h-48 md:w-64 md:h-64 object-contain"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 animate-pulse" />
                            </div>
                        </div>

                        {/* Cards positioned around the center */}
                        {orderedCards.map((card, index) => {
                            const Icon = getCardIcon(card.card);
                            const colors = getCardColors(card.card);
                            const isCurrency = card.card.toLowerCase().includes('soma') ||
                                card.card.toLowerCase().includes('pagamento') ||
                                card.card.toLowerCase().includes('repasse');

                            // Position cards in a circle around the center
                            const positions = [
                                'top-[8%] left-[8%]',      // Top-left
                                'top-[8%] right-[8%]',     // Top-right
                                'top-1/2 left-[3%] -translate-y-1/2',  // Middle-left
                                'top-1/2 right-[3%] -translate-y-1/2', // Middle-right
                                'bottom-[8%] left-[8%]',   // Bottom-left
                                'bottom-[8%] right-[8%]',  // Bottom-right
                            ];

                            return (
                                <div
                                    key={index}
                                    className={`absolute ${positions[index]} w-[300px] z-20 transform hover:scale-105 transition-transform duration-300`}
                                >
                                    <StatCard
                                        title={card.card}
                                        value={card.valor}
                                        icon={Icon}
                                        iconColor={colors.iconColor}
                                        iconBgColor={colors.iconBgColor}
                                        formatAsCurrency={isCurrency}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tablet/Mobile Layout - Stack vertically with background logo */}
                <div className="xl:hidden relative w-full max-w-md mx-auto py-8 px-4 overflow-y-auto h-full">
                    {/* Background Logo */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                        <img
                            src={logo}
                            alt="Logo SIDA Background"
                            className="w-[400px] h-auto opacity-[0.05] dark:opacity-[0.03] select-none"
                        />
                    </div>

                    {/* Cards */}
                    <div className="relative z-10 flex flex-col gap-6">
                        {orderedCards.map((card, index) => {
                            const Icon = getCardIcon(card.card);
                            const colors = getCardColors(card.card);
                            const isCurrency = card.card.toLowerCase().includes('soma') ||
                                card.card.toLowerCase().includes('pagamento') ||
                                card.card.toLowerCase().includes('repasse');
                            return (
                                <div key={index} className="w-full">
                                    <StatCard
                                        title={card.card}
                                        value={card.valor}
                                        icon={Icon}
                                        iconColor={colors.iconColor}
                                        iconBgColor={colors.iconBgColor}
                                        formatAsCurrency={isCurrency}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

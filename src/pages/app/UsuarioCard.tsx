import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserEditar } from '@/pages/app/UsuarioEditar';
import { UserAtivo } from '@/pages/app/UsuarioStatus';
import GridLoader from 'react-spinners/GridLoader';

export type UserCardProps = {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    ativo: boolean;
};

export const UserCard = () => {
    const [users, setUsers] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters] = useState({
        nome: "",
        email: "",
        perfil: "",
        ativo: "",
    });
    const [isFiltering] = useState(false);

    const loadUserCard = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const route = isFiltering ? '/usuarios' : '/list_users';
            const response = await api.get(route, {
                params: {
                    limite: 1000, // Obtém um número alto para garantir que todos os dados sejam carregados de uma vez
                    ...filters,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para obter a descrição do perfil
    const getPerfilDescription = (perfil: string) => {
        switch (perfil) {
            case "Administrador":
                return "Administrador";
            case "Chefia":
                return "Chefia";
            case "Estagiário":
                return "Estagiário";
            default:
                return "Desconhecido";
        }
    };

    const handleStatusChange = () => {
        loadUserCard();
    };

    useEffect(() => {
        loadUserCard();
    }, [filters]);

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <GridLoader size={16} color="#9655eb" />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {users.map((user) => (
                    <Card key={user.id} className="flex flex-col p-4 bg-white rounded-lg shadow-xl">
                        <CardHeader className="flex flex-col space-y-2 pb-4">
                            <CardTitle className="text-xl font-semibold text-slate-700">
                                {user.nome}
                            </CardTitle>
                            <CardDescription className="text-md text-gray-500">
                                {getPerfilDescription(user.perfil)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-indigo-700 text-base font-semibold">{user.email}</p>
                        </CardContent>
                        <CardFooter className="flex gap-2 mt-1">
                            <UserEditar user={user} />
                            <UserAtivo id={user.id} ativo={user.ativo} onStatusChange={handleStatusChange} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
};

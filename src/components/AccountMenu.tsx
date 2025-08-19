// AccountMenu.tsx
import { useEffect, useState } from "react";
import { Building, ChevronDown, LogOut, LockKeyhole } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { api } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { UserEditarSenha } from '@/pages/app/UsuarioEditarSenha';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type GetProfileResponse = {
    avatarUrl: string;
    id: number;
    nome: string;
    email: string;
    perfil: string;
    ativo: boolean;
};

export function AccountMenu() {
    const [userProfile, setUserProfile] = useState<GetProfileResponse | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await api.get<GetProfileResponse>("/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserProfile(response.data);
                } catch (error) {
                    console.error("Erro ao buscar o perfil do usuário:", error);
                }
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const getPerfilDescription = (perfil: string) => {
        switch (perfil) {
            case "Administrador": return "Administrador";
            case "Chefia": return "Coordenação";
            case "Procurador": return "Procurador";
            case "Assessor": return "Assessor";
            case "Estagiario": return "Externo";
            default: return "Desconhecido";
        }
    };

    if (!userProfile) return <p>Carregando...</p>;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 select-none px-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={userProfile.avatarUrl ?? ""} alt={userProfile.nome} />
                            <AvatarFallback>
                                {userProfile.nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                        <span>{userProfile.nome}</span>
                        <span className="text-xs font-normal text-muted-foreground">{userProfile.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Building className="w-4 h-4 mr-2" />
                        <span>Perfil: {getPerfilDescription(userProfile.perfil)}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Dispara o dialog de alterar senha */}
                    <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                        <LockKeyhole className="w-4 h-4 mr-2" />
                        <span>Alterar senha</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-violet-600 dark:text-violet-400 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog de alterar senha fora do dropdown */}
            <UserEditarSenha
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                username={userProfile.email} // ou outro login se houver
            />
        </>
    );
}

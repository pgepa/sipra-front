import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateUserSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    perfil: z.string(),
    senha: z.string().optional(),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

interface User {
    id: number;
    nome: string; 
    email: string;
    perfil: string; 
}

interface UserEditarProps {
    user: User;
}

export function UserEditar({ user }: UserEditarProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<UpdateUserForm>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            nome: user.nome,
            email: user.email,
            perfil: user.perfil,
        },
    });

    async function handleUpdate(data: UpdateUserForm) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/edit_user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Usuário atualizado com sucesso.');
                setIsDialogOpen(false);
                window.location.reload();
            } else {
                const result = await response.json();
                toast.error(result.error || 'Erro ao atualizar usuário.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao atualizar usuário, favor tentar novamente.');
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Editar usuário</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Faça as alterações do usuário aqui. Clique em salvar quando terminar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right">Nome</Label>
                            <Input id="nome" {...register('nome')} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">E-mail</Label>
                            <Input id="email" {...register('email')} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id_perfil" className="text-right">Perfil:</Label>
                            <Controller
                                name="perfil"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Escolha uma opção" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Administrador">Administrador</SelectItem>
                                            <SelectItem value="Chefia">Coordenação</SelectItem>
                                            <SelectItem value="Procurador">Procurador</SelectItem>
                                            <SelectItem value="Assessor">Assessor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="senha" className="text-right">Nova Senha</Label>
                            <Input id="senha" type="password" {...register('senha')} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

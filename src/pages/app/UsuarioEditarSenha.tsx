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
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const updateUserSchema = z.object({
    nova_senha: z.string(),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;





export function UserEditarSenha() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateUserForm>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            nova_senha: '',
        },
    });

    async function handleUpdate(data: UpdateUserForm) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Token de autenticação não encontrado. Faça login novamente.');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/change_password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ nova_senha: data.nova_senha }), // Explicitly send the new password
            });

            if (response.ok) {
                toast.success('Senha alterada com sucesso.');
                setIsDialogOpen(false);
                navigate('/');
            } else {
                const result = await response.json();
                toast.error(result.error || 'Erro ao alterar a senha.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao alterar a senha, favor tentar novamente.');
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>

                <div className='flex items-center cursor-pointer hover:text-red-700 text-destructive' onClick={() => setIsDialogOpen(true)}>
                    <LockKeyhole className="w-4 h-4 mr-2" />
                    Alterar senha
                </div>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <DialogHeader>
                        <DialogTitle>Alterar senha</DialogTitle>
                        <DialogDescription>
                            Faça as alterações da senha aqui. Clique em salvar quando terminar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="senha" className="text-right">Nova Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                {...register('nova_senha')}
                                className="col-span-3"
                            />
                            {errors.nova_senha && (
                                <p className="text-red-600 col-span-4">{errors.nova_senha.message}</p>
                            )}
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

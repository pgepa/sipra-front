// UserEditarSenha.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from "react-router-dom";

const updateUserSchema = z.object({
    nova_senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

type UserEditarSenhaProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    username: string; 
};

export function UserEditarSenha({ open, onOpenChange, username }: UserEditarSenhaProps) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateUserForm>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            nova_senha: '',
        },
    });

    async function handleUpdate(data: UpdateUserForm) {
        setIsSubmitting(true);
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
                body: JSON.stringify({ nova_senha: data.nova_senha }),
            });

            if (response.ok) {
                toast.success('Senha alterada com sucesso.');
                onOpenChange(false);
                reset();
                navigate('/');
            } else {
                const result = await response.json();
                toast.error(result.error || 'Erro ao alterar a senha.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao alterar a senha, favor tentar novamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(handleUpdate)}>
                    {/* Campo oculto de username para acessibilidade */}
                    <input
                        type="text"
                        autoComplete="username"
                        className="sr-only"
                        tabIndex={-1}
                        value={username}
                        readOnly
                    />

                    <DialogHeader>
                        <DialogTitle>Alterar senha</DialogTitle>
                        <DialogDescription>
                            Faça as alterações da senha aqui. Clique em salvar quando terminar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="senha" className="text-right">
                                Nova Senha
                            </Label>
                            <Input
                                id="senha"
                                type="password"
                                autoComplete="new-password"
                                {...register("nova_senha")}
                                className="col-span-3"
                                disabled={isSubmitting}
                                placeholder="Digite sua nova senha"
                            />
                            {errors.nova_senha && (
                                <p className="text-red-600 col-span-4 text-sm mt-1">
                                    {errors.nova_senha.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClose} className="ml-2">
                            Cancelar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

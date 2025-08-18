import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/axios';
import logo from '@/assets/logo.svg'
import { LockKeyhole, LucideUser } from 'lucide-react';

const signInFormSchema = z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(1, 'Senha é obrigatória'),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignIn() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignInForm>({
        resolver: zodResolver(signInFormSchema),
    });

    const handleLogin = async (form: SignInForm) => {
        try {
            const response = await api.post('/login', { email: form.email, senha: form.senha });
            const { token, perfil } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userProfile', JSON.stringify(perfil));

            switch (perfil) {
                case "Administrador":
                    navigate('/home', { replace: true });
                    break;
                case "Chefia":
                    navigate('/homechefia', { replace: true });
                    break;
                case "Procurador":
                    navigate('/homeprocurador', { replace: true });
                    break;
                case "Assessor":
                    navigate('/homeassessor', { replace: true });
                    break;
                case "Estagiario":
                    navigate('/homeestagiario', { replace: true });
                    break;
                default:
                    navigate('/', { replace: true });
                    break;
            }
        } catch (err) {
            console.error('Erro na autenticação:', err);
            setError('Credenciais inválidas. Por favor, verifique seu e-mail e senha.');
        }
    };

    

    return (
        <>
            <Helmet title="Login" />
            
                <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <img className="h-16 w-16" src={logo} alt="Logo" />
                        <h1 className="text-2xl text-yellow-300 font-semibold">Login</h1>
                        <p className="text-sm text-slate-100">SIDA - Sistema de Inteligência da Dívida Ativa</p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className='text-slate-100'>E-mail:</Label>

                            <div className="relative">                        

                                <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                                        

                                <Input id="email" className="pl-10 text-slate-600 placeholder:text-slate-600" placeholder="seu@email.com" type="email" {...register("email")} />

                            </div>
                            
                            {errors.email && <p className="text-slate-100">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha" className='text-slate-100'>Senha:</Label>

                            <div className="relative">
                                
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />                            
                                
                                <Input id="senha" className="pl-10 text-slate-600 placeholder:text-slate-600" placeholder="Sua senha" type="password" {...register("senha")} />
                            </div>
                            
                            {errors.senha && <p className="text-slate-100">{errors.senha.message}</p>}
                        </div>

                        {error && <p className="text-slate-100">{error}</p>}

                        <Button disabled={isSubmitting} className="w-full text-slate-100 font-semibold rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 " type="submit">Entrar</Button>
                    </form>


                </div>
            
        </>
    );
}

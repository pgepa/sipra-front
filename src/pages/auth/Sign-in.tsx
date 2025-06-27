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
            <div className="p-8">
                <div className="w-[350px] flex flex-col justify-center gap-6 mx-auto">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <img className="h-16 w-16 text-white" src={logo} alt="Logo" />
                        <h1 className="text-2xl text-yellow-400 font-semibold tracking-tighter">Acessar Painel</h1>
                        <p className="text-sm text-gray-300">SIDA - Sistema de Inteligência da Dívida Ativa</p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className='font-semibold text-sm text-gray-300'>E-mail:</Label>

                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">

                                    <LucideUser className="h-5 w-5 text-gray-500"/>
                                </span>                           

                                <Input id="email" className='pl-10 col-span-1' placeholder="Seu e-mail" type="email" {...register("email")} />

                            </div>
                            
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha" className='font-semibold text-sm text-gray-300'>Senha:</Label>

                            <div className="relative">
                                <span  className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                                <LockKeyhole className="h-5 w-5 text-gray-500" />                            
                                </span>

                                <Input id="senha" className='pl-10 col-span-1' placeholder="Sua senha" type="password" {...register("senha")} />
                            </div>
                            
                            {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <Button disabled={isSubmitting} className="w-full bg-yellow-600 hover:bg-yellow-500 " type="submit">Entrar</Button>
                    </form>


                </div>
            </div>
        </>
    );
}

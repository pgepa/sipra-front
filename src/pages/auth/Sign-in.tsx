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
          case 2:
          navigate('/chefia', { replace: true });
          break;
        case 3:
          navigate('/estagiario', { replace: true });
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
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl text-gray-800 font-semibold tracking-tighter">Acesse o Painel</h1>
            <p className="text-sm text-gray-600 ">SiDA - Sistema de Inteligência da Dívida Ativa</p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className='font-semibold text-sm text-gray-800'>E-mail:</Label>
              <Input id="email" placeholder="E-mail" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className='font-semibold text-sm text-gray-800'>Senha:</Label>
              <Input id="senha" placeholder="Digite a sua senha" type="password" {...register("senha")} />
              {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button disabled={isSubmitting} className="w-full" type="submit">Entrar</Button>
          </form>

         
        </div>
      </div>
    </>
  );
}

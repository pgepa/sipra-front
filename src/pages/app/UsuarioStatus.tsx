import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { api } from '@/lib/axios';
import axios from 'axios';

interface UserAtivoProps {
  id: number;
  ativo: boolean;
  onStatusChange: () => void; 
}

export function UserAtivo({ id, ativo, onStatusChange }: UserAtivoProps) {
  const [isActive, setIsActive] = useState(ativo);

  const handleToggle = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado. Redirecionando para a página de login...');
      // Redirecione para a página de login ou exiba uma mensagem de erro
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const url = `/edit_user/${id}`;  // Rota unificada para editar o usuário

    try {
      const response = await api.put(url, { ativo: !isActive }, config);

      if (response.status === 200) {
        setIsActive((prev) => !prev);  // Atualiza o estado local após sucesso
        onStatusChange();  // Chama a função onStatusChange após a atualização do status
      } else {
        console.error('Erro na resposta da API:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao alterar o status do usuário:', error.response?.data || error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="ativo" checked={isActive} onCheckedChange={handleToggle} />
      <Label htmlFor="ativo">
        {isActive ? 'Ativo' : 'Inativo'}
      </Label>
    </div>
  );
}

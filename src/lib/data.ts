// src/lib/utils.ts (exemplo de caminho)
import { format, parse } from 'date-fns';

// Função para formatar datas
export function formatarData(dataString: string | null | undefined): string {
  if (!dataString) return '-';

  // Tenta múltiplos formatos comuns que podem vir da sua API
  const formatosPossiveis = [
    "EEE, dd MMM yyyy HH:mm:ss 'GMT'", // Formato 1
    "yyyy-MM-dd HH:mm:ss"             // Formato 2 (com 'T' no lugar do espaço)
  ];

  for (const formato of formatosPossiveis) {
    const data = parse(dataString.replace(' ', 'T'), formato, new Date());
    if (!isNaN(data.getTime())) {
      return format(data, 'dd/MM/yyyy');
    }
  }
  
  // Fallback para o construtor Date se nenhum formato funcionar
  const data = new Date(dataString.replace(' ', 'T'));
  if(!isNaN(data.getTime())) {
      return format(data, 'dd/MM/yyyy');
  }

  return 'Data inválida';
}

// Função para formatar moeda
export function formatarMoeda(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return 'R$ 0,00';
  }
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
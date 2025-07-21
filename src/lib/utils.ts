import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Formata uma string de data vinda da API para o formato dd/MM/yyyy.
 * @param dataString A data no formato "EEE, dd MMM yyyy HH:mm:ss 'GMT'".
 * @returns A data formatada ou '-' se a entrada for inválida.
 */
export function formatarData(dataString: string | null | undefined): string {
  // 1. Retorna '-' se não houver data
  if (!dataString) {
    return '-';
  }

  // 2. Define o formato esperado da API
  const formatoDeEntrada = "EEE, dd MMM yyyy HH:mm:ss 'GMT'";

  // 3. Tenta fazer o parse da data
  const data = parse(
    dataString, 
    formatoDeEntrada, 
    new Date(), 
    { locale: enUS } // IMPORTANTE: Usa o locale inglês para meses como "Aug"
  );

  // 4. Verifica se o parse funcionou e retorna a data formatada
  if (!isNaN(data.getTime())) {
    return format(data, 'dd/MM/yyyy'); // Formato de saída: 24/08/2023
  } else {
    // Se falhar, retorna um valor padrão
    return 'Data inválida';
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

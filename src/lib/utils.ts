import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, isValid } from 'date-fns'; // Importamos 'isValid' para uma verificação mais clara
import { enUS } from 'date-fns/locale';

/**
 * Formata uma string de data vinda da API para o formato dd/MM/yyyy.
 * Suporta os formatos:
 * - "EEE, dd MMM yyyy HH:mm:ss 'GMT'" (ex: "Thu, 28 Jun 1984 00:00:00 GMT")
 * - "yyyy-MM-dd HH:mm:ss.SSS"         (ex: "1984-06-28 00:00:00.000")
 * @param dataString A data em um dos formatos de string suportados.
 * @returns A data formatada como 'dd/MM/yyyy', ou '-' se a entrada for nula/indefinida, ou 'Data inválida' se o formato não for reconhecido.
 */
export function formatarData(dataString: string | null | undefined): string {
  // 1. Retorna '-' se não houver data
  if (!dataString) {
    return '-';
  }

  // 2. Define os formatos de entrada que a função tentará interpretar
  const formatoGMT = "EEE, dd MMM yyyy HH:mm:ss 'GMT'";
  const formatoComMillis = "yyyy-MM-dd HH:mm:ss.SSS";

  // --- LÓGICA ATUALIZADA ---
  // Tenta o primeiro formato (o original)
  let data = parse(
    dataString,
    formatoGMT,
    new Date(),
    { locale: enUS } // Importante para meses como "Jun"
  );

  // Se o primeiro formato falhar, tenta o novo formato
  if (!isValid(data)) {
    data = parse(
      dataString,
      formatoComMillis,
      new Date(),
      { locale: enUS }
    );
  }

  // 4. Verifica se algum dos parses funcionou e retorna a data formatada
  if (isValid(data)) {
    return format(data, 'dd/MM/yyyy'); // Formato de saída: 28/06/1984
  } else {
    // Se ambos falharem, retorna um valor padrão
    return 'Data inválida';
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
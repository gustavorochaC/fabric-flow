/**
 * Utilitários de sanitização e validação de dados
 * Previne injection attacks e valida entrada do usuário
 */

/**
 * Sanitiza uma string removendo caracteres perigosos e limitando tamanho
 * @param input - String a ser sanitizada
 * @param maxLength - Tamanho máximo permitido (padrão: 255)
 * @returns String sanitizada
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove caracteres de controle e caracteres especiais perigosos
  let sanitized = input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove caracteres de controle
    .replace(/[<>]/g, '') // Remove < e > para prevenir HTML injection
    .trim();

  // Limita o tamanho
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Valida e sanitiza um nome (tecido, operador, motivo)
 * @param name - Nome a ser validado
 * @returns Nome sanitizado ou null se inválido
 */
export function validateAndSanitizeName(name: string): string | null {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const sanitized = sanitizeString(name, 100).trim();

  // Nome deve ter pelo menos 1 caractere e no máximo 100
  if (sanitized.length === 0 || sanitized.length > 100) {
    return null;
  }

  // Não permite apenas espaços ou caracteres especiais
  if (!/^[\p{L}\p{N}\s\-_]+$/u.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Valida uma quantidade (número inteiro positivo)
 * @param quantity - Quantidade a ser validada
 * @param min - Valor mínimo (padrão: 1)
 * @param max - Valor máximo (padrão: 999999)
 * @returns Quantidade validada ou null se inválida
 */
export function validateQuantity(
  quantity: number | string,
  min: number = 1,
  max: number = 999999
): number | null {
  const num = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (num < min || num > max) {
    return null;
  }

  return Math.floor(num);
}

/**
 * Valida se uma string não está vazia após sanitização
 * @param input - String a ser validada
 * @param maxLength - Tamanho máximo
 * @returns String sanitizada ou null se vazia
 */
export function validateNonEmptyString(input: string, maxLength: number = 255): string | null {
  const sanitized = sanitizeString(input, maxLength).trim();
  return sanitized.length > 0 ? sanitized : null;
}

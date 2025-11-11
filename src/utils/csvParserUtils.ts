/**
 * Utilitários para parsing de CSV que respeitam campos entre aspas
 */

/**
 * Parseia uma linha CSV respeitando campos entre aspas
 * @param line - Linha do CSV
 * @returns Array de valores parseados
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : null;
    
    if (char === '"') {
      // Se estamos dentro de aspas e o próximo caractere também é aspas, é uma aspas escapada
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Pula o próximo caractere
      } else {
        // Toggle do estado de aspas
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Vírgula fora de aspas = separador de campo
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Adiciona o último campo
  result.push(current.trim());
  
  return result;
}

/**
 * Parseia um arquivo CSV completo
 * @param csvContent - Conteúdo completo do CSV
 * @returns Array de objetos, onde cada objeto representa uma linha
 */
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.trim().split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }
  
  // Parseia o cabeçalho
  const headers = parseCSVLine(lines[0]);
  const data: Record<string, string>[] = [];
  
  // Parseia cada linha de dados
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
}


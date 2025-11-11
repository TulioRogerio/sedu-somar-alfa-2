/**
 * Retorna o caminho correto para arquivos estáticos considerando o base path
 * @param path - Caminho relativo ao diretório public (ex: 'escolas.csv')
 * @returns Caminho completo com base path
 */
export function getPublicPath(path: string): string {
  // Remove barra inicial se existir
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // import.meta.env.BASE_URL já inclui a barra final
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}


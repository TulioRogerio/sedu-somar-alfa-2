export interface IndicadorRow {
  escola_id: string;
  escola_nome: string;
  regional: string;
  municipio: string;
  indicador_aulas_dadas: string;
  indicador_frequencia: string;
  indicador_tarefas: string;
  indicador_produtos: string;
  indicador_visitas_tecnicas: string;
}

export interface EficaciaProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
}


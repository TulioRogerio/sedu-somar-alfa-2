export interface CicloGestaoRow {
  escola_id: string;
  plano_acao_id: string;
  mapa_acao_id: string;
  tipo_mapa: string;
  problema: string;
  desafio: string;
  validado_tcgp: string; // "true" ou "false"
  produto_status: string;
  tarefas_total: string;
  tarefas_previstas: string;
  tarefas_nao_iniciadas: string;
  tarefas_em_andamento: string;
  tarefas_atrasadas: string;
  tarefas_concluidas: string;
  tarefas_concluidas_atraso: string;
  visitas_tecnicas_total: string;
  visitas_tecnicas_ciclo1: string;
  visitas_tecnicas_ciclo2: string;
  visitas_tecnicas_ciclo3: string;
  visitas_tecnicas_esperadas: string;
  visitas_tecnicas_atas_assinadas: string;
}

export interface DadosPlanosAcao {
  mapasAcao: number;
  planosAcao: number;
  mapasLP: number;
  mapasMat: number;
  mapasLeitura: number;
  mapasOutros: number;
  validados: number;
  pendentes: number;
}

export interface DadosPlanosAcaoRegional extends DadosPlanosAcao {
  regional: string;
}

export interface DadosPlanosAcaoMunicipio extends DadosPlanosAcao {
  municipio: string;
  regional: string;
}

export interface DadosPlanosAcaoEscola extends DadosPlanosAcao {
  escola: string;
  municipio: string;
  regional: string;
}

export interface DadosTarefas {
  total: number;
  previstas: number;
  naoIniciadas: number;
  emAndamento: number;
  atrasadas: number;
  concluidas: number;
  concluidasAtraso: number;
}

export interface DadosTarefasRegional extends DadosTarefas {
  regional: string;
}

export interface DadosTarefasMunicipio extends DadosTarefas {
  municipio: string;
  regional: string;
}

export interface DadosTarefasEscola extends DadosTarefas {
  escola: string;
  municipio: string;
  regional: string;
}

export interface DadosProdutos {
  total: number;
  faixa0_25: number;
  faixa26_50: number;
  faixa51_75: number;
  faixa76_100: number;
  percentualMedio: number;
}

export interface DadosProdutosRegional extends DadosProdutos {
  regional: string;
}

export interface DadosProdutosMunicipio extends DadosProdutos {
  municipio: string;
  regional: string;
}

export interface DadosProdutosEscola extends DadosProdutos {
  escola: string;
  municipio: string;
  regional: string;
}

export interface DadosVisitasTecnicas {
  esperadas: number;
  atasAssinadas: number;
  ciclo1: number;
  ciclo2: number;
  ciclo3: number;
  percentualPendentes: number;
}

export interface DadosVisitasTecnicasRegional extends DadosVisitasTecnicas {
  regional: string;
}

export interface DadosVisitasTecnicasMunicipio extends DadosVisitasTecnicas {
  municipio: string;
  regional: string;
}

export interface DadosVisitasTecnicasEscola extends DadosVisitasTecnicas {
  escola: string;
  municipio: string;
  regional: string;
}


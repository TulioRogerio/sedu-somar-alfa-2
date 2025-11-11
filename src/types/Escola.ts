export interface Escola {
  id: number
  codigo: string
  nome: string
  municipio: string
  codigo_municipio: string
  regional: string
  codigo_regional: string
  endereco: string
  numero: string
  bairro: string
  cep: string
  telefone: string
  email: string
  tipo: string
  modalidade: string
  ensino_fundamental: boolean
  ensino_medio: boolean
  educacao_infantil: boolean
  educacao_especial: boolean
  total_alunos: number
  total_professores: number
  total_pedagogos: number
  total_turmas: number
  tcgps: number
  nome_tcgp?: string
  email_tcgp?: string
  serie1_alunos?: number
  serie1_turmas?: number
  serie2_alunos?: number
  serie2_turmas?: number
  serie3_alunos?: number
  serie3_turmas?: number
  serie4_alunos?: number
  serie4_turmas?: number
  serie5_alunos?: number
  serie5_turmas?: number
  meta_idebes_alfa_2024?: number
  idebes_alfa_2024?: number
  meta_idebes_alfa_2025?: number
  ativo: boolean
}

export interface DadosEspiritoSanto {
  escolas: number
  turmas: number
  alunos: number
  tcgps: number
  professores: number
  pedagogos: number
  coordenadores: number
}

export interface DadosRegional {
  regional: string
  escolas: number
  turmas: number
  alunos: number
  professores: number
  pedagogos: number
  tcgps: number
}

export interface DadosMunicipio {
  municipio: string
  regional: string
  escolas: number
  turmas: number
  alunos: number
  professores: number
  pedagogos: number
  tcgps: number
}

export interface DadosSerie {
  escola: string
  serie1_alunos: number
  serie1_turmas: number
  serie2_alunos: number
  serie2_turmas: number
  serie3_alunos: number
  serie3_turmas: number
  serie4_alunos: number
  serie4_turmas: number
  serie5_alunos: number
  serie5_turmas: number
  total_alunos: number
  total_turmas: number
}

export interface DadosPorEscola {
  escola: string
  serie: string
  alunos: number
  turmas: number
}

export interface TurmaInfo {
  nome: string
  alunos: number
}

export interface DadosEscolaPorSerie {
  escola: string
  serie1: TurmaInfo[]
  serie2: TurmaInfo[]
  serie3: TurmaInfo[]
  serie4: TurmaInfo[]
  serie5: TurmaInfo[]
  total_alunos: number
  total_turmas: number
}

export interface DadosMetasEstado {
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}

export interface DadosMetasRegional {
  regional: string
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}

export interface DadosMetasMunicipio {
  municipio: string
  regional: string
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}

export interface DadosMetasEscola {
  escola: string
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}

export interface DadosTCGPEscola {
  escola: string
  tcgps: number
  nome_tcgp?: string
  email_tcgp?: string
}

export interface EscolaTCGPInfo {
  nome: string
  endereco: string
  numero: string
  bairro: string
  municipio: string
}

export interface DadosTCGPDetalhes {
  nome_tcgp: string
  email_tcgp: string
  escolas: EscolaTCGPInfo[]
}


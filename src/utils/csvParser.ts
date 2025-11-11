import { Escola, DadosEspiritoSanto, DadosRegional, DadosMunicipio, DadosPorEscola, TurmaInfo, DadosEscolaPorSerie, DadosMetasEstado, DadosMetasRegional, DadosMetasMunicipio, DadosMetasEscola, DadosTCGPEscola, DadosTCGPDetalhes, EscolaTCGPInfo } from '../types/Escola'
import { parseCSV } from './csvParserUtils'

function parseValue(value: string): string | number | boolean {
  if (value === 'true' || value === 'false') {
    return value === 'true'
  }
  
  const numValue = Number(value)
  if (!isNaN(numValue) && value !== '') {
    return numValue
  }
  
  return value
}

export function parseEscolasCsv(csvContent: string): Escola[] {
  const parsedData = parseCSV(csvContent)
  const escolas: Escola[] = []
  
  for (const row of parsedData) {
    const escola = {} as Record<string, unknown>
    
    Object.keys(row).forEach((header) => {
      const value = row[header] || ''
      escola[header] = parseValue(value)
    })
    
    escolas.push(escola as Escola)
  }
  
  return escolas
}

export async function loadEscolasFromCsv(): Promise<Escola[]> {
  try {
    const response = await fetch('/escolas.csv')
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar CSV: ${response.status} ${response.statusText}`)
    }
    
    const csvContent = await response.text()
    return parseEscolasCsv(csvContent)
  } catch (error) {
    console.error('Erro ao carregar CSV de escolas:', error)
    return []
  }
}

export function calcularDadosEspiritoSanto(escolas: Escola[]): DadosEspiritoSanto {
  const totalEscolas = escolas.length
  const totalTurmas = escolas.reduce((sum, e) => sum + (e.total_turmas || 0), 0)
  const totalAlunos = escolas.reduce((sum, e) => sum + (e.total_alunos || 0), 0)
  const totalTCGPs = escolas.reduce((sum, e) => sum + (e.tcgps || 0), 0)
  const totalProfessores = escolas.reduce((sum, e) => sum + (e.total_professores || 0), 0)
  const totalPedagogos = escolas.reduce((sum, e) => sum + (e.total_pedagogos || 0), 0)
  
  return {
    escolas: totalEscolas,
    turmas: totalTurmas,
    alunos: totalAlunos,
    tcgps: totalTCGPs,
    professores: totalProfessores,
    pedagogos: totalPedagogos,
    coordenadores: 78
  }
}

export function calcularDadosRegionais(escolas: Escola[]): DadosRegional[] {
  const regionaisMap = new Map<string, DadosRegional>()
  
  escolas.forEach(escola => {
    const regional = escola.regional
    if (!regionaisMap.has(regional)) {
      regionaisMap.set(regional, {
        regional,
        escolas: 0,
        turmas: 0,
        alunos: 0,
        professores: 0,
        pedagogos: 0,
        tcgps: 0
      })
    }
    
    const dados = regionaisMap.get(regional)!
    dados.escolas++
    dados.turmas += escola.total_turmas || 0
    dados.alunos += escola.total_alunos || 0
    dados.professores += escola.total_professores || 0
    dados.pedagogos += escola.total_pedagogos || 0
    dados.tcgps += escola.tcgps || 0
  })
  
  return Array.from(regionaisMap.values()).sort((a, b) => 
    a.regional.localeCompare(b.regional)
  )
}

export function calcularDadosMunicipios(escolas: Escola[]): DadosMunicipio[] {
  const municipiosMap = new Map<string, DadosMunicipio>()
  
  escolas.forEach(escola => {
    const key = `${escola.municipio}-${escola.regional}`
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, {
        municipio: escola.municipio,
        regional: escola.regional,
        escolas: 0,
        turmas: 0,
        alunos: 0,
        professores: 0,
        pedagogos: 0,
        tcgps: 0
      })
    }
    
    const dados = municipiosMap.get(key)!
    dados.escolas++
    dados.turmas += escola.total_turmas || 0
    dados.alunos += escola.total_alunos || 0
    dados.professores += escola.total_professores || 0
    dados.pedagogos += escola.total_pedagogos || 0
    dados.tcgps += escola.tcgps || 0
  })
  
  return Array.from(municipiosMap.values()).sort((a, b) => {
    if (a.regional !== b.regional) {
      return a.regional.localeCompare(b.regional)
    }
    return a.municipio.localeCompare(b.municipio)
  })
}

export function calcularDadosPorEscola(escolas: Escola[]): DadosPorEscola[] {
  const dados: DadosPorEscola[] = []

  escolas.forEach(escola => {
    const series = [
      { serie: '1ª Série', alunos: escola.serie1_alunos || 0, turmas: escola.serie1_turmas || 0 },
      { serie: '2ª Série', alunos: escola.serie2_alunos || 0, turmas: escola.serie2_turmas || 0 },
      { serie: '3ª Série', alunos: escola.serie3_alunos || 0, turmas: escola.serie3_turmas || 0 },
      { serie: '4ª Série', alunos: escola.serie4_alunos || 0, turmas: escola.serie4_turmas || 0 },
      { serie: '5ª Série', alunos: escola.serie5_alunos || 0, turmas: escola.serie5_turmas || 0 }
    ]

    series.forEach(({ serie, alunos, turmas }) => {
      if (alunos > 0 || turmas > 0) {
        dados.push({
          escola: escola.nome,
          serie,
          alunos,
          turmas
        })
      }
    })
  })

  return dados.sort((a, b) => {
    if (a.escola !== b.escola) {
      return a.escola.localeCompare(b.escola)
    }
    return a.serie.localeCompare(b.serie)
  })
}

function gerarTurmas(numTurmas: number, totalAlunos: number): TurmaInfo[] {
  if (numTurmas === 0 || totalAlunos === 0) {
    return []
  }

  const turmas: TurmaInfo[] = []
  const alunosPorTurma = Math.floor(totalAlunos / numTurmas)
  const resto = totalAlunos % numTurmas

  for (let i = 1; i <= numTurmas; i++) {
    const alunos = alunosPorTurma + (i <= resto ? 1 : 0)
    turmas.push({
      nome: `Turma ${i}`,
      alunos
    })
  }

  return turmas
}

export function calcularDadosEscolaPorSerie(escolas: Escola[]): DadosEscolaPorSerie[] {
  return escolas.map(escola => ({
    escola: escola.nome,
    serie1: gerarTurmas(escola.serie1_turmas || 0, escola.serie1_alunos || 0),
    serie2: gerarTurmas(escola.serie2_turmas || 0, escola.serie2_alunos || 0),
    serie3: gerarTurmas(escola.serie3_turmas || 0, escola.serie3_alunos || 0),
    serie4: gerarTurmas(escola.serie4_turmas || 0, escola.serie4_alunos || 0),
    serie5: gerarTurmas(escola.serie5_turmas || 0, escola.serie5_alunos || 0),
    total_alunos: escola.total_alunos || 0,
    total_turmas: escola.total_turmas || 0
  })).sort((a, b) => a.escola.localeCompare(b.escola))
}

// Funções para calcular metas agregadas
export function calcularMetasEstado(escolas: Escola[]): DadosMetasEstado {
  const escolasComMetas = escolas.filter(e => 
    e.meta_idebes_alfa_2024 !== undefined && 
    e.idebes_alfa_2024 !== undefined && 
    e.meta_idebes_alfa_2025 !== undefined
  )
  
  if (escolasComMetas.length === 0) {
    return {
      meta_idebes_alfa_2024: 0,
      idebes_alfa_2024: 0,
      meta_idebes_alfa_2025: 0
    }
  }
  
  const totalMeta2024 = escolasComMetas.reduce((sum, e) => sum + (e.meta_idebes_alfa_2024 || 0), 0)
  const totalIdebes2024 = escolasComMetas.reduce((sum, e) => sum + (e.idebes_alfa_2024 || 0), 0)
  const totalMeta2025 = escolasComMetas.reduce((sum, e) => sum + (e.meta_idebes_alfa_2025 || 0), 0)
  
  return {
    meta_idebes_alfa_2024: Number((totalMeta2024 / escolasComMetas.length).toFixed(1)),
    idebes_alfa_2024: Number((totalIdebes2024 / escolasComMetas.length).toFixed(1)),
    meta_idebes_alfa_2025: Number((totalMeta2025 / escolasComMetas.length).toFixed(1))
  }
}

export function calcularMetasRegionais(escolas: Escola[]): DadosMetasRegional[] {
  const regionaisMap = new Map<string, { escolas: Escola[] }>()
  
  escolas.forEach(escola => {
    const regional = escola.regional
    if (!regionaisMap.has(regional)) {
      regionaisMap.set(regional, { escolas: [] })
    }
    regionaisMap.get(regional)!.escolas.push(escola)
  })
  
  const regionais: DadosMetasRegional[] = []
  
  regionaisMap.forEach((dados, regional) => {
    const escolasComMetas = dados.escolas.filter(e => 
      e.meta_idebes_alfa_2024 !== undefined && 
      e.idebes_alfa_2024 !== undefined && 
      e.meta_idebes_alfa_2025 !== undefined
    )
    
    if (escolasComMetas.length === 0) {
      regionais.push({
        regional,
        meta_idebes_alfa_2024: 0,
        idebes_alfa_2024: 0,
        meta_idebes_alfa_2025: 0
      })
      return
    }
    
    const totalMeta2024 = escolasComMetas.reduce((sum, e) => sum + (e.meta_idebes_alfa_2024 || 0), 0)
    const totalIdebes2024 = escolasComMetas.reduce((sum, e) => sum + (e.idebes_alfa_2024 || 0), 0)
    const totalMeta2025 = escolasComMetas.reduce((sum, e) => sum + (e.meta_idebes_alfa_2025 || 0), 0)
    
    regionais.push({
      regional,
      meta_idebes_alfa_2024: Number((totalMeta2024 / escolasComMetas.length).toFixed(1)),
      idebes_alfa_2024: Number((totalIdebes2024 / escolasComMetas.length).toFixed(1)),
      meta_idebes_alfa_2025: Number((totalMeta2025 / escolasComMetas.length).toFixed(1))
    })
  })
  
  return regionais.sort((a, b) => a.regional.localeCompare(b.regional))
}

export function calcularMetasMunicipios(escolas: Escola[]): DadosMetasMunicipio[] {
  const municipiosMap = new Map<string, { municipio: string; regional: string; escolas: Escola[] }>()
  
  escolas.forEach(escola => {
    const key = `${escola.municipio}-${escola.regional}`
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, {
        municipio: escola.municipio,
        regional: escola.regional,
        escolas: []
      })
    }
    municipiosMap.get(key)!.escolas.push(escola)
  })
  
  const municipios: DadosMetasMunicipio[] = []
  
  municipiosMap.forEach((dados) => {
    const escolasComMetas = dados.escolas.filter(e => 
      e.meta_idebes_alfa_2024 !== undefined && 
      e.idebes_alfa_2024 !== undefined && 
      e.meta_idebes_alfa_2025 !== undefined
    )
    
    if (escolasComMetas.length === 0) {
      municipios.push({
        municipio: dados.municipio,
        regional: dados.regional,
        meta_idebes_alfa_2024: 0,
        idebes_alfa_2024: 0,
        meta_idebes_alfa_2025: 0
      })
      return
    }
    
    const totalMeta2024 = escolasComMetas.reduce((sum, e) => sum + (e.meta_idebes_alfa_2024 || 0), 0)
    const totalIdebes2024 = escolasComMetas.reduce((sum, e) => sum + (e.idebes_alfa_2024 || 0), 0)
    const totalMeta2025 = escolasComMetas.reduce((sum, e) => sum + (e.meta_idebes_alfa_2025 || 0), 0)
    
    municipios.push({
      municipio: dados.municipio,
      regional: dados.regional,
      meta_idebes_alfa_2024: Number((totalMeta2024 / escolasComMetas.length).toFixed(1)),
      idebes_alfa_2024: Number((totalIdebes2024 / escolasComMetas.length).toFixed(1)),
      meta_idebes_alfa_2025: Number((totalMeta2025 / escolasComMetas.length).toFixed(1))
    })
  })
  
  return municipios.sort((a, b) => {
    if (a.regional !== b.regional) {
      return a.regional.localeCompare(b.regional)
    }
    return a.municipio.localeCompare(b.municipio)
  })
}

export function calcularMetasEscolas(escolas: Escola[]): DadosMetasEscola[] {
  return escolas
    .filter(e => 
      e.meta_idebes_alfa_2024 !== undefined && 
      e.idebes_alfa_2024 !== undefined && 
      e.meta_idebes_alfa_2025 !== undefined
    )
    .map(escola => ({
      escola: escola.nome,
      meta_idebes_alfa_2024: escola.meta_idebes_alfa_2024 || 0,
      idebes_alfa_2024: escola.idebes_alfa_2024 || 0,
      meta_idebes_alfa_2025: escola.meta_idebes_alfa_2025 || 0
    }))
    .sort((a, b) => a.escola.localeCompare(b.escola))
}

export function calcularTCGPEscolas(escolas: Escola[]): DadosTCGPEscola[] {
  return escolas
    .filter(e => e.tcgps !== undefined && e.tcgps > 0)
    .map(escola => ({
      escola: escola.nome,
      tcgps: escola.tcgps || 0,
      nome_tcgp: escola.nome_tcgp,
      email_tcgp: escola.email_tcgp
    }))
    .sort((a, b) => a.escola.localeCompare(b.escola))
}

export function agruparEscolasPorTCGP(escolas: Escola[]): Map<string, DadosTCGPDetalhes> {
  const tcgpsMap = new Map<string, DadosTCGPDetalhes>()
  
  escolas
    .filter(e => e.nome_tcgp && e.email_tcgp)
    .forEach(escola => {
      const nomeTCGP = escola.nome_tcgp!
      const emailTCGP = escola.email_tcgp!
      
      if (!tcgpsMap.has(nomeTCGP)) {
        tcgpsMap.set(nomeTCGP, {
          nome_tcgp: nomeTCGP,
          email_tcgp: emailTCGP,
          escolas: []
        })
      }
      
      const dadosTCGP = tcgpsMap.get(nomeTCGP)!
      dadosTCGP.escolas.push({
        nome: escola.nome,
        endereco: escola.endereco,
        numero: escola.numero,
        bairro: escola.bairro,
        municipio: escola.municipio
      })
    })
  
  // Ordenar escolas dentro de cada TCGP por nome
  tcgpsMap.forEach(dados => {
    dados.escolas.sort((a, b) => a.nome.localeCompare(b.nome))
  })
  
  return tcgpsMap
}


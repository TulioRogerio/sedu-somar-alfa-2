import type {
  CicloGestaoRow,
  DadosPlanosAcao,
  DadosPlanosAcaoRegional,
  DadosPlanosAcaoMunicipio,
  DadosPlanosAcaoEscola,
  DadosTarefas,
  DadosTarefasRegional,
  DadosTarefasMunicipio,
  DadosTarefasEscola,
  DadosProdutos,
  DadosProdutosRegional,
  DadosProdutosMunicipio,
  DadosProdutosEscola,
  DadosVisitasTecnicas,
  DadosVisitasTecnicasRegional,
  DadosVisitasTecnicasMunicipio,
  DadosVisitasTecnicasEscola,
} from "../types/CicloGestao";
import type { Escola } from "../types/Escola";

import { parseCSV } from "./csvParserUtils";
import { getPublicPath } from "./pathUtils";

export async function loadCicloGestaoCsv(): Promise<CicloGestaoRow[]> {
  try {
    const response = await fetch(getPublicPath("ciclo-gestao.csv"));
    if (!response.ok) {
      throw new Error(`Erro ao carregar CSV: ${response.status}`);
    }
    const text = await response.text();
    const parsedData = parseCSV(text);
    
    return parsedData as unknown as CicloGestaoRow[];
  } catch (error) {
    console.error("Erro ao carregar ciclo-gestao.csv:", error);
    return [];
  }
}

function calcularDadosPlanosAcao(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosPlanosAcao {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const dadosFiltrados = cicloGestaoData.filter((row) =>
    escolaIds.has(row.escola_id)
  );

  const planosAcao = new Set(
    dadosFiltrados.map((row) => `${row.escola_id}-${row.plano_acao_id}`)
  ).size;

  const mapasAcao = dadosFiltrados.length;
  const mapasLP = dadosFiltrados.filter(
    (row) => row.tipo_mapa === "Português"
  ).length;
  const mapasMat = dadosFiltrados.filter(
    (row) => row.tipo_mapa === "Matemática"
  ).length;
  const mapasLeitura = dadosFiltrados.filter(
    (row) => row.tipo_mapa === "Leitura"
  ).length;
  const mapasOutros = dadosFiltrados.filter(
    (row) =>
      row.tipo_mapa !== "Português" &&
      row.tipo_mapa !== "Matemática" &&
      row.tipo_mapa !== "Leitura"
  ).length;

  const validados = dadosFiltrados.filter(
    (row) => row.validado_tcgp === "true"
  ).length;
  const pendentes = dadosFiltrados.filter(
    (row) => row.validado_tcgp === "false"
  ).length;

  return {
    mapasAcao,
    planosAcao,
    mapasLP,
    mapasMat,
    mapasLeitura,
    mapasOutros,
    validados,
    pendentes,
  };
}

export function calcularDadosPlanosAcaoEstado(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[]
): DadosPlanosAcao {
  return calcularDadosPlanosAcao(cicloGestaoData, escolasData);
}

export function calcularDadosPlanosAcaoRegionais(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[]
): DadosPlanosAcaoRegional[] {
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: DadosPlanosAcaoRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosPlanosAcao(
      cicloGestaoData,
      escolasData,
      (escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

export function calcularDadosPlanosAcaoMunicipios(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  regional?: string
): DadosPlanosAcaoMunicipio[] {
  let escolasFiltradas = escolasData;
  if (regional) {
    escolasFiltradas = escolasData.filter((e) => e.regional === regional);
  }

  const municipiosMap = new Map<string, { municipio: string; regional: string }>();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { municipio: e.municipio, regional: e.regional });
    }
  });

  const dados: DadosPlanosAcaoMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosPlanosAcao(
      cicloGestaoData,
      escolasData,
      (escola) => escola.municipio === municipio && escola.regional === reg
    );
    dados.push({
      ...dadosMunicipio,
      municipio,
      regional: reg,
    });
  });

  return dados.sort((a, b) => a.municipio.localeCompare(b.municipio));
}

export function calcularDadosPlanosAcaoEscolas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  municipio?: string,
  regional?: string
): DadosPlanosAcaoEscola[] {
  let escolasFiltradas = escolasData;
  if (municipio) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.municipio === municipio);
  }
  if (regional) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.regional === regional);
  }

  const dados: DadosPlanosAcaoEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosPlanosAcao(
      cicloGestaoData,
      escolasData,
      (e) => e.id === escola.id
    );
    dados.push({
      ...dadosEscola,
      escola: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional,
    });
  });

  return dados.sort((a, b) => a.escola.localeCompare(b.escola));
}

function calcularDadosTarefasFiltrado(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosTarefas {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const dadosFiltrados = cicloGestaoData.filter((row) =>
    escolaIds.has(row.escola_id)
  );

  let total = 0;
  let previstas = 0;
  let naoIniciadas = 0;
  let emAndamento = 0;
  let atrasadas = 0;
  let concluidas = 0;
  let concluidasAtraso = 0;

  dadosFiltrados.forEach((row) => {
    total += parseInt(row.tarefas_total) || 0;
    previstas += parseInt(row.tarefas_previstas) || 0;
    naoIniciadas += parseInt(row.tarefas_nao_iniciadas) || 0;
    emAndamento += parseInt(row.tarefas_em_andamento) || 0;
    atrasadas += parseInt(row.tarefas_atrasadas) || 0;
    concluidas += parseInt(row.tarefas_concluidas) || 0;
    concluidasAtraso += parseInt(row.tarefas_concluidas_atraso) || 0;
  });

  return {
    total,
    previstas,
    naoIniciadas,
    emAndamento,
    atrasadas,
    concluidas,
    concluidasAtraso,
  };
}

export function calcularDadosTarefas(
  cicloGestaoData: CicloGestaoRow[]
): DadosTarefas {
  let total = 0;
  let previstas = 0;
  let naoIniciadas = 0;
  let emAndamento = 0;
  let atrasadas = 0;
  let concluidas = 0;
  let concluidasAtraso = 0;

  cicloGestaoData.forEach((row) => {
    total += parseInt(row.tarefas_total) || 0;
    previstas += parseInt(row.tarefas_previstas) || 0;
    naoIniciadas += parseInt(row.tarefas_nao_iniciadas) || 0;
    emAndamento += parseInt(row.tarefas_em_andamento) || 0;
    atrasadas += parseInt(row.tarefas_atrasadas) || 0;
    concluidas += parseInt(row.tarefas_concluidas) || 0;
    concluidasAtraso += parseInt(row.tarefas_concluidas_atraso) || 0;
  });

  return {
    total,
    previstas,
    naoIniciadas,
    emAndamento,
    atrasadas,
    concluidas,
    concluidasAtraso,
  };
}

export function calcularDadosTarefasRegionais(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[]
): DadosTarefasRegional[] {
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: DadosTarefasRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosTarefasFiltrado(
      cicloGestaoData,
      escolasData,
      (escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

export function calcularDadosTarefasMunicipios(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  regional?: string
): DadosTarefasMunicipio[] {
  let escolasFiltradas = escolasData;
  if (regional) {
    escolasFiltradas = escolasData.filter((e) => e.regional === regional);
  }

  const municipiosMap = new Map<string, { municipio: string; regional: string }>();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { municipio: e.municipio, regional: e.regional });
    }
  });

  const dados: DadosTarefasMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosTarefasFiltrado(
      cicloGestaoData,
      escolasData,
      (escola) => escola.municipio === municipio && escola.regional === reg
    );
    dados.push({
      ...dadosMunicipio,
      municipio,
      regional: reg,
    });
  });

  return dados.sort((a, b) => a.municipio.localeCompare(b.municipio));
}

export function calcularDadosTarefasEscolas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  municipio?: string,
  regional?: string
): DadosTarefasEscola[] {
  let escolasFiltradas = escolasData;
  if (municipio) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.municipio === municipio);
  }
  if (regional) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.regional === regional);
  }

  const dados: DadosTarefasEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosTarefasFiltrado(
      cicloGestaoData,
      escolasData,
      (e) => e.id === escola.id
    );
    dados.push({
      ...dadosEscola,
      escola: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional,
    });
  });

  return dados.sort((a, b) => a.escola.localeCompare(b.escola));
}

function calcularDadosProdutosFiltrado(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosProdutos {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const dadosFiltrados = cicloGestaoData.filter((row) =>
    escolaIds.has(row.escola_id)
  );

  let total = 0;
  let faixa0_25 = 0;
  let faixa26_50 = 0;
  let faixa51_75 = 0;
  let faixa76_100 = 0;
  let somaPercentuais = 0;

  dadosFiltrados.forEach((row) => {
    const produtoStatus = row.produto_status?.trim() || "";
    
    if (produtoStatus) {
      total++;
      
      // Extrair o valor numérico do status (ex: "0-25" -> 12.5, "26-50" -> 38, etc)
      let percentualMedio = 0;
      
      // Normalizar o formato (aceita tanto "0-25" quanto "0 – 25")
      const statusNormalizado = produtoStatus.replace(/[–—]/g, "-").trim();
      
      if (statusNormalizado === "0-25") {
        faixa0_25++;
        percentualMedio = 12.5; // média da faixa
      } else if (statusNormalizado === "26-50") {
        faixa26_50++;
        percentualMedio = 38; // média da faixa
      } else if (statusNormalizado === "51-75") {
        faixa51_75++;
        percentualMedio = 63; // média da faixa
      } else if (statusNormalizado === "76-100") {
        faixa76_100++;
        percentualMedio = 88; // média da faixa
      }
      
      somaPercentuais += percentualMedio;
    }
  });

  const percentualMedio = total > 0 ? somaPercentuais / total : 0;

  return {
    total,
    faixa0_25,
    faixa26_50,
    faixa51_75,
    faixa76_100,
    percentualMedio,
  };
}

export function calcularDadosProdutos(
  cicloGestaoData: CicloGestaoRow[]
): DadosProdutos {
  let total = 0;
  let faixa0_25 = 0;
  let faixa26_50 = 0;
  let faixa51_75 = 0;
  let faixa76_100 = 0;
  let somaPercentuais = 0;

  cicloGestaoData.forEach((row) => {
    const produtoStatus = row.produto_status?.trim() || "";
    
    if (produtoStatus) {
      total++;
      
      // Extrair o valor numérico do status (ex: "0-25" -> 12.5, "26-50" -> 38, etc)
      let percentualMedio = 0;
      
      // Normalizar o formato (aceita tanto "0-25" quanto "0 – 25")
      const statusNormalizado = produtoStatus.replace(/[–—]/g, "-").trim();
      
      if (statusNormalizado === "0-25") {
        faixa0_25++;
        percentualMedio = 12.5; // média da faixa
      } else if (statusNormalizado === "26-50") {
        faixa26_50++;
        percentualMedio = 38; // média da faixa
      } else if (statusNormalizado === "51-75") {
        faixa51_75++;
        percentualMedio = 63; // média da faixa
      } else if (statusNormalizado === "76-100") {
        faixa76_100++;
        percentualMedio = 88; // média da faixa
      }
      
      somaPercentuais += percentualMedio;
    }
  });

  const percentualMedio = total > 0 ? somaPercentuais / total : 0;

  return {
    total,
    faixa0_25,
    faixa26_50,
    faixa51_75,
    faixa76_100,
    percentualMedio,
  };
}

export function calcularDadosProdutosRegionais(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[]
): DadosProdutosRegional[] {
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: DadosProdutosRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosProdutosFiltrado(
      cicloGestaoData,
      escolasData,
      (escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

export function calcularDadosProdutosMunicipios(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  regional?: string
): DadosProdutosMunicipio[] {
  let escolasFiltradas = escolasData;
  if (regional) {
    escolasFiltradas = escolasData.filter((e) => e.regional === regional);
  }

  const municipiosMap = new Map<string, { municipio: string; regional: string }>();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { municipio: e.municipio, regional: e.regional });
    }
  });

  const dados: DadosProdutosMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosProdutosFiltrado(
      cicloGestaoData,
      escolasData,
      (escola) => escola.municipio === municipio && escola.regional === reg
    );
    dados.push({
      ...dadosMunicipio,
      municipio,
      regional: reg,
    });
  });

  return dados.sort((a, b) => a.municipio.localeCompare(b.municipio));
}

export function calcularDadosProdutosEscolas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  municipio?: string,
  regional?: string
): DadosProdutosEscola[] {
  let escolasFiltradas = escolasData;
  if (municipio) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.municipio === municipio);
  }
  if (regional) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.regional === regional);
  }

  const dados: DadosProdutosEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosProdutosFiltrado(
      cicloGestaoData,
      escolasData,
      (e) => e.id === escola.id
    );
    dados.push({
      ...dadosEscola,
      escola: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional,
    });
  });

  return dados.sort((a, b) => a.escola.localeCompare(b.escola));
}

function calcularDadosVisitasTecnicasFiltrado(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosVisitasTecnicas {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const dadosFiltrados = cicloGestaoData.filter((row) =>
    escolaIds.has(row.escola_id)
  );

  // Agrupar por escola para evitar duplicação (cada escola tem múltiplos mapas)
  const escolasMap = new Map<string, {
    esperadas: number;
    atasAssinadas: number;
    ciclo1: number;
    ciclo2: number;
    ciclo3: number;
  }>();

  dadosFiltrados.forEach((row) => {
    const escolaId = row.escola_id;
    
    if (!escolasMap.has(escolaId)) {
      escolasMap.set(escolaId, {
        esperadas: 0,
        atasAssinadas: 0,
        ciclo1: 0,
        ciclo2: 0,
        ciclo3: 0,
      });
    }

    const dadosEscola = escolasMap.get(escolaId)!;
    
    // Pegar valores do primeiro mapa de cada escola (valores são iguais para todos os mapas da mesma escola)
    if (dadosEscola.esperadas === 0) {
      dadosEscola.esperadas = parseInt(row.visitas_tecnicas_esperadas) || 0;
      dadosEscola.atasAssinadas = parseInt(row.visitas_tecnicas_atas_assinadas) || 0;
      dadosEscola.ciclo1 = parseInt(row.visitas_tecnicas_ciclo1) || 0;
      dadosEscola.ciclo2 = parseInt(row.visitas_tecnicas_ciclo2) || 0;
      dadosEscola.ciclo3 = parseInt(row.visitas_tecnicas_ciclo3) || 0;
    }
  });

  let totalEsperadas = 0;
  let totalAtasAssinadas = 0;
  let totalCiclo1 = 0;
  let totalCiclo2 = 0;
  let totalCiclo3 = 0;

  escolasMap.forEach((dados) => {
    totalEsperadas += dados.esperadas;
    totalAtasAssinadas += dados.atasAssinadas;
    totalCiclo1 += dados.ciclo1;
    totalCiclo2 += dados.ciclo2;
    totalCiclo3 += dados.ciclo3;
  });

  const percentualPendentes = totalEsperadas > 0
    ? ((totalEsperadas - totalAtasAssinadas) / totalEsperadas) * 100
    : 0;

  return {
    esperadas: totalEsperadas,
    atasAssinadas: totalAtasAssinadas,
    ciclo1: totalCiclo1,
    ciclo2: totalCiclo2,
    ciclo3: totalCiclo3,
    percentualPendentes,
  };
}

export function calcularDadosVisitasTecnicas(
  cicloGestaoData: CicloGestaoRow[]
): DadosVisitasTecnicas {
  // Agrupar por escola para evitar duplicação
  const escolasMap = new Map<string, {
    esperadas: number;
    atasAssinadas: number;
    ciclo1: number;
    ciclo2: number;
    ciclo3: number;
  }>();

  cicloGestaoData.forEach((row) => {
    const escolaId = row.escola_id;
    
    if (!escolasMap.has(escolaId)) {
      escolasMap.set(escolaId, {
        esperadas: 0,
        atasAssinadas: 0,
        ciclo1: 0,
        ciclo2: 0,
        ciclo3: 0,
      });
    }

    const dadosEscola = escolasMap.get(escolaId)!;
    
    // Pegar valores do primeiro mapa de cada escola
    if (dadosEscola.esperadas === 0) {
      dadosEscola.esperadas = parseInt(row.visitas_tecnicas_esperadas) || 0;
      dadosEscola.atasAssinadas = parseInt(row.visitas_tecnicas_atas_assinadas) || 0;
      dadosEscola.ciclo1 = parseInt(row.visitas_tecnicas_ciclo1) || 0;
      dadosEscola.ciclo2 = parseInt(row.visitas_tecnicas_ciclo2) || 0;
      dadosEscola.ciclo3 = parseInt(row.visitas_tecnicas_ciclo3) || 0;
    }
  });

  let totalEsperadas = 0;
  let totalAtasAssinadas = 0;
  let totalCiclo1 = 0;
  let totalCiclo2 = 0;
  let totalCiclo3 = 0;

  escolasMap.forEach((dados) => {
    totalEsperadas += dados.esperadas;
    totalAtasAssinadas += dados.atasAssinadas;
    totalCiclo1 += dados.ciclo1;
    totalCiclo2 += dados.ciclo2;
    totalCiclo3 += dados.ciclo3;
  });

  const percentualPendentes = totalEsperadas > 0
    ? ((totalEsperadas - totalAtasAssinadas) / totalEsperadas) * 100
    : 0;

  return {
    esperadas: totalEsperadas,
    atasAssinadas: totalAtasAssinadas,
    ciclo1: totalCiclo1,
    ciclo2: totalCiclo2,
    ciclo3: totalCiclo3,
    percentualPendentes,
  };
}

export function calcularDadosVisitasTecnicasRegionais(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[]
): DadosVisitasTecnicasRegional[] {
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: DadosVisitasTecnicasRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosVisitasTecnicasFiltrado(
      cicloGestaoData,
      escolasData,
      (escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

export function calcularDadosVisitasTecnicasMunicipios(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  regional?: string
): DadosVisitasTecnicasMunicipio[] {
  let escolasFiltradas = escolasData;
  if (regional) {
    escolasFiltradas = escolasData.filter((e) => e.regional === regional);
  }

  const municipiosMap = new Map<string, { municipio: string; regional: string }>();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { municipio: e.municipio, regional: e.regional });
    }
  });

  const dados: DadosVisitasTecnicasMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosVisitasTecnicasFiltrado(
      cicloGestaoData,
      escolasData,
      (escola) => escola.municipio === municipio && escola.regional === reg
    );
    dados.push({
      ...dadosMunicipio,
      municipio,
      regional: reg,
    });
  });

  return dados.sort((a, b) => a.municipio.localeCompare(b.municipio));
}

export function calcularDadosVisitasTecnicasEscolas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  municipio?: string,
  regional?: string
): DadosVisitasTecnicasEscola[] {
  let escolasFiltradas = escolasData;
  if (municipio) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.municipio === municipio);
  }
  if (regional) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.regional === regional);
  }

  const dados: DadosVisitasTecnicasEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosVisitasTecnicasFiltrado(
      cicloGestaoData,
      escolasData,
      (e) => e.id === escola.id
    );
    dados.push({
      ...dadosEscola,
      escola: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional,
    });
  });

  return dados.sort((a, b) => a.escola.localeCompare(b.escola));
}


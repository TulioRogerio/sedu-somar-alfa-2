// Script para calcular e gerar CSV com indicadores agregados
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para parsear CSV corretamente (lidando com campos entre aspas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Função para carregar CSV
function carregarCSV(caminho) {
  const csvContent = fs.readFileSync(caminho, 'utf8');
  const linhas = csvContent.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(linhas[0]);
  
  const dados = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = parseCSVLine(linhas[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = valores[index]?.trim() || '';
    });
    dados.push(row);
  }
  
  return { headers, dados };
}

// Calcular indicador de Aulas Dadas
function calcularIndicadorAulasDadas(dados) {
  if (!dados || dados.length === 0) return 0;
  
  let totalPrevistas = 0;
  let totalDadas = 0;
  
  dados.forEach(row => {
    totalPrevistas += (parseInt(row.aulas_previstas_LP) || 0) +
                      (parseInt(row.aulas_previstas_Mat) || 0) +
                      (parseInt(row.aulas_previstas_Ciencias) || 0) +
                      (parseInt(row.aulas_previstas_Historia) || 0) +
                      (parseInt(row.aulas_previstas_Geografia) || 0);
    
    totalDadas += (parseInt(row.aulas_dadas_LP) || 0) +
                  (parseInt(row.aulas_dadas_Mat) || 0) +
                  (parseInt(row.aulas_dadas_Ciencias) || 0) +
                  (parseInt(row.aulas_dadas_Historia) || 0) +
                  (parseInt(row.aulas_dadas_Geografia) || 0);
  });
  
  if (totalPrevistas === 0) return 0;
  const percentual = (totalDadas / totalPrevistas) * 100;
  return Math.min(100, Math.max(0, percentual));
}

// Calcular indicador de Frequência
function calcularIndicadorFrequencia(dados) {
  if (!dados || dados.length === 0) return 0;
  
  const totalPresencas = dados.filter(row => {
    const presenca = row['Presença/Falta'] || row.Presença_Falta || row.presenca_falta || '';
    return presenca === 'P';
  }).length;
  const total = dados.length;
  
  if (total === 0) return 0;
  const percentual = (totalPresencas / total) * 100;
  return Math.min(100, Math.max(0, percentual));
}

// Calcular indicador de Tarefas
function calcularIndicadorTarefas(dados) {
  if (!dados || dados.length === 0) return 0;
  
  let total = 0;
  let concluidas = 0;
  let concluidasAtraso = 0;
  
  dados.forEach(row => {
    total += parseInt(row.tarefas_total) || 0;
    concluidas += parseInt(row.tarefas_concluidas) || 0;
    concluidasAtraso += parseInt(row.tarefas_concluidas_atraso) || 0;
  });
  
  if (total === 0) return 0;
  const percentual = ((concluidas + concluidasAtraso) / total) * 100;
  return Math.min(100, Math.max(0, percentual));
}

// Calcular indicador de Produtos
function calcularIndicadorProdutos(dados) {
  if (!dados || dados.length === 0) return 0;
  
  let total = 0;
  let somaPercentuais = 0;
  
  dados.forEach(row => {
    const status = (row.produto_status || '').trim();
    if (status) {
      total++;
      let percentualMedio = 0;
      
      const statusNormalizado = status.replace(/[–—]/g, '-').trim();
      if (statusNormalizado === '0-25') {
        percentualMedio = 12.5;
      } else if (statusNormalizado === '26-50') {
        percentualMedio = 38;
      } else if (statusNormalizado === '51-75') {
        percentualMedio = 63;
      } else if (statusNormalizado === '76-100') {
        percentualMedio = 88;
      }
      
      somaPercentuais += percentualMedio;
    }
  });
  
  if (total === 0) return 0;
  return somaPercentuais / total;
}

// Calcular indicador de Visitas Técnicas
function calcularIndicadorVisitasTecnicas(dados) {
  if (!dados || dados.length === 0) return 0;
  
  let totalEsperadas = 0;
  let totalAtasAssinadas = 0;
  
  dados.forEach(row => {
    // Cada linha é uma visita esperada
    totalEsperadas++;
    if (row.ata_assinada === 'true') {
      totalAtasAssinadas++;
    }
  });
  
  if (totalEsperadas === 0) return 0;
  const percentual = (totalAtasAssinadas / totalEsperadas) * 100;
  return Math.min(100, Math.max(0, percentual));
}

// Função principal
function gerarIndicadores() {
  console.log('Iniciando cálculo de indicadores...\n');
  
  // Carregar dados
  const publicDir = join(__dirname, '..', 'public');
  const dataDir = join(__dirname, '..', 'data');
  
  console.log('Carregando CSVs...');
  const escolas = carregarCSV(join(publicDir, 'escolas.csv'));
  const aulasDadas = carregarCSV(join(publicDir, 'aulas-dadas.csv'));
  const frequencia = carregarCSV(join(publicDir, 'frequencia-estudantes.csv'));
  const cicloGestao = carregarCSV(join(publicDir, 'ciclo-gestao.csv'));
  const visitasTecnicas = carregarCSV(join(publicDir, 'visitas-tecnicas.csv'));
  
  console.log(`  - Escolas: ${escolas.dados.length}`);
  console.log(`  - Aulas Dadas: ${aulasDadas.dados.length} registros`);
  console.log(`  - Frequência: ${frequencia.dados.length} registros`);
  console.log(`  - Ciclo Gestão: ${cicloGestao.dados.length} registros`);
  console.log(`  - Visitas Técnicas: ${visitasTecnicas.dados.length} registros\n`);
  
  // Criar mapa de escolas
  const escolasMap = new Map();
  escolas.dados.forEach(escola => {
    escolasMap.set(parseInt(escola.id), {
      id: parseInt(escola.id),
      nome: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional
    });
  });
  
  // Agrupar dados por escola
  const dadosPorEscola = new Map();
  
  // Processar Aulas Dadas
  aulasDadas.dados.forEach(row => {
    const escolaId = parseInt(row.escola_id);
    if (!dadosPorEscola.has(escolaId)) {
      dadosPorEscola.set(escolaId, {
        escola_id: escolaId,
        aulasDadas: [],
        frequencia: [],
        tarefas: [],
        produtos: [],
        visitasTecnicas: []
      });
    }
    dadosPorEscola.get(escolaId).aulasDadas.push(row);
  });
  
  // Processar Frequência
  // Criar mapa de nomes de escolas para IDs
  const escolasNomeMap = new Map();
  escolas.dados.forEach(escola => {
    escolasNomeMap.set(escola.nome.toLowerCase().trim(), parseInt(escola.id));
  });
  
  frequencia.dados.forEach(row => {
    const nomeEscola = (row.Escola || '').trim();
    const escolaId = escolasNomeMap.get(nomeEscola.toLowerCase());
    if (escolaId) {
      if (!dadosPorEscola.has(escolaId)) {
        dadosPorEscola.set(escolaId, {
          escola_id: escolaId,
          aulasDadas: [],
          frequencia: [],
          tarefas: [],
          produtos: [],
          visitasTecnicas: []
        });
      }
      dadosPorEscola.get(escolaId).frequencia.push(row);
    }
  });
  
  // Processar Ciclo Gestão (Tarefas e Produtos)
  cicloGestao.dados.forEach(row => {
    const escolaId = parseInt(row.escola_id);
    if (!dadosPorEscola.has(escolaId)) {
      dadosPorEscola.set(escolaId, {
        escola_id: escolaId,
        aulasDadas: [],
        frequencia: [],
        tarefas: [],
        produtos: [],
        visitasTecnicas: []
      });
    }
    dadosPorEscola.get(escolaId).tarefas.push(row);
    dadosPorEscola.get(escolaId).produtos.push(row);
  });
  
  // Processar Visitas Técnicas
  visitasTecnicas.dados.forEach(row => {
    const escolaId = parseInt(row.escola_id);
    if (!dadosPorEscola.has(escolaId)) {
      dadosPorEscola.set(escolaId, {
        escola_id: escolaId,
        aulasDadas: [],
        frequencia: [],
        tarefas: [],
        produtos: [],
        visitasTecnicas: []
      });
    }
    dadosPorEscola.get(escolaId).visitasTecnicas.push(row);
  });
  
  // Calcular indicadores por escola
  console.log('Calculando indicadores por escola...');
  const indicadores = [];
  
  dadosPorEscola.forEach((dados, escolaId) => {
    const escola = escolasMap.get(escolaId);
    if (!escola) return;
    
    const indicadorAulasDadas = calcularIndicadorAulasDadas(dados.aulasDadas);
    const indicadorFrequencia = calcularIndicadorFrequencia(dados.frequencia);
    const indicadorTarefas = calcularIndicadorTarefas(dados.tarefas);
    const indicadorProdutos = calcularIndicadorProdutos(dados.produtos);
    const indicadorVisitasTecnicas = calcularIndicadorVisitasTecnicas(dados.visitasTecnicas);
    
    indicadores.push({
      escola_id: escolaId,
      escola_nome: escola.nome,
      regional: escola.regional,
      municipio: escola.municipio,
      indicador_aulas_dadas: indicadorAulasDadas.toFixed(2),
      indicador_frequencia: indicadorFrequencia.toFixed(2),
      indicador_tarefas: indicadorTarefas.toFixed(2),
      indicador_produtos: indicadorProdutos.toFixed(2),
      indicador_visitas_tecnicas: indicadorVisitasTecnicas.toFixed(2)
    });
  });
  
  // Calcular indicadores agregados (Estado, Regionais, Municípios)
  console.log('Calculando indicadores agregados...');
  
  // Por Regional
  const indicadoresPorRegional = new Map();
  indicadores.forEach(ind => {
    if (!indicadoresPorRegional.has(ind.regional)) {
      indicadoresPorRegional.set(ind.regional, {
        regional: ind.regional,
        escolas: [],
        aulasDadas: [],
        frequencia: [],
        tarefas: [],
        produtos: [],
        visitasTecnicas: []
      });
    }
    const dados = indicadoresPorRegional.get(ind.regional);
    dados.escolas.push(ind);
  });
  
  // Agregar dados por regional
  // escolasNomeMap já foi criado anteriormente
  indicadoresPorRegional.forEach((dados, regional) => {
    const escolasIds = dados.escolas.map(e => e.escola_id);
    
    // Agregar dados brutos
    aulasDadas.dados.forEach(row => {
      if (escolasIds.includes(parseInt(row.escola_id))) {
        dados.aulasDadas.push(row);
      }
    });
    
    frequencia.dados.forEach(row => {
      const nomeEscola = (row.Escola || '').trim();
      const escolaId = escolasNomeMap.get(nomeEscola.toLowerCase());
      if (escolaId && escolasIds.includes(escolaId)) {
        dados.frequencia.push(row);
      }
    });
    
    cicloGestao.dados.forEach(row => {
      if (escolasIds.includes(parseInt(row.escola_id))) {
        dados.tarefas.push(row);
        dados.produtos.push(row);
      }
    });
    
    visitasTecnicas.dados.forEach(row => {
      if (escolasIds.includes(parseInt(row.escola_id))) {
        dados.visitasTecnicas.push(row);
      }
    });
  });
  
  // Calcular indicadores por regional
  indicadoresPorRegional.forEach((dados, regional) => {
    const indicadorAulasDadas = calcularIndicadorAulasDadas(dados.aulasDadas);
    const indicadorFrequencia = calcularIndicadorFrequencia(dados.frequencia);
    const indicadorTarefas = calcularIndicadorTarefas(dados.tarefas);
    const indicadorProdutos = calcularIndicadorProdutos(dados.produtos);
    const indicadorVisitasTecnicas = calcularIndicadorVisitasTecnicas(dados.visitasTecnicas);
    
    indicadores.push({
      escola_id: '',
      escola_nome: '',
      regional: regional,
      municipio: '',
      indicador_aulas_dadas: indicadorAulasDadas.toFixed(2),
      indicador_frequencia: indicadorFrequencia.toFixed(2),
      indicador_tarefas: indicadorTarefas.toFixed(2),
      indicador_produtos: indicadorProdutos.toFixed(2),
      indicador_visitas_tecnicas: indicadorVisitasTecnicas.toFixed(2)
    });
  });
  
  // Por Município
  const indicadoresPorMunicipio = new Map();
  indicadores.filter(ind => ind.escola_id).forEach(ind => {
    const key = `${ind.municipio}-${ind.regional}`;
    if (!indicadoresPorMunicipio.has(key)) {
      indicadoresPorMunicipio.set(key, {
        municipio: ind.municipio,
        regional: ind.regional,
        escolas: []
      });
    }
    indicadoresPorMunicipio.get(key).escolas.push(ind);
  });
  
  // Agregar dados por município
  indicadoresPorMunicipio.forEach((dados, key) => {
    const escolasIds = dados.escolas.map(e => e.escola_id);
    
    const aulasDadasMunicipio = aulasDadas.dados.filter(row => 
      escolasIds.includes(parseInt(row.escola_id))
    );
    const frequenciaMunicipio = frequencia.dados.filter(row => {
      const nomeEscola = (row.Escola || '').trim();
      const escolaId = escolasNomeMap.get(nomeEscola.toLowerCase());
      return escolaId && escolasIds.includes(escolaId);
    });
    const tarefasMunicipio = cicloGestao.dados.filter(row => 
      escolasIds.includes(parseInt(row.escola_id))
    );
    const produtosMunicipio = cicloGestao.dados.filter(row => 
      escolasIds.includes(parseInt(row.escola_id))
    );
    const visitasTecnicasMunicipio = visitasTecnicas.dados.filter(row => 
      escolasIds.includes(parseInt(row.escola_id))
    );
    
    const indicadorAulasDadas = calcularIndicadorAulasDadas(aulasDadasMunicipio);
    const indicadorFrequencia = calcularIndicadorFrequencia(frequenciaMunicipio);
    const indicadorTarefas = calcularIndicadorTarefas(tarefasMunicipio);
    const indicadorProdutos = calcularIndicadorProdutos(produtosMunicipio);
    const indicadorVisitasTecnicas = calcularIndicadorVisitasTecnicas(visitasTecnicasMunicipio);
    
    indicadores.push({
      escola_id: '',
      escola_nome: '',
      regional: dados.regional,
      municipio: dados.municipio,
      indicador_aulas_dadas: indicadorAulasDadas.toFixed(2),
      indicador_frequencia: indicadorFrequencia.toFixed(2),
      indicador_tarefas: indicadorTarefas.toFixed(2),
      indicador_produtos: indicadorProdutos.toFixed(2),
      indicador_visitas_tecnicas: indicadorVisitasTecnicas.toFixed(2)
    });
  });
  
  // Estado (todos os dados)
  const indicadorAulasDadasEstado = calcularIndicadorAulasDadas(aulasDadas.dados);
  const indicadorFrequenciaEstado = calcularIndicadorFrequencia(frequencia.dados);
  const indicadorTarefasEstado = calcularIndicadorTarefas(cicloGestao.dados);
  const indicadorProdutosEstado = calcularIndicadorProdutos(cicloGestao.dados);
  const indicadorVisitasTecnicasEstado = calcularIndicadorVisitasTecnicas(visitasTecnicas.dados);
  
  indicadores.push({
    escola_id: '',
    escola_nome: 'Espírito Santo',
    regional: '',
    municipio: '',
    indicador_aulas_dadas: indicadorAulasDadasEstado.toFixed(2),
    indicador_frequencia: indicadorFrequenciaEstado.toFixed(2),
    indicador_tarefas: indicadorTarefasEstado.toFixed(2),
    indicador_produtos: indicadorProdutosEstado.toFixed(2),
    indicador_visitas_tecnicas: indicadorVisitasTecnicasEstado.toFixed(2)
  });
  
  // Gerar CSV
  const headers = [
    'escola_id',
    'escola_nome',
    'regional',
    'municipio',
    'indicador_aulas_dadas',
    'indicador_frequencia',
    'indicador_tarefas',
    'indicador_produtos',
    'indicador_visitas_tecnicas'
  ];
  
  const linhas = [headers.join(',')];
  indicadores.forEach(ind => {
    const linha = [
      ind.escola_id || '',
      `"${ind.escola_nome || ''}"`,
      `"${ind.regional || ''}"`,
      `"${ind.municipio || ''}"`,
      ind.indicador_aulas_dadas,
      ind.indicador_frequencia,
      ind.indicador_tarefas,
      ind.indicador_produtos,
      ind.indicador_visitas_tecnicas
    ].join(',');
    linhas.push(linha);
  });
  
  const csvContent = linhas.join('\n');
  const publicPath = join(publicDir, 'indicadores.csv');
  const dataPath = join(dataDir, 'indicadores.csv');
  
  console.log('\nEscrevendo arquivos...');
  fs.writeFileSync(publicPath, csvContent, 'utf8');
  console.log(`✓ Arquivo criado: ${publicPath}`);
  
  fs.writeFileSync(dataPath, csvContent, 'utf8');
  console.log(`✓ Arquivo criado: ${dataPath}`);
  
  console.log(`\n✓ CSV de indicadores gerado com sucesso!`);
  console.log(`  - Total de registros: ${indicadores.length}`);
  console.log(`  - Escolas: ${indicadores.filter(i => i.escola_id).length}`);
  console.log(`  - Regionais: ${indicadores.filter(i => !i.escola_id && i.regional && !i.municipio).length}`);
  console.log(`  - Municípios: ${indicadores.filter(i => !i.escola_id && i.municipio).length}`);
  console.log(`  - Estado: 1`);
}

gerarIndicadores();


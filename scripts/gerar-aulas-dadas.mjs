// Script para gerar CSV de aulas dadas de forma dinâmica
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para obter dias úteis de um mês
function getDiasUteis(ano, mes) {
  const dias = [];
  const ultimoDia = new Date(ano, mes, 0).getDate();
  
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    if (diaSemana > 0 && diaSemana < 6) {
      dias.push(data);
    }
  }
  
  return dias;
}

// Função para formatar data
function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

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

// Carregar e parsear CSV de escolas
function carregarEscolas() {
  const csvPath = join(__dirname, '..', 'public', 'escolas.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const linhas = csvContent.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(linhas[0]);
  
  const escolas = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = parseCSVLine(linhas[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = valores[index]?.trim() || '';
    });
    
    // Determinar turmas: séries do 1º ao 5º ano do ensino fundamental
    const turmas = [];
    if (row.ensino_fundamental === 'true') {
      // Adicionar séries do 1º ao 5º ano
      turmas.push('1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano');
    }
    
    if (turmas.length > 0) {
      escolas.push({
        id: parseInt(row.id),
        nome: row.nome,
        municipio: row.municipio,
        regional: row.regional,
        turmas: turmas
      });
    }
  }
  
  return escolas;
}

// Gerar CSV
function gerarCSV() {
  console.log('Iniciando geração do CSV de aulas dadas...');
  const escolas = carregarEscolas();
  console.log(`Total de escolas encontradas: ${escolas.length}`);
  
  // Obter todos os dias úteis de fev, mar e abr 2025
  const diasFev = getDiasUteis(2025, 2);
  const diasMar = getDiasUteis(2025, 3);
  const diasAbr = getDiasUteis(2025, 4);
  const todosDias = [...diasFev, ...diasMar, ...diasAbr];
  
  console.log(`Total de dias úteis: ${todosDias.length}`);
  console.log(`  - Fevereiro: ${diasFev.length} dias`);
  console.log(`  - Março: ${diasMar.length} dias`);
  console.log(`  - Abril: ${diasAbr.length} dias`);
  
  const linhas = ['escola_id,escola_nome,regional,municipio,turma,data,dia_letivo,aulas_previstas_LP,aulas_previstas_Mat,aulas_previstas_Ciencias,aulas_previstas_Historia,aulas_previstas_Geografia,aulas_dadas_LP,aulas_dadas_Mat,aulas_dadas_Ciencias,aulas_dadas_Historia,aulas_dadas_Geografia'];
  
  let totalLinhas = 0;
  
  escolas.forEach((escola, idxEscola) => {
    escola.turmas.forEach(turma => {
      let diaLetivo = 1;
      todosDias.forEach((data) => {
        // Gerar número total de aulas previstas (geralmente 5 ou 6 aulas por dia)
        const totalAulasPrevistas = Math.floor(Math.random() * 2) + 5; // 5 ou 6 aulas
        
        // Dividir aulas previstas entre as disciplinas
        // LP: 1-2 aulas, Mat: 1-2 aulas, Ciências: 0-1, História: 0-1, Geografia: 0-1
        const previstasLP = Math.floor(Math.random() * 2) + 1; // 1 ou 2 aulas
        const previstasMat = Math.floor(Math.random() * 2) + 1; // 1 ou 2 aulas
        const restante = totalAulasPrevistas - previstasLP - previstasMat;
        
        // Distribuir o restante entre Ciências, História e Geografia
        const previstasCiencias = restante > 0 ? Math.min(1, Math.floor(Math.random() * 2)) : 0;
        const restante2 = restante - previstasCiencias;
        const previstasHistoria = restante2 > 0 ? Math.min(1, Math.floor(Math.random() * 2)) : 0;
        const previstasGeografia = restante2 - previstasHistoria;
        
        // Gerar percentual individual para cada disciplina em torno de 95% (entre 93% e 97%)
        // Cada disciplina terá seu próprio percentual variando independentemente
        const percentualLP = 0.95 + (Math.random() * 0.04 - 0.02); // Entre 0.93 e 0.97
        const percentualMat = 0.95 + (Math.random() * 0.04 - 0.02);
        const percentualCiencias = previstasCiencias > 0 ? 0.95 + (Math.random() * 0.04 - 0.02) : 0;
        const percentualHistoria = previstasHistoria > 0 ? 0.95 + (Math.random() * 0.04 - 0.02) : 0;
        const percentualGeografia = previstasGeografia > 0 ? 0.95 + (Math.random() * 0.04 - 0.02) : 0;
        
        // Calcular aulas dadas por disciplina usando probabilidade para garantir percentual correto
        // Para cada aula prevista, há uma probabilidade igual ao percentual de ser dada
        const calcularAulasDadas = (previstas, percentual) => {
          if (previstas === 0) return 0;
          let dadas = 0;
          // Para cada aula prevista, decidir se foi dada baseado na probabilidade
          for (let i = 0; i < previstas; i++) {
            if (Math.random() < percentual) {
              dadas++;
            }
          }
          return dadas;
        };
        
        const aulasDadasLP = calcularAulasDadas(previstasLP, percentualLP);
        const aulasDadasMat = calcularAulasDadas(previstasMat, percentualMat);
        const aulasDadasCiencias = calcularAulasDadas(previstasCiencias, percentualCiencias);
        const aulasDadasHistoria = calcularAulasDadas(previstasHistoria, percentualHistoria);
        const aulasDadasGeografia = calcularAulasDadas(previstasGeografia, percentualGeografia);
        
        const linha = [
          escola.id,
          `"${escola.nome}"`,
          `"${escola.regional}"`,
          `"${escola.municipio}"`,
          `"${turma}"`,
          formatarData(data),
          diaLetivo++,
          previstasLP,
          previstasMat,
          previstasCiencias,
          previstasHistoria,
          previstasGeografia,
          aulasDadasLP,
          aulasDadasMat,
          aulasDadasCiencias,
          aulasDadasHistoria,
          aulasDadasGeografia
        ].join(',');
        
        linhas.push(linha);
        totalLinhas++;
      });
    });
    
    if ((idxEscola + 1) % 5 === 0) {
      console.log(`Processadas ${idxEscola + 1}/${escolas.length} escolas...`);
    }
  });
  
  const csvContent = linhas.join('\n');
  const publicPath = join(__dirname, '..', 'public', 'aulas-dadas.csv');
  const dataPath = join(__dirname, '..', 'data', 'aulas-dadas.csv');
  
  console.log('\nEscrevendo arquivos...');
  fs.writeFileSync(publicPath, csvContent, 'utf8');
  console.log(`✓ Arquivo criado: ${publicPath}`);
  
  fs.writeFileSync(dataPath, csvContent, 'utf8');
  console.log(`✓ Arquivo criado: ${dataPath}`);
  
  console.log(`\n✓ CSV gerado com sucesso!`);
  console.log(`  - Total de escolas: ${escolas.length}`);
  console.log(`  - Total de turmas: ${escolas.reduce((sum, e) => sum + e.turmas.length, 0)}`);
  console.log(`  - Total de registros: ${totalLinhas}`);
}

gerarCSV();

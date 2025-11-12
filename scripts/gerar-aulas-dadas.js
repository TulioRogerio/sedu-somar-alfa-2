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
    // 0 = Domingo, 6 = Sábado
    if (diaSemana > 0 && diaSemana < 6) {
      dias.push(data);
    }
  }
  
  return dias;
}

// Função para formatar data como YYYY-MM-DD
function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Carregar escolas do CSV
async function carregarEscolas() {
  try {
    const csvPath = join(__dirname, '..', 'public', 'escolas.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const linhas = csvContent.split('\n');
    const headers = linhas[0].split(',');
    
    const escolas = [];
    for (let i = 1; i < linhas.length; i++) {
      if (!linhas[i].trim()) continue;
      
      const valores = linhas[i].split(',');
      const escola = {};
      headers.forEach((header, index) => {
        escola[header.trim()] = valores[index]?.trim() || '';
      });
      
      // Determinar turmas baseado no tipo de ensino
      const turmas = [];
      if (escola.ensino_fundamental === 'true') {
        turmas.push('6º Ano', '7º Ano', '8º Ano', '9º Ano');
      }
      if (escola.ensino_medio === 'true') {
        turmas.push('1ª Série', '2ª Série', '3ª Série');
      }
      
      escolas.push({
        id: parseInt(escola.id),
        nome: escola.nome,
        municipio: escola.municipio,
        regional: escola.regional,
        turmas: turmas
      });
    }
    
    return escolas;
  } catch (error) {
    console.error('Erro ao carregar escolas:', error);
    return [];
  }
}

// Gerar CSV
async function gerarCSV() {
  const escolas = await carregarEscolas();
  
  // Obter todos os dias úteis de fev, mar e abr 2025
  const diasFev = getDiasUteis(2025, 2);
  const diasMar = getDiasUteis(2025, 3);
  const diasAbr = getDiasUteis(2025, 4);
  const todosDias = [...diasFev, ...diasMar, ...diasAbr];
  
  const linhas = ['escola_id,escola_nome,regional,municipio,turma,data,dia_letivo,aulas_dadas'];
  
  escolas.forEach(escola => {
    escola.turmas.forEach(turma => {
      let diaLetivo = 1;
      todosDias.forEach((data) => {
        // Gerar número aleatório de aulas dadas (entre 4 e 6 aulas por dia)
        const aulasDadas = Math.floor(Math.random() * 3) + 4; // 4, 5 ou 6
        
        const linha = [
          escola.id,
          `"${escola.nome}"`,
          `"${escola.regional}"`,
          `"${escola.municipio}"`,
          `"${turma}"`,
          formatarData(data),
          diaLetivo++,
          aulasDadas
        ].join(',');
        
        linhas.push(linha);
      });
    });
  });
  
  const csvContent = linhas.join('\n');
  const publicPath = join(__dirname, '..', 'public', 'aulas-dadas.csv');
  const dataPath = join(__dirname, '..', 'data', 'aulas-dadas.csv');
  
  fs.writeFileSync(publicPath, csvContent, 'utf8');
  fs.writeFileSync(dataPath, csvContent, 'utf8');
  
  console.log(`CSV gerado com sucesso!`);
  console.log(`Total de linhas: ${linhas.length - 1}`);
  console.log(`Arquivos criados:`);
  console.log(`  - ${publicPath}`);
  console.log(`  - ${dataPath}`);
}

gerarCSV().catch(console.error);


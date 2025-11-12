// Script para gerar CSV de frequência dos estudantes
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

// Gerar nomes fictícios de alunos
function gerarNomeAluno(indice) {
  const nomes = [
    'Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena',
    'Igor', 'Juliana', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Pedro', 'Rafaela',
    'Sofia', 'Thiago', 'Valentina', 'Vinicius', 'Amanda', 'Beatriz', 'Caio', 'Davi',
    'Emanuel', 'Felipe', 'Giovanna', 'Henrique', 'Isabela', 'João', 'Larissa', 'Miguel',
    'Natália', 'Otávio', 'Paula', 'Rafael', 'Sabrina', 'Tatiana', 'Victor', 'Yasmin'
  ];
  const sobrenomes = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Ribeiro', 'Carvalho', 'Almeida', 'Martins', 'Lopes', 'Araújo',
    'Fernandes', 'Costa', 'Rocha', 'Dias', 'Ramos', 'Nunes', 'Mendes', 'Moreira',
    'Freitas', 'Barbosa', 'Cunha', 'Melo', 'Cardoso', 'Teixeira', 'Campos', 'Monteiro'
  ];
  
  const nome = nomes[indice % nomes.length];
  const sobrenome1 = sobrenomes[Math.floor(indice / nomes.length) % sobrenomes.length];
  const sobrenome2 = sobrenomes[Math.floor(indice / (nomes.length * sobrenomes.length)) % sobrenomes.length];
  
  return `${nome} ${sobrenome1} ${sobrenome2}`;
}

// Gerar frequência para um aluno (média de 80% com maior dispersão)
function gerarFrequenciaAluno(totalDias) {
  // Frequência individual do aluno: entre 55% e 100% (maior dispersão que aulas dadas)
  // Distribuição enviesada para valores mais altos, mas com maior variância
  // Alguns alunos terão frequência muito baixa (55-70%), outros muito alta (90-100%)
  const r1 = Math.random();
  const r2 = Math.random();
  // Usar máximo de dois randoms para criar distribuição enviesada para valores altos
  // Mas ainda permitir valores baixos para maior dispersão
  let frequenciaAluno;
  if (r1 < 0.2) {
    // 20% dos alunos terão frequência baixa (55-75%)
    frequenciaAluno = 0.55 + (Math.random() * 0.20);
  } else if (r1 < 0.5) {
    // 30% dos alunos terão frequência média (75-85%)
    frequenciaAluno = 0.75 + (Math.random() * 0.10);
  } else {
    // 50% dos alunos terão frequência alta (85-100%)
    frequenciaAluno = 0.85 + (Math.random() * 0.15);
  }
  
  // Garantir que está no range correto
  frequenciaAluno = Math.max(0.55, Math.min(1.0, frequenciaAluno));
  
  const frequencias = [];
  const numPresencas = Math.round(totalDias * frequenciaAluno);
  const numFaltas = totalDias - numPresencas;
  
  // Criar array com número exato de presenças e faltas
  for (let i = 0; i < numPresencas; i++) {
    frequencias.push('P');
  }
  for (let i = 0; i < numFaltas; i++) {
    frequencias.push('F');
  }
  
  // Embaralhar para distribuir presenças e faltas aleatoriamente
  for (let i = frequencias.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [frequencias[i], frequencias[j]] = [frequencias[j], frequencias[i]];
  }
  
  return frequencias;
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
  console.log('Iniciando geração do CSV de frequência dos estudantes...');
  const escolas = carregarEscolas();
  console.log(`Total de escolas encontradas: ${escolas.length}`);
  
  // Obter todos os dias úteis de 2 meses (fevereiro e março de 2025)
  const diasFev = getDiasUteis(2025, 2);
  const diasMar = getDiasUteis(2025, 3);
  const todosDias = [...diasFev, ...diasMar];
  
  console.log(`Total de dias úteis: ${todosDias.length}`);
  console.log(`  - Fevereiro: ${diasFev.length} dias`);
  console.log(`  - Março: ${diasMar.length} dias`);
  
  const linhas = ['Regional,Município,Escola,Série,Turma,Aluno,Dias do mês,Presença/Falta,Data,Dia Letivo'];
  
  let totalLinhas = 0;
  let totalAlunos = 0;
  
  escolas.forEach((escola, idxEscola) => {
    escola.turmas.forEach(turma => {
      // Gerar entre 20 e 30 alunos por turma
      const numAlunos = Math.floor(Math.random() * 11) + 20; // Entre 20 e 30
      
      for (let idxAluno = 0; idxAluno < numAlunos; idxAluno++) {
        const nomeAluno = gerarNomeAluno(totalAlunos);
        totalAlunos++;
        
        // Gerar frequência para este aluno (média de 80% com maior dispersão)
        const frequencias = gerarFrequenciaAluno(todosDias.length);
        
        // Criar uma linha para cada dia letivo
        todosDias.forEach((data, idxDia) => {
          const diaMes = data.getDate();
          const mes = data.getMonth() + 1;
          const frequencia = frequencias[idxDia];
          const dataFormatada = formatarData(data);
          
          const linha = [
            `"${escola.regional}"`,
            `"${escola.municipio}"`,
            `"${escola.nome}"`,
            `"${turma}"`,
            `"${turma}"`, // Turma é igual à série neste caso
            `"${nomeAluno}"`,
            diaMes,
            frequencia,
            dataFormatada, // Adicionar data completa para facilitar agrupamento
            idxDia + 1 // Adicionar índice sequencial do dia letivo
          ].join(',');
          
          linhas.push(linha);
          totalLinhas++;
        });
      }
    });
    
    if ((idxEscola + 1) % 5 === 0) {
      console.log(`Processadas ${idxEscola + 1}/${escolas.length} escolas...`);
    }
  });
  
  const csvContent = linhas.join('\n');
  const publicPath = join(__dirname, '..', 'public', 'frequencia-estudantes.csv');
  const dataPath = join(__dirname, '..', 'data', 'frequencia-estudantes.csv');
  
  console.log('\nEscrevendo arquivos...');
  fs.writeFileSync(publicPath, csvContent, 'utf8');
  console.log(`✓ Arquivo criado: ${publicPath}`);
  
  fs.writeFileSync(dataPath, csvContent, 'utf8');
  console.log(`✓ Arquivo criado: ${dataPath}`);
  
  console.log(`\n✓ CSV gerado com sucesso!`);
  console.log(`  - Total de escolas: ${escolas.length}`);
  console.log(`  - Total de turmas: ${escolas.reduce((sum, e) => sum + e.turmas.length, 0)}`);
  console.log(`  - Total de alunos: ${totalAlunos}`);
  console.log(`  - Total de registros: ${totalLinhas}`);
  
  // Calcular estatísticas de frequência
  const totalPresencas = linhas.filter(l => l.includes(',P')).length;
  const totalFaltas = linhas.filter(l => l.includes(',F')).length;
  const frequenciaMedia = (totalPresencas / (totalPresencas + totalFaltas)) * 100;
  console.log(`  - Frequência média: ${frequenciaMedia.toFixed(2)}%`);
}

gerarCSV();


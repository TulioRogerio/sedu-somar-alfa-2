#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para gerar CSV de aulas dadas com dados fictícios
para todas as escolas do arquivo escolas.csv
"""

import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

def get_dias_uteis(ano, mes):
    """Retorna lista de dias úteis (segunda a sexta) de um mês"""
    dias = []
    # Último dia do mês
    if mes == 12:
        ultimo_dia = 31
    else:
        ultimo_dia = (datetime(ano, mes + 1, 1) - timedelta(days=1)).day
    
    for dia in range(1, ultimo_dia + 1):
        data = datetime(ano, mes, dia)
        # 0 = segunda, 4 = sexta
        if data.weekday() < 5:  # Segunda a sexta
            dias.append(data)
    
    return dias

def formatar_data(data):
    """Formata data como YYYY-MM-DD"""
    return data.strftime('%Y-%m-%d')

def carregar_escolas(caminho_csv):
    """Carrega escolas do CSV"""
    escolas = []
    
    with open(caminho_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Determinar turmas baseado no tipo de ensino
            turmas = []
            
            # Ensino Fundamental: 1º ao 5º ano
            if row.get('ensino_fundamental', '').lower() == 'true':
                # Adicionar séries do 1º ao 5º ano
                turmas.extend(['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'])
            
            # Se tiver turmas, adicionar escola
            if turmas:
                escolas.append({
                    'id': int(row['id']),
                    'nome': row['nome'],
                    'municipio': row['municipio'],
                    'regional': row['regional'],
                    'turmas': turmas
                })
    
    return escolas

def gerar_csv_aulas_dadas():
    """Gera CSV de aulas dadas"""
    # Caminhos dos arquivos
    script_dir = Path(__file__).resolve().parent
    base_dir = script_dir.parent
    escolas_csv = base_dir / 'public' / 'escolas.csv'
    output_public = base_dir / 'public' / 'aulas-dadas.csv'
    output_data = base_dir / 'data' / 'aulas-dadas.csv'
    
    print(f"Script dir: {script_dir}")
    print(f"Base dir: {base_dir}")
    print(f"Escolas CSV: {escolas_csv}")
    print(f"Existe escolas.csv? {escolas_csv.exists()}")
    
    # Carregar escolas
    print(f"Carregando escolas de {escolas_csv}...")
    escolas = carregar_escolas(escolas_csv)
    print(f"Total de escolas encontradas: {len(escolas)}")
    
    # Obter todos os dias úteis de fev, mar e abr 2025
    dias_fev = get_dias_uteis(2025, 2)
    dias_mar = get_dias_uteis(2025, 3)
    dias_abr = get_dias_uteis(2025, 4)
    todos_dias = dias_fev + dias_mar + dias_abr
    
    print(f"Total de dias úteis: {len(todos_dias)}")
    print(f"  - Fevereiro: {len(dias_fev)} dias")
    print(f"  - Março: {len(dias_mar)} dias")
    print(f"  - Abril: {len(dias_abr)} dias")
    
    # Gerar linhas do CSV
    linhas = [['escola_id', 'escola_nome', 'regional', 'municipio', 'turma', 'data', 'dia_letivo', 'aulas_dadas']]
    
    total_linhas = 0
    
    for escola in escolas:
        for turma in escola['turmas']:
            dia_letivo = 1
            for data in todos_dias:
                # Gerar número aleatório de aulas dadas (entre 4 e 6 aulas por dia)
                aulas_dadas = random.randint(4, 6)
                
                linha = [
                    escola['id'],
                    escola['nome'],
                    escola['regional'],
                    escola['municipio'],
                    turma,
                    formatar_data(data),
                    dia_letivo,
                    aulas_dadas
                ]
                
                linhas.append(linha)
                dia_letivo += 1
                total_linhas += 1
    
    # Escrever arquivos
    print(f"\nGerando CSV...")
    print(f"Total de linhas (sem header): {total_linhas}")
    
    # Escrever em public/aulas-dadas.csv
    with open(output_public, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(linhas)
    print(f"✓ Arquivo criado: {output_public}")
    
    # Escrever em data/aulas-dadas.csv
    with open(output_data, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(linhas)
    print(f"✓ Arquivo criado: {output_data}")
    
    print(f"\n✓ CSV gerado com sucesso!")
    print(f"  - Total de escolas: {len(escolas)}")
    print(f"  - Total de turmas: {sum(len(e['turmas']) for e in escolas)}")
    print(f"  - Total de registros: {total_linhas}")

if __name__ == '__main__':
    gerar_csv_aulas_dadas()


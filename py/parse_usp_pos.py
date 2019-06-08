#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import os.path
import re
from pprint import pprint
import sys
import aiohttp
import urllib
import locale
import json
import codecs
import asyncio
from bs4 import BeautifulSoup
import html5lib
import dateutil
import dateutil.parser
import argparse
import time
import logging
import gzip
from multi_key_dict import multi_key_dict

# Criar um dicionário onde as chaves são as unidades, e o valor de cada chave é o campus correspondente.
# Essa lista é atualizada manualmente dada a baixa frequência de criação de novas unidades.
campus_por_unidade = multi_key_dict();
campus_por_unidade[86,27,39,7,22,3,16,9,2,12,48,8,5,10,67,23,6,66,14,26,93,41,92,42,4,37,43,44,45,83,47,46,87,21,31,85,71,32,38,33] = "São Paulo";
campus_por_unidade[98,94,60,89,81,59,96,91,17,58,95] = "Ribeirão Preto";
campus_por_unidade[88] = "Lorena";
campus_por_unidade[18,97,99,55,76,75,90] = "São Carlos";
campus_por_unidade[11,64] = "Piracicaba";
campus_por_unidade[25,61] = "Bauru";
campus_por_unidade[74] = "Pirassununga";
campus_por_unidade[30] = "São Sebastião";

# Dicionario de unidades. A cada nome de unidade (chave) é atribuído o código correspondente.
codigos_unidades = {};

async def main():
	t = time.perf_counter() # Contador de tempo de execução

	# Sessão HTTP global utilizada por todas as iterações
	global session
	session = aiohttp.ClientSession(headers={'User-Agent': 'MatrUSPbot/2.0 (+http://www.github.com/matrusp/matrusp)'})

	# Necessario para abrir sessão
	await session.get('https://uspdigital.usp.br/janus/componente/disciplinasOferecidasInicial.jsf')

	logger.info(" - Obtendo a lista de todas as unidades de ensino - ")

	response = await session.get('https://uspdigital.usp.br/janus/CPGLista?tipo=T')
	soup = BeautifulSoup(await response.text(), "html5lib")

	# Lista de tags do BeautifulSoup da forma [<a
	# href="publico/lista/disciplina/27">Escola de Comunicações e Artes
	# </a>, ...]
	links_unidades = soup.find_all('a', href=re.compile("publico/lista/disciplina"))

	# Popular o dicionário de unidades a partir dos links encontrados
	global unidades
	unidades = [{'nome': nome, 'codigo':cod} for (nome, cod) in map(lambda x: (next(x.stripped_strings,''), re.search("publico/lista/disciplina/(\d+)", x.get('href')).group(1)), links_unidades)]
	
	logger.info(" - %d unidades de ensino encontradas - " % (len(unidades)))

	# Iniciar a iteração das unidades de acordo com as unidades encontradas ou fornecidas por argumento opcional, de forma assíncrona.
	if not args.unidades:
		materias = await iterar_unidades(unidades)
	else:
		materias = await iterar_unidades(list(filter(lambda x: x['codigo'] in args.unidades, unidades)))

	# Salvar em arquivo json
	materias_json = json.dumps(materias)
	
	arq = open(os.path.join(args.db_dir, args.out) ,"w")
	arq.write(materias_json)
	arq.close()

	if not args.nogzip:
		arq = open(os.path.join(args.db_dir, args.out + ".gz") ,"wb")
		arq.write(gzip.compress(bytes(materias_json,'utf-8')))
		arq.close()

	logger.info(f" -   {len(materias)} materias salvas")

	logger.info(" - FIM! -")
	logger.info(f" - \n - Tempo de execução: {time.perf_counter() - t} segundos")
	return 0

async def iterar_unidades(unidades):
	#Chamar todas as unidades simultaneamente, de forma assíncrona
	logger.info(" - Iniciando processamento de unidades")
	unidade_tasks = (await asyncio.wait([iterar_unidade(u) for u in unidades]))[0]

	logger.info(f" -   {len(unidade_tasks)} unidades processadas")
	logger.info(" - Iniciando processamento de materias")

	# Criar uma corotina para cada matéria encontrada, de todas as unidades
	coros = []
	for materias_unidade in unidade_tasks:
		for materia in materias_unidade.result():
			coros.append(parsear_materia(materia))

	# Chamar todas as matérias simultaneamente, de forma assíncrona
	logger.info(f" -   {len(coros)} materias encontradas")
	materias_tasks = (await asyncio.wait(tuple(coros)))[0]

	#Fechar a sessão e retornar os resultados.
	await session.close()
	logger.info(f" -   {len(materias_tasks)} materias processadas")
	return [i.result() for i in materias_tasks if i.result()]

async def iterar_unidade(unidade):
	logger.debug(f" -    Obtendo as materias da unidade {unidade}")
	response = await session.get('https://uspdigital.usp.br/janus/AreaListaPublico?tipo=T&codcpg=' + unidade['codigo'], timeout = 120)
	assert response.status == 200
	soup = BeautifulSoup(await response.text(), "html5lib")
	
	materias = []

	tabelas_departamentos = soup.find_all('table')
	departamentos = map(extrai_departamento, tabelas_departamentos)

	#links_areas = soup.find_all('a', href=re.compile("publico/lista/turma"))
	#codigos_areas = {key:value for (key, value) in map(lambda x: (x.string, re.search("publico/lista/turma/\d+/(\d+)", x.get('href')).group(1)), links_areas)}
	
	for departamento in departamentos:
		for area in departamento['areas']:
			logger.debug(f' -		Obtendo as materias da area de concentração {area}')
			response = await session.get('https://uspdigital.usp.br/janus/TurmaLista?codare=' + area['codigo'], timeout = 120)
			assert response.status == 200
			soup = BeautifulSoup(await response.text(), "html5lib").find('body')
			materias_area = [*map(extrai_materia, soup.find_all('a', href=re.compile('publico/turma')))]
			for materia in materias_area:
				materia['departamento'] = departamento['nome']
				materia['area_concentracao'] = area['nome']
				materia['unidade'] = unidade['nome']
			materias = materias + materias_area

	logger.debug(f" -   {len(materias)} materias encontradas na unidade {unidade} - ")

	return materias # Retorna uma lista de matérias para serem buscadas

#Tabelas sem tabelas dentro
def eh_tabela_folha(tag):
	return tag.name == "table" and tag.table == None

async def parsear_materia(materia):
	if not materia:
		return

	async with semaforo: # Semaforo controla o número de chamadas simultâneas
		logger.debug(f" -      Obtendo turmas de {materia['codigo']}")
		codigo = materia['codigo']
		codtur = materia['turma']
		try:
			response = await session.get(f'https://uspdigital.usp.br/janus/TurmaDet?sgldis={codigo}&ofe={codtur}', timeout=args.timeout, verify_ssl=False)
			assert response.status == 200
			response = await response.text()
		except asyncio.TimeoutError: # Tentar acessar o janus novamente, caso o pedido falhe.
			try:
				logger.warn(f" -      O pedido de turmas de {materia['codigo']} excedeu o tempo limite do pedido. Tentando novamente...")
				response = await session.get(f'https://uspdigital.usp.br/janus/TurmaDet?sgldis={codigo}&ofe={codtur}', timeout=args.timeout*2, verify_ssl=False)
				assert response.status == 200
				response = await response.text()
			except asyncio.TimeoutError:
				logger.error(f" -      O pedido de turmas de {materia['codigo']} excedeu o tempo limite do pedido")
				return
		except:
			logger.exception(f" -      Não foi possível obter turmas de {materia['codigo']}")
			return
	
		del materia['turma']

		logger.debug(f" -      Analisando turmas de {materia['codigo']}")
		soup = BeautifulSoup(response, "html5lib")
		tabela = soup.find('table')
		try:
			info = parsear_turma(tabela) #Obter informações das turmas
		except:
			logger.exception(f" -     Não foi possível parsear turmas de {materia['codigo']} - {materia['nome']}")
			return

		materia.update(info)

		# Salvar em .json e retornar

		logger.debug(f" -      Salvando {materia['codigo']} - {materia['nome']}")

		materia_json = json.dumps(materia)

		arq = open("%s.json" % os.path.join(args.db_dir, codigo) ,"w")
		arq.write(materia_json)
		arq.close()

		if not args.nogzip:
			arq = open("%s.json.gz" % os.path.join(args.db_dir, codigo) ,"wb")
			arq.write(gzip.compress(bytes(materia_json,'utf-8')))
			arq.close()

		return materia


# Seção: Parsear ---------------
# As funções nessa seção obtém informações das páginas do jupiterWeb

# Obtém as informações da matéria e retorna um dicionario da forma 
# {unidade: "", departamento: "", campus "", objetivos: "", programa_resumido: "", creditos_aula: "", creditos trabalho: ""}
def parsear_info_materia(tabelas_folha):
	info = {'grau': 'Pós-Graduação'}

	re_nome = re.compile("Disciplina:\s+.{7}\s+-.+")
	re_creditos = re.compile("Créditos\s+Aula")

	for folha in tabelas_folha:
		trs = folha.find_all("tr")
		if folha.find(text=re_nome): # Cabeçalho
			strings = list(folha.stripped_strings)
			info['unidade'] = strings[0]
			info['departamento'] = strings[1]
			info['campus'] = campus_por_unidade.get(int(codigos_unidades[info['unidade']]), "Outro") # Obter o campus a partir da unidade
			search = re.search("Disciplina:\s+([A-Z0-9\s]{7})\s-\s(.+)", strings[2])
			assert search != None, f"{strings[2]} não é um nome de disciplina válido ({folha})"
			info['codigo'] = search.group(1)
			info['nome'] = search.group(2)
		elif ''.join(trs[0].stripped_strings) == "Objetivos": #Objetivos
			info['objetivos'] = ''.join(trs[1].stripped_strings)
		elif ''.join(trs[0].stripped_strings) == "Programa Resumido": # Programa Reduzido
			info['programa_resumido'] = ''.join(trs[1].stripped_strings)
		elif folha.find(text=re_creditos):
			info.update(parsear_creditos(folha)) # Adicionar os créditos às informações obtidas
	return info

# Retorna as turmas a partir das tabelas como uma lista [] de dicionarios na forma
# {horario: [], vagas: {}}
def parsear_turma(tabela):
	info = {}
	turma = {}
	professores = ''

	trs = tabela.find('tbody').find_all('tr', recursive = False)
	
	codsearch = re.search("([A-Z0-9]{7}) - (\d+)",''.join(trs[0].stripped_strings))
	
	info['codigo'] = codsearch.group(1)
	turma['codigo'] = codsearch.group(2)
	info['nome'] = ''.join(trs[1].stripped_strings).replace('\u0096','-') #fix para erro de decoding de latin1 pelo aiohttp

	for tr in trs:
		if tr.find(class_="intl_numeroVagas"):
			turma['vagas'] = parsear_vagas(tr.find_next_sibling().find('table'))
		elif tr.find(class_="intl_numeroCreditos"):
			info['creditos_aula'] = int(list(tr.stripped_strings)[1])
		elif tr.find(class_="intl_dataInicial"):
			turma['inicio'] = list(tr.stripped_strings)[1]
			turma['fim'] = list(tr.stripped_strings)[3]
		elif tr.find(class_="intl_docenteMinistrante"):
			professores = [''.join(x.stripped_strings) for x in tr.find_all('tr')][1:]
		elif tr.find(class_="intl_horario"):
			turma['horario'] = parsear_horario(tr.find_next_sibling().find('table'))
	
	if turma['horario']:
		for hor in turma['horario']:
			hor['professores'] = professores

	info['turmas'] = [turma]
	return info

# Obter créditos a partir da tabela de créditos
def parsear_creditos(tabela):
	creditos = {'creditos_aula': 0, 'creditos_trabalho': 0}
	for tr in tabela.find_all("tr"):
		tds = list(map(lambda x: next(x.stripped_strings),tr.find_all("td")))
		if not tds: continue
		if re.search("Créditos\s+Aula:", tds[0], flags=re.U):
			creditos['creditos_aula'] = to_int(tds[1])
		elif re.search("Créditos\s+Trabalho:", tds[0], flags=re.U):
			creditos['creditos_trabalho'] = to_int(tds[1])
	return creditos

#Retorna um dicionario na forma:
#{codigo: "", inicio:"", fim:"", codigo_teorica:"", observacoes:""}
def parsear_info_turma(tabela):
	info = {}
	try:
		for tr in tabela.find_all("tr"):
			tds = list(map(lambda x: next(x.stripped_strings),tr.find_all("td")))
			if re.search("Código\s+da\s+Turma\s+Teórica", tds[0], flags=re.U):
				info['codigo_teorica'] = tds[1]
			elif re.search("Código\s+da\s+Turma", tds[0], flags=re.U):
				info['codigo'] = re.match("^(\w+)", tds[1], flags=re.U).group(1)
			elif re.search("Início", tds[0], flags = re.U):
				info['inicio'] = dateutil.parser.parse(tds[1], dayfirst=True).strftime("%d/%m/%Y")
			elif re.search("Fim", tds[0], flags=re.U):
				info['fim'] = dateutil.parser.parse(tds[1], dayfirst=True).strftime("%d/%m/%Y")
			elif re.search("Tipo\s+da\s+Turma", tds[0], flags=re.U):
				info['tipo'] = tds[1]
			elif re.search("Observações", tds[0], flags=re.U):
				info['observacoes'] = tds[1]
			else:
				print("Informacao ignorada: %s" % (tds[0]))
	except IndexError:
		pass

	return info

# Obtém as vagas, relacionando os tipos de vaga à quantidade, na forma
# {'Obrigatória': {vagas: 0, inscritos: 0, pendentes: 0, matriculados: 0, grupos: {}}, 'Optativa', ...}
# onde cada grupo é da forma {vagas: 0, ..., matriculados: 0}
def parsear_vagas(tabela):
	tr = tabela.find_all('tr')[1]
	tds = tr.find_all('td')

	vreg = int(tds[0].string if (tds[0].string != '-') else tds[2].string)
	vesp = int(tds[1].string if (tds[1].string != '-') else 0)

	vagas = { 'Pós-Graduação': {
			'vagas': vreg + vesp,
			'grupos':{
				'Alunos Regulares': {'vagas': vreg},
				'Alunos Especiais': {'vagas': vesp}
				}
			}
		}

	return vagas

def to_int(string):
	try:
		return int(string)
	except:
		return 0

#Retorna uma lista de dias de aula da forma:
#[{dia: '', inicio: '', fim: '', local: ''}]
def parsear_horario(tabela):
	horarios = []

	dias = {
		'Segunda': 'seg',
		'Terça': 'ter',
		'Quarta': 'qua',
		'Quinta': 'qui',
		'Sexta': 'sex',
		'Sábado': 'sab',
		'Domingo': 'dom'
	}

	accum = None
	for tr in tabela.find_all("tr"):
		tds = tr.find_all("td")
		tds = ["".join(x.stripped_strings).strip() for x in tds]
		
		horasearch = re.search('(\d\d:\d\d) - (\d\d:\d\d)', tds[1])

		horario = {
			'dia': dias[tds[0]],
			'inicio': horasearch.group(1),
			'fim': horasearch.group(2),
			'local': tds[2]
			}

		horarios.append(horario)

	return horarios

#Retorna um par (codigo, turma), exemplo: (u'PRO5961', u'2')
def extrai_materia(x):
	search = re.search("publico/turma/([A-Z0-9\s]{7})/(\d+)", x.get('href'))
	return {'codigo': search.group(1), 'turma': search.group(2)} if search else None

# ----------------------

def extrai_departamento(tabela):
	info = {}
	cabeçalho = list(tabela.find('thead').stripped_strings)
	info['codigo'] = cabeçalho[0]
	info['nome'] = cabeçalho[1]
	info['areas'] = []

	trs = tabela.find('tbody').find_all('tr', recursive = False)
	areare = re.compile('(\d+)\s+-\s+(.+)')
	for tr in trs:
		search = areare.search(next(tr.stripped_strings,''))
		areainfo = {'codigo': search.group(1), 'nome': search.group(2)}
		info['areas'].append(areainfo)

	return info
		
#Execução do programa
if __name__ == "__main__":

	#Definição dos parâmetros de entrada
	parser = argparse.ArgumentParser(description="Crawler MatrUSP Pós-graduação")
	parser.add_argument('diretorio_destino', help="diretório que irá conter os arquivos resultantes")
	parser.add_argument('-v','--verbosidade',action = 'count', default = 0)
	parser.add_argument('-u','--unidades', help=  "iterar apenas estes códigos de unidade", nargs = '+')
	parser.add_argument('-s','--simultaneidade',help = "número de pedidos HTTP simultâneos", type=int, default=100)
	parser.add_argument('-t','--timeout',help = "tempo máximo (segundos) do pedido HTTP", type=int, default=120)
	parser.add_argument('-o','--out',help="arquivo de saída do banco de dados completo", type=str, default="dbpos.json")
	parser.add_argument('--nogzip',help = "não compactar os arquivos de saída", action='store_true')
	args = parser.parse_args()

	if not args.diretorio_destino:
		parser.print_help()
		exit(1)
	
	args.db_dir = os.path.abspath(args.diretorio_destino)
	if not os.path.isdir(args.db_dir):
		parser.print_help()
		exit(1)

	logger = logging.getLogger('log')
	logger.setLevel(logging.DEBUG)

	# Enviar log para o console
	ch = logging.StreamHandler()
	ch.setLevel(60-10*(args.verbosidade or 4))
	ch.setFormatter(logging.Formatter('%(message)s'))
	logger.addHandler(ch)

	# Enviar log para arquivo
	fh = logging.FileHandler(time.strftime('%Y-%m-%d_%H-%M-%S_'+os.path.basename(__file__)+'.log'), encoding='utf-8')
	fh.setLevel(logging.DEBUG)
	fh.setFormatter(logging.Formatter('[%(asctime)s] %(module)s %(levelname)s: %(message)s'))
	logger.addHandler(fh)

	sys.excepthook = lambda e, v, tb : logger.exception("Uncaught exception", exc_info = (e, v, tb))

	loop = asyncio.get_event_loop()
	semaforo = asyncio.Semaphore(args.simultaneidade, loop = loop)

	exit(loop.run_until_complete(main()))
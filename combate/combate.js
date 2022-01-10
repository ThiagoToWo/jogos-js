/*
*função recursiva que administra turnos de ataque e defesa entre dois lutadores.
*Os lutadores são objetos como o modelo abaixo
*
*	lutador = {
*		nome: '...',
*		turno: 0 (atacante) ou 1 (defensor),
*		estilo: 0.3 a 0.75, // para a frequência com que usa magia
*		vida: 100 a 180, // ganhando vida * 0.2 a cada vitória
*		ataque: 20 a 40, // ganhando ataque * (1 - estilo) a cada vitória
*		defesa: 10 a 40, // ganhando defesa * 0.2 por vitória
*		magia: 30 a 50, // ganhando magia * estilo a cada vitória
*		foco: 0.3 a 1, // para a frequênciacom que acerta os ataques
*		reflexo:  0.3 a 1, // para a frequênciacom que consegue se defender
*		habilidade: 0.3 a 1, // para a frequênciacom que acerta as magias
*	}
*
*Os lutadores precisam ter seus turnos configurados com 0 (atacante) ou 1 (defensor)
*antes de serem passados para a função.
*
*	//looping do jogo
*	l1.turno = 0 // atacante
*	l2.turno = 1 // defensor
*	lutar(l1, l2)
*
*Com o valor inicial dos turnos, a função executa o primeiro ataque e alterna os
*atacantes e defensores até ocorrer um vencedor.
*Com uma vitória decidida, a função usa a auxiliar _atualizar() para atuaizar os
*ganhos do vencedor e retorna ele para ser aplicado em um próximo combate.
*
*A função também pode usar como entrada uma string (relator) representando como
*os eventos da luta serão relatados.
*	'console', undefined ou vazio: imprime os eventos no console.log().
*	'alert': imprime os eventos por alert().
*	'both': imprime os eventos por console.log() e alert().
*Essas entradas definirão uma variável interna que será usada pela função auxiliar
*_relatar(), a qual usará os tais valores para decidir como imprimir os eventos.
*/
function lutar(lutador1, lutador2, relator) {
	// string identificadora do tipo de relator e eventos do combate
	var log = relator;

	// calcula a fração de ataque, magia e defesa a serem usadas e se vai usar magia
	var teste_foco = Math.random();
	var teste_reflexo = Math.random();
	var teste_habilidade = Math.random();
	var teste_magia = Math.random();

	// decide quem vai ser o atacante e o defensor pelo valor inicial do turno
	var atacante = null;
	var defensor = null;

	if (lutador1.turno == 0) {
		atacante = lutador1;
		defensor = lutador2;
	} else {
		atacante = lutador2;
		defensor = lutador1;
	}

	// calcula o ataque, verifica se usa magia e quanto e calcula a defesa
	var ataque = 0;
	var magia = 0;
	var defesa = 0;

	// passou no teste de foco, ataca
	if (teste_foco <= atacante.foco) {
		ataque = atacante.ataque * teste_foco;
		_relatar(atacante.nome, 'efetuou golpe', ataque.toFixed(), '/', atacante.ataque.toFixed());
	} else {
		_relatar(atacante.nome, 'errou o golpe');
	}

	// passou no teste de magia e no teste de habilidade, usa a magia
	if (teste_magia <= atacante.estilo && teste_habilidade <= atacante.habilidade) {
		magia = atacante.magia * teste_habilidade;
		_relatar(atacante.nome, 'usou magia', magia.toFixed(), '/', atacante.magia.toFixed());
	} else {
		_relatar(atacante.nome, 'não usou ou errou a magia');
	}

	// teve ataque com golpe ou magia e passou no teste de defesa
	if ((ataque || magia) && teste_reflexo <= defensor.reflexo) {
		defesa = defensor.defesa * teste_reflexo;
		_relatar(defensor.nome, 'conseguiu defender', defesa.toFixed(), '/', defensor.defesa.toFixed());
	} else {
		_relatar(defensor.nome, 'não defendeu');
	}

	// calcula o dano que o ataque causou e retira da vida do defensor
	if (ataque + magia > defesa) {
		var resultado = (ataque + magia) - defesa;
		defensor.vida -= resultado;
		_relatar(defensor.nome, 'recebeu', resultado.toFixed(),
					'de dano e ficou com', defensor.vida.toFixed(), 'de vida.');
	} else {
		_relatar(defensor.nome, 'não teve danos');
	}

	if (defensor.vida <= 0) { // caso o defensor perca toda sua vida
		_relatar(atacante.nome, 'venceu');
		_atualizar(atacante);
		return atacante; // retorna o vencedor
	} else { // senão, alterna os turnos e repete o ataque
		lutador1.turno = (lutador1.turno + 1) % 2;
		lutador2.turno = (lutador2.turno + 1) % 2;
		return lutar(lutador1, lutador2, log);
	}	

	// função auxiliar para atualizar os lutadores vencedores
	function _atualizar(lutador) {
		lutador.vida *= 1.2;
		lutador.ataque *= (2 - lutador.estilo);
		lutador.defesa *= 1.2;
		lutador.magia *= (1 + lutador.estilo);
	}

	/*
	*função auxiliar para relatar os eventos da luta.
	*A função usa a variável log interna, podendo ser de 3 tipos:
	*	'console', undefined ou vazio: imprime os eventos no console.log().
	*	'alert': imprime os eventos por alert().
	*	'both': imprime os eventos por console.log() e alert().
	*/
	function _relatar(...entradas) {
		if (log === 'console' || log === undefined || log === '') {
			console.log(...entradas);
		} else if (log === 'alert') {
			var texto = '';

			for (var i = 0; i < entradas.length; i++) {
				texto += entradas[i] + ' ';
			}

			alert(texto);
		} else if (log === 'both') {
			var texto = '';

			for (var i = 0; i < entradas.length; i++) {
				texto += entradas[i] + ' ';
			}

			alert(texto);
			console.log(...entradas);
		} else {
			new Error("Valor inválido de relator de eventos. Escolha 'console', 'alert' ou 'both'.");
		}
	}
}

/*
*Função que cria um objeto lutador dado como entrada um nome.
*/
function criarLutador(nome) {
	var lutador = {
		nome: nome,
		turno: undefined,
		estilo: _random(0.3, 0.75),
		vida: _random(100, 180),
		ataque: _random(20, 40),
		defesa: _random(10, 40),
		magia: _random(30, 50),
		foco: _random(0.3, 1),
		reflexo: _random(0.3, 1),
		habilidade: _random(0.3, 1)
	};

	return lutador;
}

/*
*Função que cria um array de objetos lutadores dado como entrada um array de
*nomes.
*/
function criarLutadores(...nomes) {
	var lutadores = [];
	var lutador;

	for (var i = 0; i < nomes.length; i++) {
		lutador = {
			nome: nomes[i],
			turno: undefined,
			estilo: _random(0.3, 0.75),
			vida: _random(100, 180),
			ataque: _random(20, 40),
			defesa: _random(10, 40),
			magia: _random(30, 50),
			foco: _random(0.3, 1),
			reflexo: _random(0.3, 1),
			habilidade: _random(0.3, 1)
		}

		lutadores.push(lutador);
	}

	return lutadores;
}

/*
*Função usada para criar um div posicionado no corpo do documento e
*representar nele as informações do objeto lutador passado como parâmetro.
*As entradas left e top, são usadas para a posição CSS div.style.left e
*div.style.top.
*/
function representarLutador(lutador, left, top) {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.left = String(left) + 'px';
	div.style.top = String(top) + 'px';
	div.style.width = '200px';
	div.style.border = 'solid';
	div.style.padding = '10px';
	div.style.background = '#efefef';

	for (var propriedade in lutador) {
		if (propriedade === 'nome' || propriedade === 'turno') {
			div.innerHTML += '<b>- ' + propriedade + '</b>: '
							 + lutador[propriedade] + '<br/>';
		} else if (propriedade === 'vida' || propriedade === 'ataque' ||
				   propriedade === 'defesa' || propriedade === 'magia'){
			div.innerHTML += '<b>- ' + propriedade + '</b>: '
							 + Number(lutador[propriedade]).toFixed() + '<br/>';
		} else {
			div.innerHTML += '<b>- ' + propriedade + '</b>: '
							 + Number(lutador[propriedade]).toFixed(2) + '<br/>';
		}
	}

	document.body.appendChild(div);
}

/*
*Função usada para criar um div posicionado no corpo do documento e
*representar nele as informações dos objetos lutadores passados como parâmetros.
*As entradas left e top, são usadas para a posição CSS div.style.left e
*div.style.top do primeiro lutador. A posição do segundo é calculada ao lado.
*/
function representarLutadores(lutador1, lutador2, left, top) {
	representarLutador(lutador1, left, top);
	representarLutador(lutador2, left + 250, top);
}

/*
*função auxiliar para obter um número aléatório em um intervalo dado,
*incluindo os extremos
*/
function _random(inicio, fim) {
	var rnd;

	if (inicio >= 1 && fim >= 1) {
		rnd = Math.floor(inicio + Math.random() * (fim - inicio + 1));
	} else {
		rnd = (inicio + Math.random() * (fim - inicio));
	}

	return rnd;
}

function _copiarObjeto(o) {
	var copia = {};
	
	for (var p in o) {
		copia.p = o[p];
	}
	
	return copia;
}
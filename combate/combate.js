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
*	}
*
*Os lutadores precisam ter seus turnos configurados com 0 (atacante) ou 1 (defensor)
*antes de serem passados para a função. 
*	
*	//looping do jogo
*	l1.turno = 0 // atacante
*	l2.turno = 1 // defensor
*	atacar(l1, l2)
*
*Com o valor inicial dos turnos, a funçãovexecuta o primeiro ataque e alterna os 
*atacantes e defensores até ocorrer um vencedor.
*Com uma vitória decidida, a função usa a auxiliar _atualizar() para atuaizar os
*ganhos do vencedor. 
*/

function atacar(lutador1, lutador2) {
	
	// calcula a fração de ataque, magia e defesa a serem usadas e se vai usar magia
	var foco = Math.random();
	var habilidade = Math.random();
	var reflexo = Math.random();
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
	var ataque = atacante.ataque * foco;
	var magia = atacante.estilo <= teste_magia ? atacante.magia * habilidade : 0;
	var defesa = defensor.defesa * reflexo;
	
	// calcula o dano que o ataque causou e retira da vida do defensor
	if (ataque > defesa) {
		var resultado = ataque - defesa;
		defensor.vida -= resultado;
	}

	if (defensor.vida <= 0) { // caso o defensor perca toda sua vida
		console.log(atacante.nome + ' venceu');
		_atualizar(atacante);
		return;
	} else { // senão, alterna os turnos e repete o ataque
		lutador1.turno = (lutador1.turno + 1) % 2;
		lutador2.turno = (lutador2.turno + 1) % 2;
		atacar(lutador1, lutador2);
	} 
	
	// função auxiliar para atualizar os lutadores vencedores
	function _atualizar(lutador) {
		lutador.vida *= 1.2;
		lutador.ataque *= (2 - lutador.estilo);
		lutador.defesa *= 1.2;
		lutador.magia *= (1 + lutador.estilo);
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
		magia: _random(30, 50)
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
			magia: _random(30, 50)
		}
		
		lutadores.push(lutador);
	}

	return lutadores;
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
		rnd = inicio + Math.random() * (fim - inicio);
	}
	
	return rnd;
}
// Engine
let canvas;
let context;

// Símbolos do cenário
const EXPLORADOR = "@";
const MOEDA = "m";
const LAVA = "l";
const LAVA_MOVEL_VERTICAL1 = "v"; // Amplitude de movimento 5 * W
const LAVA_MOVEL_HORIZONTAL1 = "h"; // Amplitude de movimento 5 * W
const LAVA_MOVEL_VERTICAL2 = "V"; // Amplitude de movimento 10 * W
const LAVA_MOVEL_HORIZONTAL2 = "H"; // Amplitude de movimento 10 * W
const BLOCO = "b";

const W = 5; // lado de qualquer elemento quadrado do cenário

const G = 0.4; // Gravidade
const VT = 4; // Velocidade Terminal

// Estruturas de dados fundamentais
let explorador;
let moedas;
let lavas;
let blocos;
const pressionados = [];
let cenarioAtual // guarda o índice do cenário atual

// Estados do jogo
const CARREGANDO = 0;
const JOGANDO = 1;
const MORREU = 2;
const PASSOU_DE_FASE = 3;
const TERMINOU = 4;

let estadoAtual = CARREGANDO;

// Configura os controles
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft": pressionados[0] = true; break;
        case "ArrowRight": pressionados[1] = true; break;
        case " ": pressionados[2] = true; break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowLeft": pressionados[0] = false; break;
        case "ArrowRight": pressionados[1] = false; break;
        case " ": pressionados[2] = false; break;
    }
});

// Função principal de controle de estados do jogo
function jogar() {
    requestAnimationFrame(jogar, canvas);

    switch (estadoAtual) {
        case CARREGANDO:
            pausarPor(1000);
            carregarJogo(cenarios[cenarioAtual]);
            estadoAtual = JOGANDO;
            break;
        case JOGANDO:
            processarJogo();
            break;
        case MORREU:
            processarMorte();
            estadoAtual = CARREGANDO;
            break;
        case TERMINOU:
            pausarPor(1000);
            finalizarJogo();
            return;
    }

    renderizar();
}

// Funçoes de processamentos
function carregarJogo(cenario) {
    explorador = null;
    moedas = [];
    lavas = [];
    blocos = [];

    for (let linha = 0; linha < cenario.length; linha++) {
        for (let letra = 0; letra < cenario[linha].length; letra++) {
            const simbolo = cenario[linha][letra];
            const x = letra * W;
            const y = linha * W;

            switch (simbolo) {
                case EXPLORADOR:
                    explorador = new Explorador(x, y - W, context);
                    break;
                case MOEDA:
                    const moeda = new Moeda(x, y - W, context);
                    moedas.push(moeda);
                    break;
                case LAVA:
                    const lava = new Lava(x, y, 0, 0, 0, 0, context);
                    lavas.push(lava);
                    break;
                case LAVA_MOVEL_VERTICAL1:
                    const lavaMovelVertical1 = new Lava(x, y, 0, 0.05, 0, 5 * W, context);
                    lavas.push(lavaMovelVertical1);
                    break;
                case LAVA_MOVEL_HORIZONTAL1:
                    const lavaMovelHorizontal1 = new Lava(x, y, 0.05, 0, 5 * W, 0, context);
                    lavas.push(lavaMovelHorizontal1);
                    break;
                case LAVA_MOVEL_VERTICAL2:
                    const lavaMovelVertical2 = new Lava(x, y, 0, 0.05, 0, 10 * W, context);
                    lavas.push(lavaMovelVertical2);
                    break;
                case LAVA_MOVEL_HORIZONTAL2:
                    const lavaMovelHorizontal2 = new Lava(x, y, 0.05, 0, 10 * W, 0, context);
                    lavas.push(lavaMovelHorizontal2);
                    break;
                case BLOCO:
                    const bloco = new Bloco(x, y, context);
                    blocos.push(bloco);
                    break;
            }
        }
    }
}

function processarJogo() {
    // Atuaçização dos elementos
    explorador.atualizar();

    for (const moeda of moedas) {
        moeda.atualizar();
    }

    for (const lava of lavas) {
        lava.atualizar();
    }

    // Tratamentos de colisão com objetos do jogo
    for (const moeda of moedas) {
        if (explorador.colidiuCom(moeda)) {
            moedas.splice(moedas.indexOf(moeda), 1);
        }
    }

    for (const lava of lavas) {
        if (explorador.colidiuCom(lava)) {
            estadoAtual = MORREU;
        }
    }

    for (const bloco of blocos) {
        const ladoDoExplorador = explorador.colidiuComBloco(bloco);

        if (ladoDoExplorador == "baixo" && explorador.vy >= 0) {
            explorador.noSolo = true;
            explorador.vy = 0;
        } else if (ladoDoExplorador == "cima" && explorador.vy <= 0) {
            explorador.vy = 0;
        } else if (ladoDoExplorador == "direita" && explorador.vy >= 0) {
            explorador.vx = 0; // Exigirá reiniciação
        } else if (ladoDoExplorador == "esquerda" && explorador.vy <= 0) {
            explorador.vx = 0; // Exigirá reiniciação
        }

        if (ladoDoExplorador != "baixo" && explorador.vy > 0) {
            explorador.noSolo = false;
        }
    }

    // Tratamento de colisão com os limites físicos do jogo    
    if (explorador.x < 0) {
        explorador.x = 0;
    }

    if (explorador.x + explorador.w > canvas.width) {
        explorador.x = canvas.width - explorador.w;
    }

    if (explorador.y < 0) {
        explorador.y = 0;
    }

    if (explorador.y + explorador.h > canvas.height) {
        estadoAtual = MORREU
    }

    // Verifica mudança de fase ou fim de jogo
    if (moedas.length == 0) {
        cenarioAtual++; 

        if (cenarios[cenarioAtual]) {
            estadoAtual = CARREGANDO;
        } else {
            estadoAtual = TERMINOU;
        }
    }
}

function processarMorte() {
    explorador.atualizar = false;
    explorador.cor = "#f00";
    explorador.desenhar();
}

function finalizarJogo() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "50px sans-serif";
    context.fillStyle = "#fff";
    context.fillText("FIM!", canvas.width / 2 - 50, canvas.height / 2);
}

function renderizar() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    explorador.desenhar();

    for (const moeda of moedas) {
        moeda.desenhar();
    }

    for (const lava of lavas) {
        lava.desenhar();
    }

    for (const bloco of blocos) {
        bloco.desenhar();
    }
}

// Pausa por um intervalo de milessegundos
function pausarPor(ms) {
    const t0 = new Date().getTime();
    let t = new Date().getTime();

    while (t - t0 < ms) {
        t = new Date().getTime();
    }
}
// Engine
let explorador;
const moedas = [];
const lavas = [];
const blocos = [];
const pressionados = [];

const G = 0.4; // Gravidade

// Estados do jogo
const JOGANDO = 1;
const MORREU = 2;

let estadoAtual = JOGANDO;

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

function iniciarJogo() {
    requestAnimationFrame(iniciarJogo, canvas);

    switch (estadoAtual) {
        case JOGANDO:
            processarJogo();
            break;
        case MORREU:
            processarMorte();
            return;
    }

    renderizar();
}

function processarJogo() {
    explorador.atualizar();

    for (const moeda of moedas) {
        moeda.atualizar();
    }

    for (const lava of lavas) {
        lava.atualizar();
    }

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

    if (explorador.x < 0) {
        explorador.x = 0;
    }

    if (explorador.x + explorador.w > canvas.width) {
        explorador.x = canvas.width - explorador.w;
    }

    if (explorador.y + explorador.h > canvas.height) {
        explorador.y = canvas.height - explorador.h;
        explorador.vy = 0;
        explorador.noSolo = true;
    }
}

function processarMorte() {
    explorador.ativoAtualizar = false;
    explorador.cor = "#f00";
    explorador.desenhar();
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
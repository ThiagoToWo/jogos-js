const form = document.querySelector("form");
const spTempo = document.querySelector("#spTempo");
const spClima = document.querySelector("#spClima");
const spMeridiano = document.querySelector("#spMeridiano");
const spEnergia = document.querySelector("#spEnergia");
const spComida = document.querySelector("#spComida");
const spAgua = document.querySelector("#spAgua");
const spFome = document.querySelector("#spFome");
const spSede = document.querySelector("#spSede");
const pMensagem = document.querySelector("#pMensagem");

const MAP_SIZE = 100; // dimensão do mapa
const map = []; // mapa matrix MAP_SIZE x MAP_SIZE
let localX = 49; // localização x do personagem
let localY = 49; // localização y do personagem
let tempo = 0; // tempo decorrido do jogo em dias (5 min)
let clima = "ameno"; // clima do dia
let dia = true; // se é dia ou noite
let energia = 10; // quantidade de energia do personagem
let comida = 3; // quantidade de comida do personagem
let agua = 5; // quantidade de água do personagem
let fome = 7; // dias para resistir a fome sem perder energia
let sede = 3; // dias para resistir a sede sem perder energia
const FatorClima = { // fator de gasto de energia para pesca e locomoção em cada clima
    "muito quente": 0.3,
    "quante": 0.2,
    "ameno": 0.1,
    "chuvoso": 0.2,
    "tempestade": 0.3
}
const DIA = 5 // tempo de um dia em minutos
const MINUTOS = 1000 * 60; // milissegundos para minutos

// Preencher mapa
for (let i = 0; i < MAP_SIZE; i++) {
    const linha = []
    for (let j = 0; j < MAP_SIZE; j++) {
        // Escolher a quantidade de peixes
        if (Math.random() < .3333) {
            const numPeixes = 1 + Math.floor(Math.random() * 5);
            linha[j] = numPeixes;
        } else {
            linha[j] = 0;
        }
    }

    map[i] = linha;
}

// Colocar duas ilhas
for (let cont = 0; cont < 2; cont++) {
    const ilhaX = Math.floor(Math.random() * MAP_SIZE);
    const ilhaY = Math.floor(Math.random() * MAP_SIZE);

    map[ilhaX][ilhaY] = "ilha";
}

// Criar timer
contarMeridiano();

console.table(map);
for (let i = 0; i < MAP_SIZE; i++) {
    const l = map[i].indexOf("ilha");
    if (l != -1) console.log("ilha em (" + i + ", " + l + ")");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const comando = form.inComando.value;

    switch (comando) {
        case "norte":
            locomoverPara("norte");
            break;
        case "sul":
            locomoverPara("sul");
            break;
        case "leste":
            locomoverPara("leste");
            break;
        case "oeste":
            locomoverPara("oeste");
            break;
        case "pescar":
            pescar();
            break;
        case "coletar": // coletar água da chuva
            coletarAgua();
            break;
        case "colher": // pegar cocos em ilhas
            colherCocos();
            break;
        case "comer":
            comer();
            break;
        case "beber":
            beberAgua();
            break;
        case "mapa":
            mostarLocal();
            break;
        case "ajuda":
            mostarComandos();
            break;
        default:
            mostarComandos();
    }

    form.inComando.value = "";
    form.inComando.focus();
});

////////////////////////////////////////////////////////////////////////////
//                                Funções                                 //
////////////////////////////////////////////////////////////////////////////

// Conta os dias e processa o que acontece no passar deles
function contarMeridiano() {
    spTempo.innerHTML = tempo;
    spFome.innerHTML = fome;
    spSede.innerHTML = sede;
    spClima.innerHTML = clima;
    dvTudo.style.backgroundColor = "rgb(255, 255, 255)";

    if (dia) { // Quando é dia
        spMeridiano.innerHTML = "&#9788";
        locomoverPara("deriva");

        if (fome < 0) { // Reduz 1 ponto de energia no fim da resistência à fome
            energia--;
            spEnergia.innerHTML = energia.toFixed(1);
        }

        if (sede < 0) { // Reduz 2 ponto de energia no fim da resistência à sede
            energia -= 2;
            spEnergia.innerHTML = energia.toFixed(1);
        }

        // Muda o clima da noite de acordo como estava no dia
        let n;

        if (clima == "tempestade" || clima == "chuvoso") { // 50% de ameno ou tempestade
            n = Math.random();
            if (n >= .5) {
                clima = "tempestade";
            } else {
                clima = "ameno";
            }
        } else if (clima == "ameno") { // continua ameno
            clima = "ameno";
        } else if (clima == "quente") { // 30% de chuva e 70% de ficar ameno
            n = Math.random();
            if (n >= .7) {
                clima = "chuvoso";
            } else {
                clima = "ameno";
            }
        } else { // 50% de chuva ou ameno
            n = Math.random();
            if (n >= .5) {
                clima = "chuvoso";
            } else {
                clima = "ameno";
            }
        }

        dia = false;
    } else { // Quando é noite
        spMeridiano.innerHTML = "&#9790;"
        tempo++; // Atualiza contagem de dia a noite
        fome--; // Reduz os dias que pode ficar sem comer
        sede--; // Reduz os dias que pode ficar sem beber   
        dvTudo.style.backgroundColor = "rgb(0, 0, 0, 0.5)";

        // Sorteia o clima do dia
        const n = Math.random();

        if (n >= .9) { // 10% de chance de tempestade
            clima = "tempestade";
        } else if (n >= .7) { // 20% de chance de dia chuvoso
            clima = "chuvoso";
        } else if (n >= .3) { // 40% de chance de clima ameno
            clima = "ameno";
        } else if (n >= .1) { // 20% de chance de dia quente
            clima = "quente";
        } else { // 10% de chance de dia muito quante
            clima = "muito quente";
        }

        dia = true;
    }

    if (energia <= 0) {
        pMensagem.innerHTML = "Você morreu no " + tempo + "º dia.";
        return;
    }
    setTimeout(contarMeridiano, (DIA / 2) * MINUTOS);
}

// Locomove para uma determinada direção ou uma direção aleatória (deriva)
function locomoverPara(direcao) {
    switch (direcao) {
        case "deriva":
            const n = 1 + Math.floor(Math.random() * 4);

            switch (n) {
                case 1: // norte
                    localY--;
                    break;
                case 2: // sul
                    localY++;
                    break;
                case 3: // leste
                    localX++;
                    break;
                case 4: // oeste
                    localX--;
            }

            break;
        case "norte":
            localY--;
            energia -= 1 * FatorClima[clima];
            break;
        case "sul":
            localY++;
            energia -= 1 * FatorClima[clima];
            break;
        case "leste":
            localX++;
            energia -= 1 * FatorClima[clima];
            break;
        case "oeste":
            localX--;
            energia -= 1 * FatorClima[clima];
            break;
    }

    if (map[localX][localY] == "ilha") {
        pMensagem.innerHTML = "Você encontrou uma ilha!";
    }

    spEnergia.innerHTML = energia.toFixed(1);
}

function pescar() {
    if (map[localX][localY] != "ilha") { // Pesca no mar
        energia -= map[localX][localY] * FatorClima[clima];
        comida += map[localX][localY];
        map[localX][localY] = 0;

        spEnergia.innerHTML = energia.toFixed(1);
        spComida.innerHTML = comida;
    }
}

function coletarAgua() {
    if ((clima == "chuvoso" || clima == "tempestade") && agua < 5) {
        agua += (5 - agua);
        spAgua.innerHTML = agua;
    }
}

// Coletar cocos em ilhas
function colherCocos() {
    if (map[localX][localY] == "ilha" && comida < 10) {
        energia -= 3 * FatorClima[clima];
        comida += (10 - comida);
        spEnergia.innerHTML = energia.toFixed(1);
        spComida.innerHTML = comida;
    }
}

function comer() {
    if (comida > 0) {
        energia++;
        comida--;
        fome++;
        sede--;
        spEnergia.innerHTML = energia.toFixed(1);
        spComida.innerHTML = comida;
        spFome.innerHTML = fome;
        spSede.innerHTML = sede;
    }
}

function beberAgua() {
    if (agua > 0) {
        agua--;
        sede++;    
        spAgua.innerHTML = agua;
        spSede.innerHTML = sede;
    }
    
}

function mostarLocal() {
    pMensagem.innerHTML = `Você está na posição (${localX}, ${localY}).`;
}

function mostarComandos() {
    pMensagem.innerHTML = `Use os comandos <i>norte</i>, <i>sul</i>, <i>leste</i>,
     <i>oeste</i>, <i>comer</i>, <i>beber</i>, <i>pescar</i>, <i>coletar</i>,
     <i>colher</i>, <i>mapa</i> ou <i>ajuda</i>.`;
}
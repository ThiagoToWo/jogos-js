const spTempo = document.querySelector("#spTempo");
const spClima = document.querySelector("#spClima");
const spMeridiano = document.querySelector("#spMeridiano");
const spEnergia = document.querySelector("#spEnergia");
const spComida = document.querySelector("#spComida");
const spAgua = document.querySelector("#spAgua");
const spFome = document.querySelector("#spFome");
const spSede = document.querySelector("#spSede");
const spMensagem = document.querySelector("#spMensagem");
const btNorte = document.querySelector("#btNorte");
const btSul = document.querySelector("#btSul");
const btLeste = document.querySelector("#btLeste");
const btOeste = document.querySelector("#btOeste");
const btComer = document.querySelector("#btComer");
const btBeber = document.querySelector("#btBeber");
const btPescar = document.querySelector("#btPescar");
const btColetar = document.querySelector("#btColetar");
const btColher = document.querySelector("#btColher");
const btMapa = document.querySelector("#btMapa");

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
    "quente": 0.2,
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

btNorte.addEventListener("click", locomoverParaNorte);
btSul.addEventListener("click", locomoverParaSul);
btLeste.addEventListener("click", locomoverParaLeste);
btOeste.addEventListener("click", locomoverParaOeste);
btBeber.addEventListener("click", beberAgua);
btComer.addEventListener("click", comer);
btPescar.addEventListener("click", pescar);
btColetar.addEventListener("click", coletarAgua);
btColher.addEventListener("click", colherCocos);
btMapa.addEventListener("click", mostarLocal);

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
        locomoverADeriva();

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
        } else { // 10% de chance de dia muito quente
            clima = "muito quente";
        }

        dia = true;
    }

    if (energia <= 0) {
        spMensagem.innerHTML = "Você morreu no " + tempo + "º dia.";
        return;
    }

    setTimeout(contarMeridiano, (DIA / 2) * MINUTOS);
}

// Locomove para uma determinada direção ou uma direção aleatória (deriva)
function locomoverParaNorte() {
    localY--;
    energia -= 1 * FatorClima[clima];
    spEnergia.innerHTML = energia.toFixed(1);
    spMensagem.innerHTML = "Energia -" + FatorClima[clima];

    if (map[localX][localY] == "ilha") {
        spMensagem.innerHTML = "Você encontrou uma ilha!";
    }
}

function locomoverParaSul() {
    localY++;
    energia -= 1 * FatorClima[clima];
    spEnergia.innerHTML = energia.toFixed(1);
    spMensagem.innerHTML = "Energia -" + FatorClima[clima];

    if (map[localX][localY] == "ilha") {
        spMensagem.innerHTML = "Você encontrou uma ilha!";
    }
}

function locomoverParaLeste() {
    localX++;
    energia -= 1 * FatorClima[clima];
    spEnergia.innerHTML = energia.toFixed(1);
    spMensagem.innerHTML = "Energia -" + FatorClima[clima];

    if (map[localX][localY] == "ilha") {
        spMensagem.innerHTML = "Você encontrou uma ilha!";
    }
}

function locomoverParaOeste() {
    localX--;
    energia -= 1 * FatorClima[clima];
    spEnergia.innerHTML = energia.toFixed(1);
    spMensagem.innerHTML = "Energia -" + FatorClima[clima];

    if (map[localX][localY] == "ilha") {
        spMensagem.innerHTML = "Você encontrou uma ilha!";
    }
}

function locomoverADeriva() {
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
}

function pescar() {
    if (map[localX][localY] != "ilha") { // Pesca no mar
        const numPeixes = map[localX][localY];
        const gasto = numPeixes * FatorClima[clima];
        energia -= gasto;
        comida += numPeixes;
        spEnergia.innerHTML = energia.toFixed(1);
        spComida.innerHTML = comida;
        spMensagem.innerHTML = `Energia -${gasto.toFixed(1)}, Comida +${numPeixes}.`;

        map[localX][localY] = 0;
    } else {
        spMensagem.innerHTML = "Saia da ilha para poder pescar."
    }
}

function coletarAgua() {
    if ((clima == "chuvoso" || clima == "tempestade") && agua < 5) {
        const ganho = 5 - agua;
        agua += ganho;
        spAgua.innerHTML = agua;
        spMensagem.innerHTML = `Água +${ganho}.`;
    } else {
        spMensagem.innerHTML = "Você só pode coletar água em dias chuvosos ou de tempestade até completar 5 unidades."
    }
}

// Coletar cocos em ilhas
function colherCocos() {
    if (map[localX][localY] == "ilha" && comida < 10) {
        const gasto = 3 * FatorClima[clima];
        const numCocos = 10 - comida;
        energia -= gasto;
        comida += numCocos;
        spEnergia.innerHTML = energia.toFixed(1);
        spComida.innerHTML = comida;
        spMensagem.innerHTML = `Energia -${gasto.toFixed(1)}, Comida +${numCocos}.`;
    } else {
        spMensagem.innerHTML = "Você só pode coletar côcos em ilhas até completar 10 unidades de comida."
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
        spMensagem.innerHTML = `Energia +1, Comida -1, Res. Fome +1 dia, Res. Sede -1 dia.`;
    } else {
        spMensagem.innerHTML = "Você não possui comida. Tente pescar ou encontrar uma ilha."
    }
}

function beberAgua() {
    if (agua > 0) {
        agua--;
        sede++;
        spAgua.innerHTML = agua;
        spSede.innerHTML = sede;
        spMensagem.innerHTML = `Água -1, Res. Sede +1 dia.`;
    } else {
        spMensagem.innerHTML = "Você não possui água. Espere chover para coletar."
    }
}

function mostarLocal() {
    spMensagem.innerHTML = `Você está na posição (${localX}, ${localY}).`;
}
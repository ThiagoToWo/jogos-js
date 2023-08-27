// Elementos
class Explorador {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 10;
        this.vx = 0;
        this.vy = 0;
        this.cor = "#0f0";
        this.ctx = context;
        this.ativoAtualizar = true;
        this.ativoDesenhar = true;
        this.ativoColidir = true;
        this.noSolo;
    }

    atualizar() {
        if (!this.ativoAtualizar) return;

        if (pressionados[0]) {
            this.vx = 1;
            this.x -= this.vx;
        }

        if (pressionados[1]) {
            this.vx = 1;
            this.x += this.vx;
        }

        if (pressionados[2] && this.noSolo) {            
            this.vy = -5;
            this.noSolo = false;
        }

        this.vy += G;
        this.y += this.vy;

        if (this.vy > VT) {
            this.vy = VT;
        }        
    }

    desenhar() {
        if (!this.ativoDesenhar) return;

        this.ctx.save();
        this.ctx.fillStyle = this.cor;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.restore();
    }

    colidiuCom(elemento) {
        if (!this.ativoColidir) return;

        return this.x + this.w > elemento.x &&
            this.x < elemento.x + elemento.w &&
            this.y + this.h > elemento.y &&
            this.y < elemento.y + elemento.h;
    }

    colidiuComBloco(bloco) {
        const dx = (this.x + this.w / 2) - (bloco.x + bloco.w / 2);
        const dy = (this.y + this.h / 2) - (bloco.y + bloco.h / 2);
        const meiaLarguraCombinada = (this.w / 2) + (bloco.w / 2);
        const meiaAlturaCombinada = (this.h / 2) + (bloco.h / 2);
        let colidiuComOLado = "nenhum";

        if (Math.abs(dx) < meiaLarguraCombinada) {
            if (Math.abs(dy) < meiaAlturaCombinada) {
                const sobreposicaoX = meiaLarguraCombinada - Math.abs(dx);
                const sobreposicaoY = meiaAlturaCombinada - Math.abs(dy);

                if (sobreposicaoX >= sobreposicaoY) {
                    if (dy > 0) {
                        colidiuComOLado = "cima";
                        this.y += sobreposicaoY;
                    } else {
                        colidiuComOLado = "baixo";
                        this.y -= sobreposicaoY;
                    }
                } else {
                    if (dx > 0) {
                        colidiuComOLado = "esquerda";
                        this.x += sobreposicaoX;
                    } else {
                        colidiuComOLado = "direita";
                        this.x -= sobreposicaoX;
                    }
                }
            }
        }

        return colidiuComOLado;
    }
}
class Box {
    constructor(x, y, w, h, vx, vy, cor, context) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.cor = cor;
        this.ctx = context;
        this.noSolo;
        this.ativoAtualizar = true; // se pode atualizar
        this.ativoDesenhar = true; // se pode desenhar
        this.ativoColidir = true; // se pode colidir
    }

    atualizar() {
        if (!this.ativoAtualizar) return;

        if (pressionados[0]) { // esquerda                    
            this.x -= this.vx;
        }

        if (pressionados[1]) { // direita
            this.x += this.vx;
        }

        if (pressionados[2] && this.noSolo) { // pular            
            this.vy = -5;
            this.noSolo = false;
        }

        // sempre sobre a ação da gravidade
        this.vy += G;
        this.y += this.vy;
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
}
class Moeda {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 5;
        this.vy = 0.1;
        this.cor = "#ff0";
        this.ctx = context;
        this.ativoAtualizar = true; // se pode atualizar
        this.ativoDesenhar = true; // se pode desenhar

        this.angulo = 0;
        this.centro = this.y;
        this.amplitude = 1;
    }

    atualizar() {
        if (!this.ativoAtualizar) return;

        this.y = this.centro + Math.sin(this.angulo) * this.amplitude;
        this.angulo += this.vy;
    }

    desenhar() {
        if (!this.ativoDesenhar) return;

        this.ctx.save();
        this.ctx.fillStyle = this.cor;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.restore();
    }
}
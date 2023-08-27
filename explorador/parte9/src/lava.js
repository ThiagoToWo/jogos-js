class Lava {
    constructor(x, y, vx, vy, ampX, ampY, context) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 5;
        this.vx = vx;
        this.vy = vy;
        this.cor = "#f00";
        this.ctx = context;
        this.ativoAtualizar = true; // se pode atualizar
        this.ativoDesenhar = true; // se pode desenhar

        this.anguloX = 0;
        this.anguloY = 0;
        this.centroX = this.x;
        this.centroY = this.y;
        this.amplitudeX = ampX;
        this.amplitudeY = ampY;
    }

    atualizar() {
        if (!this.ativoAtualizar) return;

        this.x = this.centroX + Math.cos(this.anguloX) * this.amplitudeX;
        this.y = this.centroY + Math.sin(this.anguloY) * this.amplitudeY;
        this.anguloX += this.vx;
        this.anguloY += this.vy;
    }

    desenhar() {
        if (!this.ativoDesenhar) return;

        this.ctx.save();
        this.ctx.fillStyle = this.cor;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.restore();
    }
}
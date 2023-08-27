class Bloco {
    constructor(x, y, w, h, cor, context) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.cor = cor;
        this.ctx = context;
    }
    
    desenhar() {
        this.ctx.save();
        this.ctx.fillStyle = this.cor;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.restore();
    }
}
class Bloco {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 5;
        this.cor = "#fff";
        this.ctx = context;
    }
    
    desenhar() {
        this.ctx.save();
        this.ctx.fillStyle = this.cor;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.restore();
    }
}
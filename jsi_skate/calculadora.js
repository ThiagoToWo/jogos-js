function Calculadora() {
	this.acertos = new Array(9);
	this.ganhos = new Array(9);
	this.perdas = new Array(9);
}

Calculadora.prototype = {
	calcular: function(s, o) {		
		for (var i = 0; i < 9; i++) {
			var random = Math.random();			
			var chance;
			
			if (i <= 6) {
				 chance = s[i] / o[i];
				
				if ((s[i] > 0) && (o[i] > 0) && (random <= chance)) {
					this.acertos[i] = 'acertou';
					this.ganhos[i] = o[i] / s[i];
				} else if ((s[i] > 0) && (o[i] > 0) && (random > chance)) {
					this.acertos[i] = 'errou';
					this.perdas[i] = Math.abs(o[i] - s[i]);
				}
			} else {
				if (o[i]) {
					chance = s[i] / 100;
					
					if (random <= chance) {
						this.acertos[i] = 'acertou';
					} else {
						this.acertos[i] = 'errou';
						this.perdas[i] = 1;
					}
					this.ganhos[i] = 0.1;					
				}				
			}
		}
	},
	
	limpar: function() {
		this.acertos.fill('');
		this.ganhos.fill(0);
		this.perdas.fill(0);
	}
}
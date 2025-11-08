class Maid{
    isPrepared = false;
    constructor(){
        this.message = document.getElementById('message');
        this.buttons = document.querySelector('.buttons');
        this.wagon = document.getElementById('wagon');

        this.buttons.addEventListener("click", e => {
            const btn = e.target;
            console.log(btn);
            if (!btn.matches("button")) return;
            const item = btn.dataset.value;
            if(item=='leyTheTable') this.leyTheTable();
            else if(item=='clear') this.CleanWagon();
            else this.putWagon(item);
        });
    }
    leyTheTable(){
        const cs = new CakeStand();
        const cakes = this.wagon.value.trim()
        const niceCakes = cakes.match(/(\d+\.?\d*)|([+\-*/()])|(\s+)/g).filter(cake => cake.trim() !== '');

        const maidSoeur = new MaidSoeur(niceCakes);
        const tokens = maidSoeur.getRPN();
        if(this.kiss(maidSoeur)){
            tokens.forEach(token => {
                cs.push(token);
            });
        }    
        // ケーキのご用意ができました。
        const lady = new Alice(cs);
        if(!cs.empty()){
            this.wagon.value = cs.pop();
        }
    }
    CleanWagon(){
        this.wagon.value = ''
    }
    putWagon(item){
        this.wagon.value += item;
    }
    kiss(soeur){
        if(soeur.kiss())this.isPrepared = true;
        return this.isPrepared && soeur.isPrepared;
    }
}

class MaidSoeur{
    isPrepared = false;
    constructor(tokens){
        this.tokens = tokens;
        this.output = [];
        this.opStack = [];
        this.precedence = {
            '+': 1, '-': 1,
            '*': 2, '/': 2
        };
        this.transform();
    }

    isHigherPrecedence(op1, op2){
        return this.precedence[op1] >= this.precedence[op2];
    }

    transform(){
        for (const token of this.tokens) {
            if (!isNaN(parseFloat(token)))
                this.output.push(parseFloat(token));
            else if (token === '(')
                this.opStack.push(token);
            else if (token === ')') {
                while (this.opStack.length > 0 && this.opStack[this.opStack.length - 1] !== '(') {
                    this.output.push(this.opStack.pop());
                }
                if (this.opStack.length > 0 && this.opStack[this.opStack.length - 1] === '(') {
                    this.opStack.pop();
                }
            } else if (this.precedence[token]) {
                while (
                    this.opStack.length > 0 &&
                    this.opStack[this.opStack.length - 1] !== '(' &&
                    this.isHigherPrecedence(this.opStack[this.opStack.length - 1], token)
                ) {
                    this.output.push(this.opStack.pop());
                }
                this.opStack.push(token);
            }
        }
        while (this.opStack.length > 0) {
            this.output.push(this.opStack.pop());
        }
    }
    getRPN(){
        return this.output;
    }
    kiss(){
        this.isPrepared = true;
        return 1
    }
    
}

class CakeStand{
    constructor(){
        const STAND_SIZE=100;
        this.plate=new Array(STAND_SIZE);
        this.cake=0;   
    }
    push(cake){
        if(this.cake>=this.plate.length) error("stack overflow");
        this.plate[this.cake++] = isNaN(cake) ? cake : parseFloat(cake);
    }

    pop(){
	    if(this.cake<0) error("stack underflow\n");
	    return this.plate[--this.cake];
    }
    empty(){return this.cake === 0;}
}

class Alice{
    constructor(cakestand){
        this.cs = cakestand;
        this.i = 0;
        //友達を呼びますわ！！
        const mary = new Mary(this.cs);
        const kaguya = new Kaguya(this.cs);
        const ellie = new Ellie(this.cs);
        while(!this.cs.empty() && this.i < 100){
            this.cake = this.cs.pop();
            if(typeof this.cake === 'number'){
                this.cs.push(this.cake);
                this.i++;
                continue;
            }else{
                this.op = this.cake;
                switch(this.op){
                    case '+':this.eat();break;
                    case '-':mary.eat(this.cs);break;
                    case '*':kaguya.eat(this.cs);break;
                    case '/':ellie.eat(this.cs);break;
                    case ' ':case '\t':break;
                    default: console.log('食べられませんわ！')
                }
            }
            this.i++;
        }
    }
    eat(){
        const a = this.cs.pop(); const b = this.cs.pop();
        this.cs.push(b+a);
    }
}
class Mary{
    eat(cakestand){
        const cs = cakestand;
        const a = cs.pop(); const b = cs.pop();
        cs.push(b-a);
    }
}
class Kaguya{
    eat(cakestand){
        const cs = cakestand;
        const a = cs.pop(); const b = cs.pop();
        cs.push(b*a);
    }
}
class Ellie{
    eat(cakestand){
        const cs = cakestand;
        const a = cs.pop(); const b = cs.pop();
        cs.push(b/a);
    }
}

maid= new Maid;
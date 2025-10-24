class brain{
    constructor(){
        this.reset()
    }
    reset(){
        this.a=0;
        this.b=0;
        this.op=0;
        this.base=10;
        mn.render('');
    }
    inputnum(num){
        this.b = this.base*this.b+num
        mn.format(this.b);
    }
    inputop(op){
        this.op=op;
        this.a=this.b;
        this.b=0;
    }
    calc(a,b,op){
        switch(op){
            case '+': return a+b;
            case '-': return a-b;
            case '*': return a*b;
            case '/':
                if(b==0){mn.render("n/0 is not defined");return Infinity}
                return a/b;
        }
    }
    set(){
        if(this.b<2 || this.b>16){mn.render("2<=n<=16!!");return;}
        if(this.op)return;
        this.base=this.b;
        this.b=0;
        mn.format(this.b);
    }
    result() {
        if(!this.op){mn.format(this.b);return;}
        this.b = this.calc(this.a, this.b, this.op);
        mn.format(this.b);
        this.a = this.b;
        this.b = 0;
        this.op = null;
    }
}

class SensoryNerve{
    constructor(){
        this.message = document.getElementById('message');
        this.buttons = document.querySelector('.buttons');

        this.buttons.addEventListener("click", e => {
            const btn = e.target;
            if (!btn.matches("button")) return;
            const action = btn.dataset.action || btn.classList[0];
            this.actions[action]?.(btn);
        });
    }
    actions = {
        number: (b) => {
            const numberData = parseInt(b.dataset.number,br.base);
            console.log(numberData);
            if (isNaN(numberData)) return;
            br.inputnum(numberData);
        },
        operator: (b) =>{
            const op = b.dataset.operator;
            console.log(op);
            br.inputop(op)
        },
        calculate: () => br.result(),
        set: () => br.set(),
        clear: () => br.reset()
    }
}

class MotorNerve{
    constructor(){
        this.display = document.getElementById('display');
    }
    format(num) {
        this.render(`(${br.base})` + num.toString(br.base).toUpperCase())
    }
    render(s){
        this.display.value = s;
    }
}

mn= new MotorNerve
br= new brain;
sn= new SensoryNerve;
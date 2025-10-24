const display = document.getElementById('display');
const message = document.getElementById('message');
const buttons = document.querySelector('.buttons');
let state = {
    GlobalOperand:0,
    LetOperand:0,
    NextOpe:0,
    NANS:10//N-Adic Number System
}
const OPS = { ADD: 1, SUB: 2, MUL: 3, DIV: 4 };

function calc(ope,a,b){
    switch(ope){
        case OPS.ADD: return a+b;
        case OPS.SUB: return a-b;
        case OPS.MUL: return a*b;
        case OPS.DIV: {
            if (b === 0) 
            message.innerHTML="n/0 is not defined";
            return a/b;
        }
    }
}

buttons.addEventListener('click', (event) => {
    const target = event.target;
    if(!target.matches('button'))return;

    if(target.classList.contains('number')){
        const numberData = target.dataset.number;
        console.log(numberData);
        newNum(Number(numberData));
        return;
    }
    if(target.classList.contains('operator')){
        console.log(target.dataset.operator);
        newOperator(target.dataset.operator);
        return;
    }
    if(target.dataset.action === 'calculate'){
        state.GlobalOperand=calc(state.NextOpe,state.GlobalOperand,state.LetOperand)
        Show(state.GlobalOperand)
        return;
    }
    if (target.classList.contains('set')) {
        set();
        return;
    }
    if (target.dataset.action === 'clear') {
        reset();
        return;
    }
})

function newNum(num){
    if(!state.LetOperand)state.LetOperand=num;
    else state.LetOperand=state.NANS*state.LetOperand+num;
    Show(state.LetOperand);
}

function set(){
    if(state.LetOperand<2 || state.LetOperand>16){message.innerHTML="2<=n<=16!!";return;}
    if(state.NextOpe)return;
    state.NANS=state.LetOperand;
    state.LetOperand=0;
    display.value='('+state.NANS+')'
}

function newOperator(ope){
    if(!state.NextOpe)state.GlobalOperand=state.LetOperand;
    else state.GlobalOperand=calc(state.NextOpe,state.GlobalOperand,state.LetOperand)
    switch(ope){
        case '+': state.NextOpe = OPS.ADD; break;
        case '-': state.NextOpe = OPS.SUB; break;
        case '*': state.NextOpe = OPS.MUL; break;
        case '/': state.NextOpe = OPS.DIV; break;
    }
    state.LetOperand=0;
}

function Show(num){
    display.value='('+state.NANS+')'+num.toString(state.NANS).toUpperCase();
}

function reset(){
    state = { 
        GlobalOperand: 0, 
        LetOperand: 0, 
        NextOpe: 0, 
        NANS: 10
    };
    display.value='';
}
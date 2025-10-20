const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');
let state = {
    GlobalOperand:0,
    LetOperand:0,
    NextOpe:0
}

function calc(ope,a,b){
    switch(ope){
        case 1: return a+b;
        case 2: return a-b;
        case 3: return a*b;
        case 4: {
            if (b === 0) 
            throw new Error("Division by zero is not allowed.");
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
    if (target.dataset.action === 'clear') {
        reset();
        return;
    }
})

function newNum(num){
    if(!state.LetOperand)state.LetOperand=num;
    else state.LetOperand=16*state.LetOperand+num;
    Show(state.LetOperand);
}

function newOperator(ope){
    if(!state.NextOpe)state.GlobalOperand=state.LetOperand;
    else state.GlobalOperand=calc(state.NextOpe,state.GlobalOperand,state.LetOperand)
    switch(ope){
        case '+': state.NextOpe = 1; break;
        case '-': state.NextOpe = 2; break;
        case '*': state.NextOpe = 3; break;
        case '/': state.NextOpe = 4; break;
    }
    state.LetOperand=0;
}

function Show(num){
    display.value=num.toString(16).toUpperCase();
}

function reset(){
    Object.keys(state).forEach(key => state[key]=0);
    display.value='';
}
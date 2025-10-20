document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    // 計算機アプリケーションの状態管理
    let firstOperand = null; // 最初のオペランド（被演算子）
    let operator = null;     // 選択された演算子
    let waitingForSecondOperand = false; // 2番目のオペランドを待っているか（演算子入力後）

    /**
     * ディスプレイに数字/小数点/エラーを表示する
     * @param {string} inputValue - 入力値
     */
    function inputDigit(inputValue) {
        if (waitingForSecondOperand === true) {
            // 演算子入力後の最初の数字は新しい値として扱う
            display.value = inputValue;
            waitingForSecondOperand = false;
        } else {
            // 現在の値に新しい数字を追加
            // ただし、ディスプレイが '0' の場合は置き換える
            display.value = display.value === '0' ? inputValue : display.value + inputValue;
        }
    }

    /**
     * 小数点を入力する
     */
    function inputDecimal() {
        if (waitingForSecondOperand === true) {
            display.value = '0.';
            waitingForSecondOperand = false;
            return;
        }

        // 小数点がすでになければ追加
        if (!display.value.includes('.')) {
            display.value += '.';
        }
    }

    /**
     * 演算子を処理する
     * @param {string} nextOperator - 次の演算子 ('+', '-', '*', '/')
     */
    function handleOperator(nextOperator) {
        // 現在ディスプレイに表示されている値を数値に変換
        const inputValue = parseFloat(display.value);

        if (operator && waitingForSecondOperand) {
            // 演算子が既に選択されていて、まだ2番目のオペランドが入力されていない場合
            // 新しい演算子で置き換える (例: '+'の後に'×'を押したら'×'になる)
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            // 最初のオペランドが未設定なら、現在の値を設定
            firstOperand = inputValue;
        } else if (operator) {
            // 2番目のオペランドが入力済みで、前回の演算子がある場合
            // 即座に計算を実行し、結果を次の最初のオペランドとする
            const result = calculate(firstOperand, inputValue, operator);
            
            // 結果をディスプレイに表示（小数点以下は最大9桁で丸める）
            display.value = String(result).slice(0, 15); // 結果が長くなりすぎるのを防ぐ
            firstOperand = result; // 結果を次の計算の最初のオペランドとして保持
        }

        // 次のオペランド入力を待機する状態に設定
        waitingForSecondOperand = true;
        // 選択された演算子を保持
        operator = nextOperator;
    }

    /**
     * 実際の四則演算ロジック
     * @param {number} first - 最初の数値
     * @param {number} second - 2番目の数値
     * @param {string} op - 演算子
     * @returns {number} 計算結果
     */
    function calculate(first, second, op) {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': 
                if (second === 0) {
                    alert("ゼロによる割り算はできません。");
                    return NaN; // Not a Numberを返す
                }
                return first / second;
            default: return second;
        }
    }

    /**
     * 計算機をリセットする
     */
    function resetCalculator() {
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        display.value = '0';
    }

    /**
     * ボタンクリックイベントのディスパッチ（振り分け）
     * @param {Event} event 
     */
    buttons.addEventListener('click', (event) => {
        const target = event.target;
        // クリックされた要素がボタンでなければ何もしない
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('number')) {
            // 数字または小数点の処理
            const number = target.dataset.number;
            if (number === '.') {
                inputDecimal();
            } else {
                inputDigit(number);
            }
            return;
        }

        if (target.classList.contains('operator')) {
            // 演算子の処理
            handleOperator(target.dataset.operator);
            return;
        }

        if (target.dataset.action === 'calculate') {
            // '=' (計算実行) の処理
            // firstOperand, display.value, operatorの3つが揃っている必要がある
            if (firstOperand !== null && operator !== null && waitingForSecondOperand === false) {
                // handleOperatorを再利用して計算を実行
                handleOperator(operator);
            }
            return;
        }

        if (target.dataset.action === 'clear') {
            // 'C' (クリア) の処理
            resetCalculator();
            return;
        }
    });

    // 初期化
    resetCalculator();
});
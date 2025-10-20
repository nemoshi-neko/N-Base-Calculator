document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    // 計算機アプリケーションの状態管理
    let firstOperand = null; // 最初のオペランド（10進数）
    let operator = null;     // 選択された演算子
    let waitingForSecondOperand = false; // 2番目のオペランドを待っているか
    
    // 16進数と10進数の対応マップ (0-9, A-F)
    const HEX_MAP = {
        '10': 'A', '11': 'B', '12': 'C', '13': 'D', '14': 'E', '15': 'F'
    };
    
    /**
     * 16進数文字列を10進数にパースする
     * @param {string} hexString - 16進数表記の文字列
     * @returns {number} 10進数表記の数値
     */
    function parseHexToDecimal(hexString) {
        // JavaScriptの標準関数 parseInt() を使用し、基数16を指定
        return parseInt(hexString, 16);
    }
    
    /**
     * 10進数数値を16進数文字列に変換する
     * @param {number} decimalNumber - 10進数表記の数値
     * @returns {string} 大文字の16進数表記の文字列
     */
    function formatDecimalToHex(decimalNumber) {
        if (isNaN(decimalNumber)) return "Error";
        // toUpperCase() で大文字に変換
        return decimalNumber.toString(16).toUpperCase();
    }

    /**
     * ディスプレイに数字/アルファベットを表示する
     * @param {string} inputData - data-numberから取得した値 ('0'～'15')
     */
    function inputDigit(inputData) {
        let hexDigit;
        
        if (inputData >= 10 && inputData <= 15) {
            // 10-15をA-Fに変換
            hexDigit = HEX_MAP[inputData];
        } else {
            // 0-9はそのまま
            hexDigit = inputData;
        }

        if (waitingForSecondOperand === true) {
            // 新しい値として扱う
            display.value = hexDigit;
            waitingForSecondOperand = false;
        } else {
            // 現在の値に追加
            // ただし、'0'の場合は置き換え
            display.value = display.value === '0' ? hexDigit : display.value + hexDigit;
        }
    }
    
    /**
     * 小数点の入力 (16進数の計算機では通常不要だが、一応実装)
     */
    function inputDecimal() {
        // 16進数計算機では小数点は通常扱わないため、今回は動作しないようにします。
        // もし対応が必要な場合は、浮動小数点数の16進数表現（例: IEEE 754）を考慮する必要がありますが、
        // シンプルな実装のため今回はスキップします。
        console.log("16進数計算機では小数点はサポートされていません。");
    }

    /**
     * 演算子を処理し、計算を実行する
     * @param {string} nextOperator - 次の演算子 ('+', '-', '*', '/')
     */
    function handleOperator(nextOperator) {
        // 現在のディスプレイ値を16進数文字列として取得
        const hexValue = display.value;
        
        // 10進数に変換して計算に使用
        const inputValue = parseHexToDecimal(hexValue);

        if (isNaN(inputValue)) {
             display.value = 'Error';
             return;
        }

        if (operator && waitingForSecondOperand) {
            // 演算子の置き換え
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            // 最初のオペランドを設定 (10進数)
            firstOperand = inputValue;
        } else if (operator) {
            // 2番目のオペランドが入力済みの場合、計算を実行
            const result = calculate(firstOperand, inputValue, operator);
            
            // 結果 (10進数) を16進数に変換して表示
            display.value = formatDecimalToHex(result);
            firstOperand = result; // 結果を次の計算の最初のオペランドとして保持 (10進数)
        }

        // 次のオペランド入力を待機する状態に設定
        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    /**
     * 実際の四則演算ロジック (10進数で行う)
     * @param {number} first - 最初の数値 (10進数)
     * @param {number} second - 2番目の数値 (10進数)
     * @param {string} op - 演算子
     * @returns {number} 計算結果 (10進数)
     */
    function calculate(first, second, op) {
        switch (op) {
            // 16進数計算機では整数演算が主流のため、ビット演算（&, |, ^）も一般的ですが、
            // 今回は四則演算のみに絞り込み、10進数として処理します。
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': 
                if (second === 0) {
                    alert("ゼロによる割り算はできません。");
                    return NaN; // Not a Number
                }
                // 16進数計算機では通常、結果を整数に切り捨てる（ビット演算のように）
                // ことが多いが、ここでは一般的な浮動小数点の結果を返します。
                return Math.floor(first / second); // 整数部分のみを返す
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
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('number')) {
            // data-numberは文字列として取得される
            const numberData = target.dataset.number;
            
            if (numberData === '.') {
                inputDecimal(); // 小数点処理（今回は機能しない）
            } else {
                inputDigit(numberData);
            }
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.dataset.operator);
            return;
        }

        if (target.dataset.action === 'calculate') {
            if (firstOperand !== null && operator !== null && waitingForSecondOperand === false) {
                // '=' (計算実行) はhandleOperatorを再利用
                handleOperator(operator);
            }
            return;
        }

        if (target.dataset.action === 'clear') {
            resetCalculator();
            return;
        }
    });

    // 初期化
    resetCalculator();
});
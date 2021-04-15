class CalcController {

    constructor() {
        // O caractere '$' simboliza elementos que vieram do DOM
        this._$displayCalc = document.querySelector('#display');
        this._$date = document.querySelector('#data');
        this._$time = document.querySelector('#hora');

        this._operation = [0];
        this._lastOperator = '';
        this._lastNumber = '';

        this._locale = 'pt-BR';
        this._currentDate;        
        this._audioOnOff = false;
        this._audio = new Audio('click.mp3');

        this.initialize();
    }

    initialize() {
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.initButtonEvents();
        this.setLastNumberToDisplay();
        this.initKeyboard();  
        this.pasteFromClipboard();

        // Duplo click no AC para ativar/desativar som
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            })
        })
    }

    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            this.$displayCalc = parseFloat(text);
        })
    }

    copyToClipboard() {
        let input = document.createElement('input');
        input.value = this.$displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    toggleAudio() {
        this.audioOnOff = !this.audioOnOff;        
    }

    playAudio() {
       if (this.audioOnOff) {
           this.audio.currentTime = 0;
           this.audio.play();
       } 
    }

    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();

            switch (e.key) {
                case 'Delete':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;  
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;

            }
        })
    }

    addEventListenerAll(element, events, fn) { // Trabalha com mais de um evento do DOM
        events.split('-').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    initButtonEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, 'click-drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover-mouseup-mousedown", e => {
                btn.style.cursor = "pointer";
            })
        });
    }

    setDisplayDateTime() {
        this.$displayTime = this.currentDate.toLocaleTimeString(this.locale);
        this.$displayDate = this.currentDate.toLocaleDateString(this.locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    clearAll() {
        this.operation = [0];
        this.lastNumber = '';
        this.lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        if (this.operation.length === 1) {
            this.clearAll();
        } else {
            this.operation.pop();
            this.setLastNumberToDisplay();
        }
    }

    getLastOperation() {
        return this.operation[this.operation.length - 1];
    }

    setLastOperation(newLastValue) {
        this.operation[this.operation.length - 1] = newLastValue;
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    isSubtraction(operator) {
        return (operator === "-" && this.getLastOperation() !== "-");
    }

    isInitialStateOperation() {
        return (this.operation[0] === 0 && this.operation.length <= 2);
    }

    pushOperation(newValue) {
        this.operation.push(newValue);
        if (this.operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        return eval(this.operation.join(""));
    }

    calc() {
        let lastValue = '';
        this.lastOperator = this.getLastItem();

        if (this.operation.length < 3) {
            let firstItem = this.operation[0];
            this.operation = [firstItem, this.lastOperator, this.lastNumber];
        }
        if (this.operation.length > 3) {
            lastValue = this.operation.pop();

            this.lastNumber = this.getResult();
        } else if (this.operation.length === 3) {
            this.lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (lastValue == '%') {
            result /= 100; // É o mesmo que result = result / 100
            this.operation = [result];
        } else {
            this.operation = [result];
            if (lastValue) this.operation.push(lastValue);
        }
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this.operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this.operation[i]) === isOperator) {
                lastItem = this.operation[i];
                break;
            }
        }

        if (!lastItem && lastItem !== 0) {
            lastItem = (isOperator) ? this.lastOperator : this.lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (this.isInitialStateOperation()) {
            this.$displayCalc = 0;
        } else {
            this.$displayCalc = lastNumber;
        }
    }

    concatNumbers(number) {
        if (this.isInitialStateOperation()) {
            this.setLastOperation(number);
        } else {
            let newValue = this.getLastOperation().toString() + number.toString();
            this.setLastOperation(newValue);
        }
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            //String
            if (this.isInitialStateOperation() && this.isOperator(value)) {
                if (this.isSubtraction(value)) {
                    this.pushOperation(value);
                }
            } else if (this.isOperator(value)) {
                //Troca operador 
                this.setLastOperation(value);
            } else {
                //Add value
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            //Number            
            if (this.isInitialStateOperation() && this.isOperator(value)) {
                if (this.isSubtraction(value)) {
                    this.pushOperation(value);
                }
            } else if (this.isOperator(value)) {
                //Add operator
                this.pushOperation(value);
            } else {
                //Concatena último número do array com o próximo acionado (value)
                this.concatNumbers(value)
                this.setLastNumberToDisplay();
            }
        }
    }

    setError() {
        this.$displayCalc = 'ERROR';
    }

    addDot() { //add "."
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        // O if acima verifica se o "." já existe em lastOperation

        if (this.isOperator(lastOperation)) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    execBtn(btnValue) {
        this.playAudio();

        switch (btnValue) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(btnValue));
                break;

            default:
                this.setError();
                break;
        }
    }

    get $displayTime() {
        return this._$time.innerHTML;
    }

    set $displayTime(time) {
        return this._$time.innerHTML = time;
    }

    get $displayDate() {
        return this._$date.innerHTML;
    }

    set $displayDate(date) {
        return this._$date.innerHTML = date;
    }

    get $displayCalc() {
        return this._$displayCalc.innerHTML;
    }

    set $displayCalc(digit) {
        return this._$displayCalc.innerHTML = digit;
    }

    get locale() {
        return this._locale;
    }

    get operation() {
        return this._operation;
    }

    set operation(value) {
        return this._operation = value
    }

    get lastOperator() {
        return this._lastOperator;
    }

    set lastOperator(value) {
        return this._lastOperator = value
    }

    get lastNumber() {
        return this._lastNumber;
    }

    set lastNumber(value) {
        return this._lastNumber = value
    }

    get audioOnOff() {
        return this._audioOnOff;
    }

    set audioOnOff(state) {
        return this._audioOnOff = state
    }

    get audio() {
        return this._audio;
    }

    get currentDate() {
        return new Date;
    }

    set currentDate(date) {
        this._currentDate = date;
    }
}
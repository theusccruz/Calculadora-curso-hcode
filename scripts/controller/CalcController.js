class CalcController {

    constructor() {
        // O caractere '$' simboliza elementos que vieram do DOM
        this._$displayCalc = document.querySelector('#display');
        this._$date = document.querySelector('#data');
        this._$time = document.querySelector('#hora');
        this._locale = 'pt-BR';
        this._operation = [0];
        this._currentDate;
        this.initialize();
    }

    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.initButtonEvents();
        this.setLastNumberToDisplay();
    }

    addEventListenerAll(element, events, fn) { //trabalha com mais de um evento do DOM
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
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
        this.displayDate = this.currentDate.toLocaleDateString(this.locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    clearAll() {
        this.operation = [0];
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

    calc() {
        let lastValue = this.operation.pop();
        let result = eval(this.operation.join(""));

        if (lastValue == '%') {
            result /= 100; //é o mesmo que result = result / 100
            this.operation = [result];
        } else {            
            this.operation = [result, lastValue];
        }
        this.setLastNumberToDisplay();
    }

    setLastNumberToDisplay() {
        let lastNumber;
        for (let i = this.operation.length - 1; i >= 0; i--) {
            if (!this.isOperator(this.operation[i])) {
                lastNumber = this.operation[i];
                break;
            }
        }
        this.displayCalc = lastNumber;
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
            } else if (isNaN(value)) {
                //Any
                console.log(value);
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
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
            }
        }
        console.log(this.operation);
    }

    setError() {
        this.displayCalc = 'ERROR';
    }

    execBtn(btnValue) {
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
                break;

            case 'ponto':
                this.addOperation('.');
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

    get displayTime() {
        return this._$time.innerHTML;
    }

    set displayTime(time) {
        return this._$time.innerHTML = time;
    }

    get displayDate() {
        return this._$date.innerHTML;
    }

    set displayDate(date) {
        return this._$date.innerHTML = date;
    }

    get displayCalc() {
        return this._$displayCalc.innerHTML;
    }

    set displayCalc(digit) {
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

    get currentDate() {
        return new Date;
    }

    set currentDate(date) {
        this._currentDate = date;
    }
}
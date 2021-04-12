class CalcController {

    constructor() {
        // O caractere '$' simboliza elementos que vieram do DOM
        this._$displayCalc = document.querySelector('#display');
        this._$date = document.querySelector('#data');
        this._$time = document.querySelector('#hora');
        this._locale = 'pt-BR';
        this._operation = [];
        this._currentDate;
        this.initialize();
    }

    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.initButtonEvents();
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
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    clearAll() {
        this._operation = [];
    }

    clearEntry() {
        this._operation.pop();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(newLastValue) {
        this._operation[this._operation.length - 1] = newLastValue;
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(newValue) {
        this._operation.push(newValue);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    calc() {
        let lastValue = this._operation.pop();        
        let result = eval(this._operation.join(""));         
        this._operation = [result, lastValue]; 
    }

    setLastNumberToDisplay() {
        
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            //String
            if (this.isOperator(value)) {
                //Troca operador 
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                //Any
                console.log(value);
            } else {
                //Add value
                this.pushOperation(value);
            }
        } else {
            //Number
            if (this.isOperator(value)) {
                //Add operator
                this.pushOperation(value);
            } else {
                //Concatena último número do array com o próximo acionado (value) 
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                this.setLastNumberToDisplay();
            }
        }
        console.log(this._operation);
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
        this._$displayCalc.innerHTML = digit;
    }

    get currentDate() {
        return new Date;
    }

    set currentDate(date) {
        this._currentDate = date;
    }
}
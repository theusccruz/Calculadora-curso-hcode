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
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll() {
        this._operation = [];
    }

    clearEntry() {
        this._operation.pop();
        console.log(this._operation);
    }

    addOperation(value) {
        this._operation.push(value);
        console.log(this._operation);
    }

    setError() {
        this.displayCalc = 'ERROR';
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':

                break;
            case 'subtracao':

                break;
            case 'divisao':

                break;
            case 'multiplicacao':

                break;
            case 'porcento':

                break;
            case 'igual':

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
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
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

    get displayTime() {
        return this._$time.innerHTML;
    }

    set displayTime(value) {
        return this._$time.innerHTML = value;
    }

    get displayDate() {
        return this._$date.innerHTML;
    }

    set displayDate(value) {
        return this._$date.innerHTML = value;
    }

    get displayCalc() {
        return this._$displayCalc.innerHTML;
    }

    set displayCalc(value) {
        this._$displayCalc.innerHTML = value;
    }

    get currentDate() {
        return new Date;
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}
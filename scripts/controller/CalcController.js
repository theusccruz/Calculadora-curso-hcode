class CalcController {

    constructor() {
        // O caractere '$' simboliza elementos que vieram do DOM
        this._$displayCalc = document.querySelector('#display');
        this._$date = document.querySelector('#data');
        this._$time = document.querySelector('#hora');
        this._locale = 'pt-BR';
        this._currentDate = '0';
        this.initialize();
    }

    initialize() {
        this.setDisplayDateTme();

        setInterval(() => {
            this.setDisplayDateTme();
        }, 1000);
    }

    setDisplayDateTme() {
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
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
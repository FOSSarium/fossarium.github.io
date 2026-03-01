class Calculator {
    constructor(historyElem, resultElem) {
        this.historyElem = historyElem;
        this.resultElem = resultElem;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand === "Error") return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.currentOperand === "Error") this.clear();
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen) {
            this.currentOperand = number;
            this.shouldResetScreen = false;
        } else {
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number;
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === "Error") return;
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '/':
                if (current === 0) {
                    this.currentOperand = "Error";
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default: return;
        }

        // Fix floating point issues
        computation = Math.round(computation * 10000000000) / 10000000000;

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    percentage() {
        if (this.currentOperand === "Error") return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        if (number === "Error") return number;

        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.resultElem.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            let opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
            this.historyElem.innerText = `${this.getDisplayNumber(this.previousOperand)} ${opMap[this.operation]}`;
        } else {
            this.historyElem.innerText = '';
        }

        // Adjust font size based on length
        if (this.currentOperand.length > 12) {
            this.resultElem.style.fontSize = '2rem';
        } else if (this.currentOperand.length > 8) {
            this.resultElem.style.fontSize = '2.5rem';
        } else {
            this.resultElem.style.fontSize = '3rem';
        }
    }
}

const historyElem = document.getElementById('history');
const resultElem = document.getElementById('result');
const calculator = new Calculator(historyElem, resultElem);

const buttons = document.querySelectorAll('.calc-btn');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('number')) {
            calculator.appendNumber(button.dataset.number);
        } else if (button.classList.contains('operator')) {
            calculator.chooseOperation(button.dataset.action);
        } else if (button.classList.contains('equals')) {
            calculator.compute();
        } else if (button.dataset.action === 'clear') {
            calculator.clear();
        } else if (button.dataset.action === 'delete') {
            calculator.delete();
        } else if (button.dataset.action === 'percentage') {
            calculator.percentage();
        }
    });
});

document.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9 || e.key === '.') {
        calculator.appendNumber(e.key);
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculator.compute();
    }
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
    }
    if (e.key === '%') calculator.percentage();
});


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');

        if (isLight) {
            localStorage.setItem('fossarium-theme', 'light');
            if (icon) icon.setAttribute('name', 'moon-outline');
        } else {
            localStorage.setItem('fossarium-theme', 'dark');
            if (icon) icon.setAttribute('name', 'sunny-outline');
        }
    });
}

initTheme();

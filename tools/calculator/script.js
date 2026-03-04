class Calculator {
    constructor() {
        this.historyElem = document.getElementById('history');
        this.resultElem = document.getElementById('result');
        this.secondaryElem = document.getElementById('secondary-display');
        this.keypadElem = document.getElementById('keypad');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        this.currentMode = 'standard';
        this.clear();
        this.initEventListeners();
        this.setMode('standard');
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.statsData = [];
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand === "Error") return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') this.currentOperand = '0';
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
                this.currentOperand += number.toString();
            }
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === "Error") return;
        if (this.previousOperand !== '') this.compute();
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
            case '^': computation = Math.pow(prev, current); break;
            default: return;
        }

        this.currentOperand = (Math.round(computation * 1e10) / 1e10).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    scientific(func) {
        let val = parseFloat(this.currentOperand);
        let result;
        switch (func) {
            case 'sin': result = Math.sin(val * Math.PI / 180); break;
            case 'cos': result = Math.cos(val * Math.PI / 180); break;
            case 'tan': result = Math.tan(val * Math.PI / 180); break;
            case 'log': result = Math.log10(val); break;
            case 'ln': result = Math.log(val); break;
            case 'sqrt': result = Math.sqrt(val); break;
            case 'sq': result = val * val; break;
            case 'pi': result = Math.PI; break;
            case 'e': result = Math.E; break;
        }
        this.currentOperand = (Math.round(result * 1e10) / 1e10).toString();
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    programmer(action) {
        const val = parseInt(this.currentOperand);
        if (isNaN(val)) return;
        switch (action) {
            case 'hex': this.currentOperand = val.toString(16).toUpperCase(); break;
            case 'bin': this.currentOperand = val.toString(2); break;
            case 'oct': this.currentOperand = val.toString(8); break;
            case 'dec': this.currentOperand = val.toString(10); break;
        }
        this.updateDisplay();
    }

    stats(action) {
        const val = parseFloat(this.currentOperand);
        if (action === 'add') {
            if (!isNaN(val)) {
                this.statsData.push(val);
                this.currentOperand = '0';
                this.shouldResetScreen = true;
            }
        } else if (action === 'clear') {
            this.statsData = [];
        } else if (action === 'calc') {
            if (this.statsData.length === 0) return;
            const sum = this.statsData.reduce((a, b) => a + b, 0);
            const mean = sum / this.statsData.length;
            this.currentOperand = mean.toString();
            this.shouldResetScreen = true;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.currentMode === 'programmer') {
            this.resultElem.innerText = this.currentOperand;
            const decVal = parseInt(this.currentOperand, this.getBase());
            if (!isNaN(decVal)) {
                this.secondaryElem.classList.remove('hidden');
                this.secondaryElem.innerHTML = `
                    HEX: ${decVal.toString(16).toUpperCase()}<br>
                    DEC: ${decVal.toString(10)}<br>
                    OCT: ${decVal.toString(8)}<br>
                    BIN: ${decVal.toString(2)}
                `;
            }
        } else {
            this.resultElem.innerText = this.currentOperand;
            this.secondaryElem.classList.add('hidden');
        }

        if (this.operation) {
            this.historyElem.innerText = `${this.previousOperand} ${this.operation}`;
        } else if (this.currentMode === 'statistics') {
            this.historyElem.innerText = `[${this.statsData.join(', ')}]`;
        } else {
            this.historyElem.innerText = '';
        }
    }

    getBase() {
        // Dummy implementation for simple logic
        return 10;
    }

    setMode(mode) {
        this.currentMode = mode;
        document.body.className = `${mode}-mode`;
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.renderKeypad();
        this.clear();
    }

    renderKeypad() {
        const layouts = {
            standard: [
                ['AC', 'util', 'clear'], ['DEL', 'util', 'delete'], ['%', 'util', 'percentage'], ['/', 'op', '/'],
                ['7', 'num', '7'], ['8', 'num', '8'], ['9', 'num', '9'], ['*', 'op', '*'],
                ['4', 'num', '4'], ['5', 'num', '5'], ['6', 'num', '6'], ['-', 'op', '-'],
                ['1', 'num', '1'], ['2', 'num', '2'], ['3', 'num', '3'], ['+', 'op', '+'],
                ['0', 'num wide-btn', '0'], ['.', 'num', '.'], ['=', 'equal-btn', '=']
            ],
            scientific: [
                ['sin', 'util', 'sin'], ['cos', 'util', 'cos'], ['tan', 'util', 'tan'], ['sqrt', 'util', 'sqrt'], ['^', 'op', '^'], ['AC', 'util', 'clear'],
                ['log', 'util', 'log'], ['ln', 'util', 'ln'], ['x²', 'util', 'sq'], ['π', 'util', 'pi'], ['e', 'util', 'e'], ['DEL', 'util', 'delete'],
                ['7', 'num', '7'], ['8', 'num', '8'], ['9', 'num', '9'], ['(', 'util', '('], [')', 'util', ')'], ['/', 'op', '/'],
                ['4', 'num', '4'], ['5', 'num', '5'], ['6', 'num', '6'], ['*', 'op', '*'], ['%', 'util', 'percentage'], ['=', 'equal-btn', '='],
                ['1', 'num', '1'], ['2', 'num', '2'], ['3', 'num', '3'], ['-', 'op', '-'], ['0', 'num wide-btn', '0'], ['+', 'op', '+']
            ],
            programmer: [
                ['A', 'num', 'A'], ['B', 'num', 'B'], ['C', 'num', 'C'], ['DEL', 'util', 'delete'],
                ['D', 'num', 'D'], ['E', 'num', 'E'], ['F', 'num', 'F'], ['AC', 'util', 'clear'],
                ['7', 'num', '7'], ['8', 'num', '8'], ['9', 'num', '9'], ['/', 'op', '/'],
                ['4', 'num', '4'], ['5', 'num', '5'], ['6', 'num', '6'], ['*', 'op', '*'],
                ['1', 'num', '1'], ['2', 'num', '2'], ['3', 'num', '3'], ['-', 'op', '-'],
                ['0', 'num wide-btn', '0'], ['+', 'op', '+'], ['=', 'equal-btn', '=']
            ],
            statistics: [
                ['ADD', 'op', 'add'], ['MEAN', 'op', 'calc'], ['CLR Σ', 'util', 'clear-stats'], ['AC', 'util', 'clear'],
                ['7', 'num', '7'], ['8', 'num', '8'], ['9', 'num', '9'], ['DEL', 'util', 'delete'],
                ['4', 'num', '4'], ['5', 'num', '5'], ['6', 'num', '6'], ['/', 'op', '/'],
                ['1', 'num', '1'], ['2', 'num', '2'], ['3', 'num', '3'], ['*', 'op', '*'],
                ['0', 'num wide-btn', '0'], ['.', 'num', '.'], ['=', 'equal-btn', '=']
            ]
        };

        const currentLayout = layouts[this.currentMode];
        this.keypadElem.className = `keypad-container ${this.currentMode}-grid`;
        this.keypadElem.innerHTML = currentLayout.map(([label, type, action]) => `
            <button class="calc-btn ${type}" data-action="${action}">${label}</button>
        `).join('');

        this.keypadElem.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action, btn.classList));
        });
    }

    handleAction(action, classes) {
        if (classes.contains('num')) {
            this.appendNumber(action);
        } else if (classes.contains('op')) {
            if (this.currentMode === 'statistics') {
                this.stats(action);
            } else {
                this.chooseOperation(action);
            }
        } else if (classes.contains('equal-btn')) {
            this.compute();
        } else {
            // Utilities
            if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'sq', 'pi', 'e'].includes(action)) {
                this.scientific(action);
            } else if (action === 'clear') {
                this.clear();
            } else if (action === 'delete') {
                this.delete();
            } else if (action === 'percentage') {
                this.percentage();
            } else if (action === 'clear-stats') {
                this.stats('clear');
            }
        }
    }

    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        this.updateDisplay();
    }

    initEventListeners() {
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
        });

        document.addEventListener('keydown', e => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') this.appendNumber(e.key);
            if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); this.compute(); }
            if (e.key === 'Backspace') this.delete();
            if (e.key === 'Escape') this.clear();
            if (['+', '-', '*', '/'].includes(e.key)) this.chooseOperation(e.key);
        });
    }
}

// Theme Logic
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    
    const setDarkMode = () => {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    };
    const setLightMode = () => {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    };

    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        setLightMode();
    } else {
        setDarkMode();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            setDarkMode();
            localStorage.setItem('fossarium-theme', 'dark');
        } else {
            setLightMode();
            localStorage.setItem('fossarium-theme', 'light');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    new Calculator();
});

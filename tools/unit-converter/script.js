document.addEventListener('DOMContentLoaded', () => {
    const inputValue = document.getElementById('inputValue');
    const inputUnit = document.getElementById('inputUnit');
    const outputValue = document.getElementById('outputValue');
    const outputUnit = document.getElementById('outputUnit');

    function convertUnits() {
        const value = parseFloat(inputValue.value);
        const fromUnit = inputUnit.value;
        const toUnit = outputUnit.value;
        let result;

        if (isNaN(value)) {
            outputValue.textContent = 'Invalid Input';
            return;
        }

        // Convert input value to a base unit (e.g., meters)
        let baseValue;
        switch (fromUnit) {
            case 'meters':
                baseValue = value;
                break;
            case 'feet':
                baseValue = value * 0.3048; // 1 foot = 0.3048 meters
                break;
            case 'inches':
                baseValue = value * 0.0254; // 1 inch = 0.0254 meters
                break;
            default:
                baseValue = value;
        }

        // Convert from base unit to output unit
        switch (toUnit) {
            case 'meters':
                result = baseValue;
                break;
            case 'feet':
                result = baseValue / 0.3048;
                break;
            case 'inches':
                result = baseValue / 0.0254;
                break;
            default:
                result = baseValue;
        }

        outputValue.textContent = result.toFixed(2); // Display result with 2 decimal places
    }

    // Add event listeners for changes
    inputValue.addEventListener('input', convertUnits);
    inputUnit.addEventListener('change', convertUnits);
    outputUnit.addEventListener('change', convertUnits);

    // Initial conversion on page load
    convertUnits();
});
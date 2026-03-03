const unitData = {
    length: {
        units: {
            meters: { name: 'Meters (m)', factor: 1 },
            kilometers: { name: 'Kilometers (km)', factor: 1000 },
            centimeters: { name: 'Centimeters (cm)', factor: 0.01 },
            millimeters: { name: 'Millimeters (mm)', factor: 0.001 },
            microns: { name: 'Microns (μm)', factor: 1e-6 },
            nanometers: { name: 'Nanometers (nm)', factor: 1e-9 },
            angstrom: { name: 'Ångström (Å)', factor: 1e-10 },
            miles: { name: 'Miles (mi)', factor: 1609.34 },
            yards: { name: 'Yards (yd)', factor: 0.9144 },
            feet: { name: 'Feet (ft)', factor: 0.3048 },
            inches: { name: 'Inches (in)', factor: 0.0254 },
            nautical_miles: { name: 'Nautical Miles', factor: 1852 },
            light_years: { name: 'Light Years (ly)', factor: 9.461e+15 },
            parsecs: { name: 'Parsecs (pc)', factor: 3.086e+16 },
            astronomical_units: { name: 'Astronomical Units (AU)', factor: 1.496e+11 },
            fathoms: { name: 'Fathoms', factor: 1.8288 },
            chains: { name: 'Chains', factor: 20.1168 },
            rods: { name: 'Rods', factor: 5.0292 }
        },
        defaultFrom: 'meters',
        defaultTo: 'feet'
    },
    weight: {
        units: {
            kilograms: { name: 'Kilograms (kg)', factor: 1 },
            grams: { name: 'Grams (g)', factor: 0.001 },
            milligrams: { name: 'Milligrams (mg)', factor: 1e-6 },
            micrograms: { name: 'Micrograms (μg)', factor: 1e-9 },
            metric_tons: { name: 'Metric Tons (t)', factor: 1000 },
            pounds: { name: 'Pounds (lb)', factor: 0.453592 },
            ounces: { name: 'Ounces (oz)', factor: 0.0283495 },
            stones: { name: 'Stones (st)', factor: 6.35029 },
            carats: { name: 'Carats (ct)', factor: 0.0002 },
            grains: { name: 'Grains', factor: 0.0000647989 },
            short_tons: { name: 'Short Tons (US)', factor: 907.185 },
            imperial_tons: { name: 'Long Tons (UK)', factor: 1016.05 }
        },
        defaultFrom: 'kilograms',
        defaultTo: 'pounds'
    },
    temp: {
        units: {
            celsius: { name: 'Celsius (°C)' },
            fahrenheit: { name: 'Fahrenheit (°F)' },
            kelvin: { name: 'Kelvin (K)' },
            rankine: { name: 'Rankine (°R)' }
        },
        defaultFrom: 'celsius',
        defaultTo: 'fahrenheit',
        type: 'temp'
    },
    data: {
        units: {
            bits: { name: 'Bits (b)', factor: 1 / 8 },
            bytes: { name: 'Bytes (B)', factor: 1 },
            kilobytes: { name: 'Kilobytes (KB)', factor: 1024 },
            megabytes: { name: 'Megabytes (MB)', factor: 1024 ** 2 },
            gigabytes: { name: 'Gigabytes (GB)', factor: 1024 ** 3 },
            terabytes: { name: 'Terabytes (TB)', factor: 1024 ** 4 },
            petabytes: { name: 'Petabytes (PB)', factor: 1024 ** 5 },
            kibibytes: { name: 'Kibibytes (KiB)', factor: 1024 },
            mebibytes: { name: 'Mebibytes (MiB)', factor: 1024 ** 2 },
            gibibytes: { name: 'Gibibytes (GiB)', factor: 1024 ** 3 }
        },
        defaultFrom: 'megabytes',
        defaultTo: 'gigabytes'
    },
    speed: {
        units: {
            mps: { name: 'Meters/sec (m/s)', factor: 1 },
            kmh: { name: 'Kilometers/hour (km/h)', factor: 1 / 3.6 },
            mph: { name: 'Miles/hour (mph)', factor: 0.44704 },
            knots: { name: 'Knots (kn)', factor: 0.514444 },
            fps: { name: 'Feet/sec (ft/s)', factor: 0.3048 }
        },
        defaultFrom: 'kmh',
        defaultTo: 'mph'
    },
    volume: {
        units: {
            liters: { name: 'Liters (L)', factor: 1 },
            milliliters: { name: 'Milliliters (mL)', factor: 0.001 },
            cubic_meters: { name: 'Cubic Meters (m³)', factor: 1000 },
            cubic_cm: { name: 'Cubic Centimeters (cc)', factor: 0.001 },
            cubic_inches: { name: 'Cubic Inches (in³)', factor: 0.0163871 },
            cubic_feet: { name: 'Cubic Feet (ft³)', factor: 28.3168 },
            gallons: { name: 'US Gallons (gal)', factor: 3.78541 },
            quarts: { name: 'US Quarts (qt)', factor: 0.946353 },
            pints: { name: 'US Pints (pt)', factor: 0.473176 },
            cups: { name: 'US Cups', factor: 0.236588 },
            fluid_ounces: { name: 'US Fluid Ounces (fl oz)', factor: 0.0295735 },
            tablespoons: { name: 'Tablespoons (tbsp)', factor: 0.0147868 },
            teaspoons: { name: 'Teaspoons (tsp)', factor: 0.00492892 },
            imperial_gallons: { name: 'Imperial Gallons', factor: 4.54609 },
            bushels: { name: 'Bushels (US)', factor: 35.2391 }
        },
        defaultFrom: 'liters',
        defaultTo: 'gallons'
    },
    fuel: {
        units: {
            kml: { name: 'Kilometers per Liter (km/L)' },
            l100: { name: 'Liters per 100 km (L/100km)' },
            mpg_us: { name: 'Miles per Gallon (US)' },
            mpg_imp: { name: 'Miles per Gallon (Imp)' }
        },
        defaultFrom: 'l100',
        defaultTo: 'mpg_us',
        type: 'fuel'
    },
    time: {
        units: {
            seconds: { name: 'Seconds (s)', factor: 1 },
            minutes: { name: 'Minutes (min)', factor: 60 },
            hours: { name: 'Hours (h)', factor: 3600 },
            days: { name: 'Days (d)', factor: 86400 },
            weeks: { name: 'Weeks (wk)', factor: 604800 },
            months: { name: 'Months (avg)', factor: 2.628e+6 },
            years: { name: 'Years (yr)', factor: 3.1536e+7 },
            decades: { name: 'Decades', factor: 3.1536e+8 },
            centuries: { name: 'Centuries', factor: 3.1536e+9 },
            millennium: { name: 'Millennium', factor: 3.1536e+10 }
        },
        defaultFrom: 'hours',
        defaultTo: 'days'
    },
    energy: {
        units: {
            joules: { name: 'Joules (J)', factor: 1 },
            kilojoules: { name: 'Kilojoules (kJ)', factor: 1000 },
            calories: { name: 'Gram calories (cal)', factor: 4.184 },
            kilocalories: { name: 'Food calories (kcal)', factor: 4184 },
            watt_hours: { name: 'Watt-hours (Wh)', factor: 3600 },
            kilowatt_hours: { name: 'Kilowatt-hours (kWh)', factor: 3.6e+6 },
            electron_volts: { name: 'Electronvolts (eV)', factor: 1.60218e-19 },
            btu: { name: 'British Thermal Units (BTU)', factor: 1055.06 }
        },
        defaultFrom: 'kilocalories',
        defaultTo: 'kilojoules'
    },
    pressure: {
        units: {
            pascals: { name: 'Pascals (Pa)', factor: 1 },
            kilopascals: { name: 'Kilopascals (kPa)', factor: 1000 },
            bars: { name: 'Bars', factor: 100000 },
            atm: { name: 'Atmospheres (atm)', factor: 101325 },
            psi: { name: 'Pounds per sq inch (psi)', factor: 6894.76 },
            torr: { name: 'Torr (mmHg)', factor: 133.322 }
        },
        defaultFrom: 'bars',
        defaultTo: 'psi'
    },
    power: {
        units: {
            watts: { name: 'Watts (W)', factor: 1 },
            kilowatts: { name: 'Kilowatts (kW)', factor: 1000 },
            megawatts: { name: 'Megawatts (MW)', factor: 1e6 },
            horsepower: { name: 'Horsepower (hp)', factor: 745.7 }
        },
        defaultFrom: 'kilowatts',
        defaultTo: 'horsepower'
    },
    frequency: {
        units: {
            hertz: { name: 'Hertz (Hz)', factor: 1 },
            kilohertz: { name: 'Kilohertz (kHz)', factor: 1000 },
            megahertz: { name: 'Megahertz (MHz)', factor: 1e6 },
            gigahertz: { name: 'Gigahertz (GHz)', factor: 1e9 }
        },
        defaultFrom: 'megahertz',
        defaultTo: 'gigahertz'
    }
};

const categorySelect = document.getElementById('category-select'),
    input1 = document.getElementById('input1'),
    unit1 = document.getElementById('unit1'),
    input2 = document.getElementById('input2'),
    unit2 = document.getElementById('unit2'),
    formulaDisplay = document.getElementById('formula-display');

function populateUnits() {
    const data = unitData[categorySelect.value];
    unit1.innerHTML = '';
    unit2.innerHTML = '';
    
    Object.keys(data.units).forEach(key => {
        unit1.add(new Option(data.units[key].name, key));
        unit2.add(new Option(data.units[key].name, key));
    });

    unit1.value = data.defaultFrom;
    unit2.value = data.defaultTo;
}

function updateFormula() {
    const category = categorySelect.value;
    const data = unitData[category];
    const u1 = unit1.value;
    const u2 = unit2.value;
    const name1 = data.units[u1].name;
    const name2 = data.units[u2].name;

    let result;
    if (data.type === 'temp') {
        result = convertTemp(1, u1, u2);
    } else if (data.type === 'fuel') {
        result = convertFuel(1, u1, u2);
    } else {
        result = data.units[u1].factor / data.units[u2].factor;
    }

    const formattedResult = (Math.abs(result) < 0.000001 && result !== 0) 
        ? result.toExponential(6) 
        : parseFloat(result.toFixed(8));

    formulaDisplay.innerHTML = `Formula: 1 ${name1} = <span>${formattedResult} ${name2}</span>`;
}

function handleConversion(activeInput) {
    const category = categorySelect.value;
    const data = unitData[category];
    
    let val, from, to, target;
    if (activeInput === 1) {
        val = parseFloat(input1.value);
        from = unit1.value;
        to = unit2.value;
        target = input2;
    } else {
        val = parseFloat(input2.value);
        from = unit2.value;
        to = unit1.value;
        target = input1;
    }

    if (isNaN(val)) {
        target.value = '';
        return;
    }

    let result;
    if (data.type === 'temp') {
        result = convertTemp(val, from, to);
    } else if (data.type === 'fuel') {
        result = convertFuel(val, from, to);
    } else {
        const baseValue = val * data.units[from].factor;
        result = baseValue / data.units[to].factor;
    }

    if (Math.abs(result) < 0.000001 && result !== 0) {
        target.value = result.toExponential(6);
    } else {
        target.value = parseFloat(result.toFixed(8));
    }
    
    updateFormula();
}

function convertTemp(val, from, to) {
    let celsius;
    if (from === 'celsius') celsius = val;
    else if (from === 'fahrenheit') celsius = (val - 32) * 5 / 9;
    else if (from === 'kelvin') celsius = val - 273.15;
    else if (from === 'rankine') celsius = (val - 491.67) * 5 / 9;

    if (to === 'celsius') return celsius;
    if (to === 'fahrenheit') return (celsius * 9 / 5) + 32;
    if (to === 'kelvin') return celsius + 273.15;
    if (to === 'rankine') return (celsius + 273.15) * 9 / 5;
    return val;
}

function convertFuel(val, from, to) {
    let l100;
    if (from === 'l100') l100 = val;
    else if (from === 'kml') l100 = 100 / val;
    else if (from === 'mpg_us') l100 = 235.215 / val;
    else if (from === 'mpg_imp') l100 = 282.481 / val;

    if (to === 'l100') return l100;
    if (to === 'kml') return 100 / l100;
    if (to === 'mpg_us') return 235.215 / l100;
    if (to === 'mpg_imp') return 282.481 / l100;
    return val;
}

categorySelect.addEventListener('change', () => {
    populateUnits();
    handleConversion(1);
});

input1.addEventListener('input', () => handleConversion(1));
input2.addEventListener('input', () => handleConversion(2));
unit1.addEventListener('change', () => handleConversion(1));
unit2.addEventListener('change', () => handleConversion(1));

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });
}

initTheme();
populateUnits();
handleConversion(1);

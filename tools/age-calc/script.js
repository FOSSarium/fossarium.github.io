const dobInput = document.getElementById("dob");
const resultBox = document.getElementById("result");
const agePrimary = document.getElementById("age-primary");
const ageSecondary = document.getElementById("age-secondary");

dobInput.value = "2000-01-01";

function getZodiacSign(day, month) {
    const zodiacSigns = [
        { sign: "Capricorn", start: [1, 1], end: [1, 19] },
        { sign: "Aquarius", start: [1, 20], end: [2, 18] },
        { sign: "Pisces", start: [2, 19], end: [3, 20] },
        { sign: "Aries", start: [3, 21], end: [4, 19] },
        { sign: "Taurus", start: [4, 20], end: [5, 20] },
        { sign: "Gemini", start: [5, 21], end: [6, 20] },
        { sign: "Cancer", start: [6, 21], end: [7, 22] },
        { sign: "Leo", start: [7, 23], end: [8, 22] },
        { sign: "Virgo", start: [8, 23], end: [9, 22] },
        { sign: "Libra", start: [9, 23], end: [10, 22] },
        { sign: "Scorpio", start: [10, 23], end: [11, 21] },
        { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
        { sign: "Capricorn", start: [12, 22], end: [12, 31] }
    ];

    for (const zodiac of zodiacSigns) {
        if ((month === zodiac.start[0] && day >= zodiac.start[1]) || (month === zodiac.end[0] && day <= zodiac.end[1])) {
            return zodiac.sign;
        }
    }
    return "Unknown";
}

function calculateAge() {
    const birthDate = new Date(dobInput.value);
    if (isNaN(birthDate)) {
        resultBox.style.display = "none";
        return;
    }

    resultBox.style.display = "block";
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    agePrimary.innerHTML = `${years} <span style="font-size: 0.5em; color: var(--text-muted)">years</span> ${months} <span style="font-size: 0.5em; color: var(--text-muted)">months</span> ${days} <span style="font-size: 0.5em; color: var(--text-muted)">days</span>`;

    const totalDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    
    const birthDay = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
    const zodiacSign = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);

    const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

    ageSecondary.innerHTML = `
        <div>Born on: <span>${birthDay}</span></div>
        <div>Zodiac: <span>${zodiacSign}</span></div>
        <div>Next B-day: <span>${daysToBirthday} days</span></div>
        <div>Total Months: <span>${totalMonths.toLocaleString()}</span></div>
        <div>Total Weeks: <span>${totalWeeks.toLocaleString()}</span></div>
        <div>Total Days: <span>${totalDays.toLocaleString()}</span></div>
    `;
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('spectrum-theme');
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
            localStorage.setItem('spectrum-theme', 'light');
            if (icon) icon.setAttribute('name', 'moon-outline');
        } else {
            localStorage.setItem('spectrum-theme', 'dark');
            if (icon) icon.setAttribute('name', 'sunny-outline');
        }
    });
}

dobInput.addEventListener("input", calculateAge);
calculateAge();
initTheme();

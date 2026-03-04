const dobInput = document.getElementById("dob");
const mainAgeText = document.getElementById("main-age-text");
const nextBdayText = document.getElementById("next-bday-text");
const statZodiac = document.getElementById("stat-zodiac");
const statDay = document.getElementById("stat-day");
const statHearts = document.getElementById("stat-hearts");
const statOrbits = document.getElementById("stat-orbits");
const breakdownList = document.getElementById("breakdown-list");

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
    return "--";
}

function calculateAge() {
    const birthDate = new Date(dobInput.value);
    if (isNaN(birthDate)) return;

    const now = new Date();
    if (birthDate > now) {
        mainAgeText.textContent = "Future Born?";
        return;
    }

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Main display
    mainAgeText.innerHTML = `${years}y ${months}m ${days}d`;

    // Stats
    const totalDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    statZodiac.textContent = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);
    statDay.textContent = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Fun facts
    const avgHeartRate = 72; // bpm
    const estimatedHearts = totalMinutes * avgHeartRate;
    statHearts.textContent = formatNumber(estimatedHearts);
    statOrbits.textContent = years;

    // Next Birthday
    const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const diff = nextBirthday - now;
    const daysToBday = Math.ceil(diff / (1000 * 60 * 60 * 24));
    nextBdayText.textContent = daysToBday === 0 ? "Today is your birthday! 🎉" : `Next birthday in ${daysToBday} days`;

    // Breakdown
    const breakdownData = [
        { label: "Total Months", val: totalMonths },
        { label: "Total Weeks", val: totalWeeks },
        { label: "Total Days", val: totalDays },
        { label: "Total Hours", val: totalHours },
        { label: "Total Minutes", val: totalMinutes },
        { label: "Total Seconds", val: totalSeconds }
    ];

    breakdownList.innerHTML = breakdownData.map(item => `
        <div class="breakdown-item">
            <span class="br-label">${item.label}</span>
            <span class="br-val">${formatNumber(item.val)}</span>
        </div>
    `).join('');
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    return num.toLocaleString();
}

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

dobInput.addEventListener("input", calculateAge);
initTheme();
calculateAge();

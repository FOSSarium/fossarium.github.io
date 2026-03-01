let expenses=JSON.parse(localStorage.getItem("fossarium-expenses")||"[]");function save(){localStorage.setItem("fossarium-expenses",JSON.stringify(expenses));render();}function addExpense(){const desc=document.getElementById("desc").value,amt=parseFloat(document.getElementById("amount").value),cat=document.getElementById("cat").value;if(!desc||isNaN(amt))return;expenses.unshift({desc,amt,cat,date:new Date().toLocaleDateString()});document.getElementById("desc").value="";document.getElementById("amount").value="";save();}function render(){const total=expenses.reduce((s,e)=>s+e.amt,0);document.getElementById("summary").innerHTML=`<div><div class="sum-label">Total Expenses</div><div class="sum-val">\$${total.toFixed(2)}</div></div><div><div class="sum-label">Items</div><div class="sum-val">${expenses.length}</div></div>`;document.getElementById("list").innerHTML=expenses.map((e,i)=>`<div class="expense-item"><div><strong>${e.desc}</strong> <span class="expense-cat">${e.cat}</span></div><div class="expense-amt">\$${e.amt.toFixed(2)} <span class="del" onclick="expenses.splice(${i},1);save();">✕</span></div></div>`).join("");}render();


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

let data=JSON.parse(localStorage.getItem("fossarium-kanban")||'{"todo":["Plan project","Research tools"],"doing":["Build UI"],"done":["Setup repo"]}');function save(){localStorage.setItem("fossarium-kanban",JSON.stringify(data));render();}function render(){["todo","doing","done"].forEach(col=>{document.getElementById("col-"+col).innerHTML=data[col].map((task,i)=>{const cols=["todo","doing","done"],ci=cols.indexOf(col);return`<div class="card-item"><span>${task}</span><span>${ci<2?`<span class="move" onclick="moveCard('${col}',${i},'${cols[ci+1]}')">→</span>`:""}${ci>0?`<span class="move" onclick="moveCard('${col}',${i},'${cols[ci-1]}')">←</span>`:""}<span class="del" onclick="data['${col}'].splice(${i},1);save();">✕</span></span></div>`;}).join("");});}window.moveCard=function(from,idx,to){const task=data[from].splice(idx,1)[0];data[to].push(task);save();};document.querySelectorAll(".add-input").forEach(input=>{input.addEventListener("keydown",e=>{if(e.key==="Enter"&&input.value.trim()){data[input.dataset.col].push(input.value.trim());input.value="";save();}});});render();


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

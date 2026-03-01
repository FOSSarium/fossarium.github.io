function gen(){const c=parseInt(document.getElementById("cols").value),r=parseInt(document.getElementById("rows").value);const wrap=document.getElementById("table-wrap");let html="<table>";for(let i=0;i<=r;i++){html+="<tr>";for(let j=0;j<c;j++){html+=`<td><input data-r="${i}" data-c="${j}" value="${i===0?"Header "+(j+1):""}" oninput="toMd()"></td>`;}html+="</tr>";}html+="</table>";wrap.innerHTML=html;toMd();}window.toMd=function(){const inputs=document.querySelectorAll("#table-wrap input");const data={};inputs.forEach(inp=>{const r=inp.dataset.r,c=inp.dataset.c;if(!data[r])data[r]={};data[r][c]=inp.value;});const rows=Object.keys(data).sort((a,b)=>a-b);if(rows.length<1)return;const cols=Object.keys(data[rows[0]]).sort((a,b)=>a-b);let md="|"+cols.map(c=>data[rows[0]][c]||" ").join("|")+"|\n|"+cols.map(()=>"---").join("|")+"|\n";for(let i=1;i<rows.length;i++){md+="|"+cols.map(c=>data[rows[i]][c]||" ").join("|")+"|\n";}document.getElementById("output").value=md;};gen();


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

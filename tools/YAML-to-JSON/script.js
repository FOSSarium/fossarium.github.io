function parseYaml(yaml){const result={};const lines=yaml.split("\n");const stack=[{indent:-1,obj:result,key:null}];let currentArray=null;lines.forEach(line=>{if(!line.trim()||line.trim().startsWith("#"))return;const indent=line.search(/\S/);const content=line.trim();if(content.startsWith("- ")){const val=content.slice(2).trim();const parent=stack[stack.length-1];if(parent.key&&!Array.isArray(parent.obj[parent.key])){parent.obj[parent.key]=[];}if(parent.key)parent.obj[parent.key].push(isNaN(val)?val==="true"?true:val==="false"?false:val:Number(val));return;}if(content.includes(": ")){const[key,...rest]=content.split(": ");const val=rest.join(": ").trim();while(stack.length>1&&stack[stack.length-1].indent>=indent)stack.pop();const parent=stack[stack.length-1];if(val){parent.obj[key]=isNaN(val)?val==="true"?true:val==="false"?false:val.replace(/^["']|["']$/g,""):Number(val);}else{parent.obj[key]={};stack.push({indent,obj:parent.obj,key});}parent.key=key;}else if(content.endsWith(":")){const key=content.slice(0,-1);while(stack.length>1&&stack[stack.length-1].indent>=indent)stack.pop();const parent=stack[stack.length-1];parent.obj[key]={};stack.push({indent,obj:parent.obj[key],key:null});parent.key=key;}});return result;}document.getElementById("yaml").addEventListener("input",function(){try{const result=parseYaml(this.value);document.getElementById("json").value=JSON.stringify(result,null,2);}catch(e){document.getElementById("json").value="Error: "+e.message;}});document.getElementById("yaml").dispatchEvent(new Event("input"));


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

(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const gravityBtn = document.getElementById('gravity-btn');
    const countEl = document.getElementById('ball-count');
    const helpOverlay = document.getElementById('help-overlay');

    let balls = [], gravity = true, animationId;
    let draggedBall = null, isDragging = false;

    const COLORS = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#a55eea', '#00d2d3', '#ff6b81', '#26de81'];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
    }

    class Ball {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.radius = 15 + Math.random() * 20;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.mass = this.radius;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(this.x - this.radius/3, this.y - this.radius/3, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(0.3, this.color);
            grad.addColorStop(1, this.color);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        update(width, height) {
            if (isDragging && this === draggedBall) return;

            if (gravity) this.vy += 0.3;
            
            this.vx *= 0.99;
            this.vy *= 0.99;

            this.x += this.vx;
            this.y += this.vy;

            // Wall collisions
            if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -0.8; }
            if (this.x + this.radius > width) { this.x = width - this.radius; this.vx *= -0.8; }
            if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -0.8; }
            if (this.y + this.radius > height) {
                this.y = height - this.radius;
                this.vy *= -0.6;
                this.vx *= 0.95;
            }
        }
    }

    function checkCollision(b1, b2) {
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < b1.radius + b2.radius;
    }

    function resolveCollision(b1, b2) {
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) return;

        // Normalize
        const nx = dx / dist;
        const ny = dy / dist;

        // Relative velocity
        const dvx = b2.vx - b1.vx;
        const dvy = b2.vy - b1.vy;

        // Dot product
        const dvn = dvx * nx + dvy * ny;

        // Don't resolve if moving apart
        if (dvn > 0) return;

        // Impulse
        const restitution = 0.8;
        const impulse = -(1 + restitution) * dvn / (1/b1.mass + 1/b2.mass);

        b1.vx -= impulse * nx / b1.mass;
        b1.vy -= impulse * ny / b1.mass;
        b2.vx += impulse * nx / b2.mass;
        b2.vy += impulse * ny / b2.mass;

        // Separate balls
        const overlap = (b1.radius + b2.radius - dist) / 2;
        b1.x -= overlap * nx;
        b1.y -= overlap * ny;
        b2.x += overlap * nx;
        b2.y += overlap * ny;
    }

    function animate() {
        const width = canvas.width / 2;
        const height = canvas.height / 2;

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || 'rgba(22,27,34,0.4)';
        ctx.fillRect(0, 0, width, height);

        // Update and check collisions
        balls.forEach(ball => ball.update(width, height));

        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                if (checkCollision(balls[i], balls[j])) {
                    resolveCollision(balls[i], balls[j]);
                }
            }
        }

        // Draw
        balls.forEach(ball => ball.draw());
        countEl.textContent = balls.length;

        animationId = requestAnimationFrame(animate);
    }

    function addBall(x, y) {
        balls.push(new Ball(x || canvas.width/4 + Math.random() * canvas.width/2, y || canvas.height/4));
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX || (e.touches && e.touches[0].clientX);
        const cy = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (cx - rect.left) / rect.width * canvas.width / 2,
            y: (cy - rect.top) / rect.height * canvas.height / 2
        };
    }

    canvas.addEventListener('mousedown', e => {
        const pos = getMousePos(e);
        for (let ball of balls) {
            const dx = pos.x - ball.x;
            const dy = pos.y - ball.y;
            if (Math.sqrt(dx*dx + dy*dy) < ball.radius) {
                draggedBall = ball;
                isDragging = true;
                return;
            }
        }
        addBall(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', e => {
        if (isDragging && draggedBall) {
            const pos = getMousePos(e);
            draggedBall.x = pos.x;
            draggedBall.y = pos.y;
            draggedBall.vx = 0;
            draggedBall.vy = 0;
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        draggedBall = null;
    });

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const pos = getMousePos(e);
        for (let ball of balls) {
            const dx = pos.x - ball.x;
            const dy = pos.y - ball.y;
            if (Math.sqrt(dx*dx + dy*dy) < ball.radius) {
                draggedBall = ball;
                isDragging = true;
                return;
            }
        }
        addBall(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (isDragging && draggedBall) {
            const pos = getMousePos(e);
            draggedBall.x = pos.x;
            draggedBall.y = pos.y;
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
        draggedBall = null;
    });

    addBtn.addEventListener('click', () => {
        for (let i = 0; i < 3; i++) addBall();
    });

    clearBtn.addEventListener('click', () => { balls = []; });

    gravityBtn.addEventListener('click', () => {
        gravity = !gravity;
        gravityBtn.textContent = `Gravity: ${gravity ? 'ON' : 'OFF'}`;
        gravityBtn.classList.toggle('active', gravity);
    });

    // Help overlay
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');

    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        themeIcon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });

    window.addEventListener('resize', resize);
    resize();
    
    // Add initial balls
    for (let i = 0; i < 5; i++) addBall();
    animate();
})();

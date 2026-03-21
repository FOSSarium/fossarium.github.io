(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const speedEl = document.getElementById('speed');
    const startMsg = document.getElementById('start-msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const newBestMsg = document.getElementById('new-best-msg');

    // Canvas setup with proper scaling
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const GROUND_Y = 140;
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;

    // Game state
    let gameState = 'waiting'; // waiting, playing, gameover
    let score = 0;
    let highScore = parseInt(localStorage.getItem('fossarium-dino-best') || '0');
    let gameSpeed = 5;
    let frame = 0;
    let isNewBest = false;

    bestEl.textContent = highScore;

    // Dino object
    const dino = {
        x: 50,
        y: GROUND_Y,
        width: 28,
        height: 32,
        vy: 0,
        isJumping: false,
        isDucking: false,
        duckHeight: 18,
        runFrame: 0
    };

    // Game objects
    let obstacles = [];
    let clouds = [];
    let groundDecorations = [];
    let particles = [];

    // Colors
    function getColors() {
        const isLight = document.documentElement.classList.contains('light-theme');
        return {
            bg: isLight ? '#f0f4f8' : '#0a0e1a',
            ground: isLight ? '#1a1a2e' : '#e6edf3',
            groundDetail: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)',
            cloud: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)',
            cactus: '#2ed573',
            cactusDark: '#17a55a',
            bird: '#a55eea',
            birdDark: '#8854d0',
            star: '#ffd700'
        };
    }

    // Initialize game
    function init() {
        gameState = 'waiting';
        score = 0;
        gameSpeed = 5;
        frame = 0;
        obstacles = [];
        clouds = [];
        groundDecorations = [];
        particles = [];
        dino.y = GROUND_Y;
        dino.vy = 0;
        dino.isJumping = false;
        dino.isDucking = false;
        isNewBest = false;
        
        scoreEl.textContent = '0';
        speedEl.textContent = '1x';
        startMsg.classList.remove('hidden');
        gameoverOverlay.classList.add('hidden');
        
        // Initialize ground decorations
        for (let i = 0; i < 20; i++) {
            groundDecorations.push({
                x: Math.random() * canvas.width / 2,
                y: GROUND_Y + 5 + Math.random() * 10,
                width: 2 + Math.random() * 4,
                height: 1 + Math.random() * 2
            });
        }
        
        // Initialize clouds
        for (let i = 0; i < 3; i++) {
            clouds.push({
                x: 100 + i * 200,
                y: 20 + Math.random() * 40,
                width: 60 + Math.random() * 40
            });
        }
        
        draw();
    }

    // Spawn obstacle
    function spawnObstacle() {
        const type = Math.random() < 0.25 && score > 400 ? 'bird' : 'cactus';
        
        if (type === 'cactus') {
            const size = Math.random() < 0.5 ? 'small' : 'large';
            obstacles.push({
                type: 'cactus',
                x: canvas.width / 2 + 50,
                y: GROUND_Y + dino.height - (size === 'large' ? 38 : 24),
                width: size === 'large' ? 18 : 14,
                height: size === 'large' ? 38 : 24,
                color: getColors().cactus
            });
        } else {
            const height = Math.random() < 0.5 ? 'low' : 'high';
            obstacles.push({
                type: 'bird',
                x: canvas.width / 2 + 50,
                y: height === 'low' ? GROUND_Y + 10 : GROUND_Y - 15,
                width: 28,
                height: 16,
                wingFrame: 0
            });
        }
    }

    // Create particles
    function createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2 + Math.random() * 3;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color,
                size: 3 + Math.random() * 3
            });
        }
    }

    // Update particles
    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= 0.03;
        });
        particles = particles.filter(p => p.life > 0);
    }

    // Draw particles
    function drawParticles() {
        particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    // Draw dino
    function drawDino() {
        const colors = getColors();
        const h = dino.isDucking ? dino.duckHeight : dino.height;
        const w = dino.isDucking ? 40 : dino.width;
        const y = dino.isDucking ? GROUND_Y + dino.height - h : dino.y;
        
        // Body
        ctx.fillStyle = colors.cactus;
        ctx.fillRect(dino.x, y, w, h);
        
        // Head
        if (!dino.isDucking) {
            ctx.fillRect(dino.x + w - 8, y - 8, 16, 14);
            // Eye
            ctx.fillStyle = '#fff';
            ctx.fillRect(dino.x + w + 2, y - 5, 5, 5);
            ctx.fillStyle = '#111';
            ctx.fillRect(dino.x + w + 4, y - 3, 3, 3);
        } else {
            // Ducking head
            ctx.fillRect(dino.x + w, y + 2, 14, 10);
            ctx.fillStyle = '#fff';
            ctx.fillRect(dino.x + w + 8, y + 3, 4, 4);
        }
        
        // Legs animation
        const legOffset = Math.sin(frame * 0.3) * 4;
        if (!dino.isJumping) {
            ctx.fillStyle = colors.cactusDark;
            ctx.fillRect(dino.x + 6, y + h, 6, 5 + legOffset);
            ctx.fillRect(dino.x + w - 12, y + h, 6, 5 - legOffset);
        }
        
        // Tail
        ctx.fillRect(dino.x - 6, y + h - 12, 8, 6);
    }

    // Draw cactus
    function drawCactus(obs) {
        const colors = getColors();
        // Main stem
        ctx.fillStyle = colors.cactus;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        // Highlight
        ctx.fillStyle = colors.cactusDark;
        ctx.fillRect(obs.x + 3, obs.y, 3, obs.height);
        // Arms (only for large cacti)
        if (obs.height > 30) {
            ctx.fillRect(obs.x - 6, obs.y + 12, 6, 5);
            ctx.fillRect(obs.x - 6, obs.y + 8, 5, 10);
            ctx.fillRect(obs.x + obs.width, obs.y + 8, 6, 5);
            ctx.fillRect(obs.x + obs.width + 1, obs.y + 4, 5, 10);
        }
    }

    // Draw bird
    function drawBird(obs) {
        const colors = getColors();
        const wingY = Math.sin(frame * 0.5) * 8;
        
        // Body
        ctx.fillStyle = colors.bird;
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, obs.height/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wings
        ctx.fillStyle = colors.birdDark;
        ctx.beginPath();
        ctx.moveTo(obs.x + 10, obs.y + obs.height/2);
        ctx.lineTo(obs.x + 20, obs.y + obs.height/2 + wingY);
        ctx.lineTo(obs.x + 30, obs.y + obs.height/2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = colors.bird;
        ctx.beginPath();
        ctx.arc(obs.x + obs.width + 5, obs.y + obs.height/2 - 3, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width + 10, obs.y + obs.height/2 - 3);
        ctx.lineTo(obs.x + obs.width + 18, obs.y + obs.height/2);
        ctx.lineTo(obs.x + obs.width + 10, obs.y + obs.height/2 + 3);
        ctx.fill();
    }

    // Draw clouds
    function drawClouds() {
        const colors = getColors();
        ctx.fillStyle = colors.cloud;
        clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.width/3, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width/3, cloud.y - 5, cloud.width/4, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width/2, cloud.y, cloud.width/3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw ground
    function drawGround() {
        const colors = getColors();
        // Ground line
        ctx.strokeStyle = colors.ground;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y + dino.height);
        ctx.lineTo(canvas.width / 2, GROUND_Y + dino.height);
        ctx.stroke();
        
        // Ground decorations
        ctx.fillStyle = colors.groundDetail;
        groundDecorations.forEach(dec => {
            ctx.fillRect(dec.x, dec.y, dec.width, dec.height);
        });
    }

    // Main draw function
    function draw() {
        const colors = getColors();
        const width = canvas.width / 2;
        const height = canvas.height / 2;
        
        // Clear and background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        // Draw everything
        drawClouds();
        drawGround();
        
        // Draw obstacles
        obstacles.forEach(obs => {
            if (obs.type === 'cactus') {
                drawCactus(obs);
            } else {
                drawBird(obs);
            }
        });
        
        drawDino();
        drawParticles();
    }

    // Update game
    function update() {
        frame++;
        
        // Update score
        if (frame % 5 === 0) {
            score++;
            scoreEl.textContent = score;
        }
        
        // Increase speed
        if (frame % 500 === 0) {
            gameSpeed += 0.5;
            speedEl.textContent = (gameSpeed / 5).toFixed(1) + 'x';
        }
        
        // Update dino
        if (dino.isJumping) {
            dino.vy += GRAVITY;
            dino.y += dino.vy;
            if (dino.y >= GROUND_Y) {
                dino.y = GROUND_Y;
                dino.isJumping = false;
                dino.vy = 0;
                createParticles(dino.x + 14, dino.y + dino.height, getColors().cactus, 5);
            }
        }
        
        // Spawn obstacles
        const minGap = 200 + gameSpeed * 8; // Increased minimum gap for playability
        const lastObstacle = obstacles[obstacles.length - 1];
        if (!lastObstacle || (canvas.width / 2 - lastObstacle.x > minGap)) {
            if (Math.random() < 0.015 + (score / 80000)) {
                spawnObstacle();
            }
        }
        
        // Update obstacles
        obstacles.forEach(obs => {
            obs.x -= gameSpeed;
            if (obs.type === 'bird') {
                obs.wingFrame++;
            }
        });
        obstacles = obstacles.filter(obs => obs.x + obs.width > -50);
        
        // Update clouds
        clouds.forEach(cloud => {
            cloud.x -= gameSpeed * 0.2;
            if (cloud.x + cloud.width < -50) {
                cloud.x = canvas.width / 2 + 50;
                cloud.y = 20 + Math.random() * 40;
            }
        });
        
        // Update ground decorations
        groundDecorations.forEach(dec => {
            dec.x -= gameSpeed;
            if (dec.x + dec.width < -10) {
                dec.x = canvas.width / 2 + Math.random() * 100;
            }
        });
        
        updateParticles();

        // Collision detection
        const dinoH = dino.isDucking ? dino.duckHeight : dino.height;
        const dinoW = dino.isDucking ? 40 : dino.width;
        const dinoY = dino.isDucking ? GROUND_Y + dino.height - dinoH : dino.y;

        for (const obs of obstacles) {
            const padding = 6;
            if (dino.x + dinoW - padding > obs.x + padding &&
                dino.x + padding < obs.x + obs.width - padding &&
                dinoY + dinoH - padding > obs.y + padding &&
                dinoY + padding < obs.y + obs.height - padding) {
                gameOver();
                return;
            }
        }
        
        draw();
    }

    // Game loop
    let animationId;
    function gameLoop() {
        if (gameState === 'playing') {
            update();
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Start game
    function startGame() {
        if (gameState === 'playing') return;
        gameState = 'playing';
        startMsg.classList.add('hidden');
        gameLoop();
    }

    // Game over
    function gameOver() {
        gameState = 'gameover';
        cancelAnimationFrame(animationId);

        // Create explosion particles
        createParticles(dino.x + 14, dino.y + dino.height/2, getColors().cactus, 15);
        draw();
        
        // Check high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('fossarium-dino-best', highScore);
            bestEl.textContent = highScore;
            isNewBest = true;
            newBestMsg.style.display = 'block';
        } else {
            newBestMsg.style.display = 'none';
        }
        
        document.getElementById('final-score').textContent = score;
        gameoverOverlay.classList.remove('hidden');
    }

    // Jump
    function jump() {
        if (!dino.isJumping && gameState === 'playing') {
            dino.vy = JUMP_FORCE;
            dino.isJumping = true;
        } else if (gameState !== 'playing') {
            startGame();
        }
    }

    // Input handling
    function handleKeyDown(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (gameState === 'playing') {
                dino.isDucking = true;
            }
        }
    }

    function handleKeyUp(e) {
        if (e.code === 'ArrowDown') {
            dino.isDucking = false;
        }
    }

    // Touch/click handling
    function handleTouch() {
        if (gameState === 'playing') {
            jump();
        } else if (gameState !== 'gameover') {
            startGame();
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleTouch);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleTouch();
    });

    // Buttons
    document.getElementById('play-again-btn').addEventListener('click', init);
    document.getElementById('help-btn').addEventListener('click', () => {
        helpOverlay.classList.remove('hidden');
    });
    document.getElementById('close-help-btn').addEventListener('click', () => {
        helpOverlay.classList.add('hidden');
    });
    
    helpOverlay.addEventListener('click', e => {
        if (e.target === helpOverlay) helpOverlay.classList.add('hidden');
    });
    
    gameoverOverlay.addEventListener('click', e => {
        if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden');
    });

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

    // Initialize
    init();
})();

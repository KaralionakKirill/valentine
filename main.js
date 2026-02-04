/**
 * Valentine's Day Proposal Page Logic
 * Handles button interactions, confetti animation, and page navigation.
 */
// --- Confetti System ---
class Particle {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3; // Slightly faster for joy
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5; // Bigger confetti
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.005; // Longer life
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // Gravity
        this.vx *= 0.98; // Air resistance
        this.life -= this.decay;
        this.size *= 0.99; // Shrink slightly
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        // M3 Inspired Shapes: Soft rounded rectangles & Circles
        ctx.beginPath();
        if (Math.random() > 0.5) {
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        }
        else {
            // Rounded rect approximation
            ctx.roundRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size, 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}
class ConfettiSystem {
    constructor(canvasId) {
        this.particles = [];
        this.colors = ['#ff5f9e', '#FFD9E3', '#FFFBFC', '#9C404E', '#FFD700', '#FF69B4']; // Pink palette + Gold/HotPink
        this.isRunning = false;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas)
            return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        if (!this.canvas)
            return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    burst(x, y, count = 100) {
        if (!this.canvas)
            return;
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, this.colors));
        }
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }
    // Continuous soft rain from top
    rain(duration = 2000) {
        const end = Date.now() + duration;
        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }
            this.burst(Math.random() * this.canvas.width, -20, 5);
        }, 50);
    }
    loop() {
        if (this.particles.length === 0) {
            this.isRunning = false;
            if (this.ctx)
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        requestAnimationFrame(() => this.loop());
    }
}
// --- Main Interactions ---
document.addEventListener('DOMContentLoaded', () => {
    const confetti = new ConfettiSystem('confetti-canvas');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    // Check which page we are on
    if (window.location.pathname.includes('agree.html')) {
        // We are on the success page!
        // Launch celebration confetti
        confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 200);
        confetti.rain(3000); // 3 seconds of extra rain
    }
    else {
        // We are on the main page
        if (btnYes) {
            btnYes.addEventListener('click', (e) => {
                const rect = btnYes.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                // Big burst
                confetti.burst(centerX, centerY, 200);
                // Navigate after short delay to see the burst
                setTimeout(() => {
                    window.location.href = 'agree.html';
                }, 300);
            });
        }
        if (btnNo) {
            btnNo.addEventListener('click', (e) => {
                const rect = btnNo.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                confetti.burst(centerX, centerY, 30); // Small burst for effort
                moveButtonRandomly(btnNo);
            });
        }
    }
});
function moveButtonRandomly(btn) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = btn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    // Safety margin to prevent being exactly on edge
    const margin = 24;
    const maxLeft = viewportWidth - btnWidth - margin;
    const maxTop = viewportHeight - btnHeight - margin;
    const randomLeft = Math.max(margin, Math.random() * maxLeft);
    const randomTop = Math.max(margin, Math.random() * maxTop);
    btn.style.position = 'fixed';
    btn.style.left = `${randomLeft}px`;
    btn.style.top = `${randomTop}px`;
    // Ensure button stays interactive and visible
    btn.style.zIndex = '50';
}

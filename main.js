/**
 * Valentine's Day Proposal Page Logic
 * Handles button interactions and confetti animation.
 */
// --- Confetti System ---
class Particle {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2; // Initial upward burst
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.vx *= 0.99; // Air resistance
        this.life -= this.decay;
        // Spin effect simulation by changing size width slightly? 
        // Keep it simple for now.
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw heart shape or circle. Let's do circle for performance/simplicity or simple sqaure.
        // M3 loves shapes. Let's do rounded rects.
        ctx.roundRect(this.x, this.y, this.size, this.size, 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}
class ConfettiSystem {
    constructor(canvasId) {
        this.particles = [];
        this.colors = ['#B3261E', '#F9DEDC', '#FFDAD6', '#FFFBFE', '#775652']; // M3 Pallette from SCSS
        this.isRunning = false;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    burst(x, y, count = 100) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, this.colors));
        }
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }
    loop() {
        if (this.particles.length === 0) {
            this.isRunning = false;
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
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const confetti = new ConfettiSystem('confetti-canvas');
    // "Yes" Button Interaction
    btnYes.addEventListener('click', (e) => {
        // Trigger confetti from the center of the button
        const rect = btnYes.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        confetti.burst(centerX, centerY, 150);
        // Optional: Change text or behavior? The prompt doesn't specify actions after Yes, just confetti.
    });
    // "No" Button Interaction
    btnNo.addEventListener('click', (e) => {
        // 1. Trigger confetti (per prompt requirements)
        const rect = btnNo.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        confetti.burst(centerX, centerY, 50); // Smaller burst for No
        // 2. Move to random position
        moveButtonRandomly(btnNo);
    });
});
function moveButtonRandomly(btn) {
    // Determine viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    // Button dimensions (approximate if not yet measured, or getting live)
    const btnRect = btn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    // Safety margin to prevent being exactly on edge
    const margin = 16;
    // Calculate available range
    const maxLeft = viewportWidth - btnWidth - margin;
    const maxTop = viewportHeight - btnHeight - margin;
    const randomLeft = Math.max(margin, Math.random() * maxLeft);
    const randomTop = Math.max(margin, Math.random() * maxTop);
    // Apply Fixed Positioning to break out of layout flow
    // We use 'fixed' so it's relative to the viewport window
    btn.style.position = 'fixed';
    btn.style.left = `${randomLeft}px`;
    btn.style.top = `${randomTop}px`;
    // Ensure it's on top of card but below confetti
    btn.style.zIndex = '50';
}

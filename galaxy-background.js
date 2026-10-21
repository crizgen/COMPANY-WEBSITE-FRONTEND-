/**
 * GalaxyBackground Component
 * 
 * A lightweight, high-performance canvas galaxy background:
 * - Twinkling stars in 3 sizes (desktop: ~140-150, mobile: ~65-70)
 * - 4 slow-moving nebula clouds (indigo, purple, blue, hint of pink)
 * - Occasional shooting star every 6-10 seconds
 * - Dark mode: full cosmic galaxy
 * - Light mode: soft calm pastel gradient, no stars
 * - Pauses when tab is hidden or prefers-reduced-motion is active
 */
class GalaxyBackground {
  constructor(canvasId = 'galaxy-bg-canvas') {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);

    // If canvas doesn't exist in DOM, create and mount it at the root
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = this.canvasId;
      this.canvas.className = 'galaxy-bg-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(this.canvas);
    }

    // Guarantee full-page fixed background behind content regardless of cache
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.display = 'block';
    if (document.body) {
      document.body.style.backgroundColor = 'transparent';
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    if (!this.ctx) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.stars = [];
    this.nebulas = [];
    this.shootingStar = null;
    this.nextShootingStarTime = performance.now() + this.getRandomShootingInterval();

    this.animationFrameId = null;
    this.isRunning = false;
    this.reducedMotion = false;
    this.isDarkMode = true;

    this.handleResize = this.handleResize.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this);
    this.animate = this.animate.bind(this);

    this.init();
  }

  init() {
    this.checkReducedMotion();
    this.checkTheme();
    this.resize();
    this.initNebulas();
    this.initStars();

    // Event Listeners
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Observe theme attribute changes on documentElement
    this.themeObserver = new MutationObserver(this.handleThemeChange);
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Listen for reduced motion changes
    if (window.matchMedia) {
      this.motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (this.motionMediaQuery.addEventListener) {
        this.motionMediaQuery.addEventListener('change', this.handleReducedMotionChange);
      }
    }

    if (this.reducedMotion || !this.isDarkMode) {
      this.renderStatic();
    } else {
      this.start();
    }
  }

  getRandomShootingInterval() {
    // 6 to 10 seconds in milliseconds
    return 6000 + Math.random() * 4000;
  }

  checkReducedMotion() {
    if (window.matchMedia) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  checkTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    this.isDarkMode = currentTheme !== 'light';
  }

  handleThemeChange() {
    const previousTheme = this.isDarkMode;
    this.checkTheme();

    if (previousTheme !== this.isDarkMode) {
      if (!this.isDarkMode) {
        // Light mode: stop animation loop and render soft pastel gradient
        this.stop();
        this.renderStatic();
      } else {
        // Dark mode: restart animation loop if tab is active
        if (!this.reducedMotion && document.visibilityState !== 'hidden') {
          this.start();
        } else {
          this.renderStatic();
        }
      }
    }
  }

  handleReducedMotionChange(e) {
    this.reducedMotion = e.matches;
    if (this.reducedMotion) {
      this.stop();
      this.renderStatic();
    } else if (this.isDarkMode && document.visibilityState !== 'hidden') {
      this.start();
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else {
      if (this.isDarkMode && !this.reducedMotion) {
        this.nextShootingStarTime = performance.now() + this.getRandomShootingInterval();
        this.start();
      } else {
        this.renderStatic();
      }
    }
  }

  handleResize() {
    this.resize();
    this.initNebulas();
    this.initStars();
    if (this.reducedMotion || !this.isDarkMode) {
      this.renderStatic();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.display = 'block';

    if (document.body) {
      document.body.style.backgroundColor = 'transparent';
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  initNebulas() {
    const minDimension = Math.min(this.width, this.height);
    // 4 large, slow-drifting celestial nebula clouds
    this.nebulas = [
      {
        // 1. Electric Indigo
        baseX: this.width * 0.3,
        baseY: this.height * 0.28,
        radius: minDimension * 0.65,
        color: [99, 102, 241],
        opacity: 0.15,
        orbitX: minDimension * 0.12,
        orbitY: minDimension * 0.08,
        angle: 0.2,
        speed: 0.00028
      },
      {
        // 2. Cosmic Purple
        baseX: this.width * 0.72,
        baseY: this.height * 0.42,
        radius: minDimension * 0.58,
        color: [139, 92, 246],
        opacity: 0.13,
        orbitX: minDimension * 0.1,
        orbitY: minDimension * 0.12,
        angle: 2.1,
        speed: -0.00024
      },
      {
        // 3. Deep Celestial Blue
        baseX: this.width * 0.24,
        baseY: this.height * 0.76,
        radius: minDimension * 0.54,
        color: [14, 165, 233],
        opacity: 0.11,
        orbitX: minDimension * 0.14,
        orbitY: minDimension * 0.09,
        angle: 4.2,
        speed: 0.00022
      },
      {
        // 4. Subtle Hint of Pink / Rose
        baseX: this.width * 0.8,
        baseY: this.height * 0.78,
        radius: minDimension * 0.46,
        color: [236, 72, 153],
        opacity: 0.07,
        orbitX: minDimension * 0.09,
        orbitY: minDimension * 0.11,
        angle: 1.2,
        speed: -0.00019
      }
    ];
  }

  initStars() {
    // Desktop: ~145 stars, Mobile (<768px): ~68 stars
    const isMobile = this.width < 768;
    const targetCount = isMobile ? 68 : 145;
    this.stars = [];

    for (let i = 0; i < targetCount; i++) {
      const typeRand = Math.random();
      let sizeType = 1; // 1: small (60%), 2: medium (28%), 3: large (12%)
      let radius = 0.8;

      if (typeRand < 0.60) {
        sizeType = 1;
        radius = 0.65 + Math.random() * 0.45; // 0.65 - 1.1px
      } else if (typeRand < 0.88) {
        sizeType = 2;
        radius = 1.3 + Math.random() * 0.45;  // 1.3 - 1.75px
      } else {
        sizeType = 3;
        radius = 2.1 + Math.random() * 0.65;  // 2.1 - 2.75px
      }

      // Star hues: mostly pure white with subtle celestial cyan and lavender variations
      let color = '255, 255, 255';
      const colorRand = Math.random();
      if (colorRand < 0.22) {
        color = '210, 230, 255'; // Cool ice-blue white
      } else if (colorRand < 0.38) {
        color = '235, 222, 255'; // Soft lavender white
      }

      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: radius,
        sizeType: sizeType,
        color: color,
        baseAlpha: 0.3 + Math.random() * 0.5,
        twinkleSpeed: 0.012 + Math.random() * 0.026,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  triggerShootingStar() {
    // Spawns diagonally across the upper/middle sky
    const startX = Math.random() * (this.width * 0.7);
    const startY = Math.random() * (this.height * 0.4);
    const angle = (Math.PI / 4) + ((Math.random() - 0.5) * 0.25); // ~37° to 52°
    const speed = 14 + Math.random() * 6;
    const length = 120 + Math.random() * 60;
    const maxLife = 50 + Math.floor(Math.random() * 20); // ~0.8s to 1.1s

    this.shootingStar = {
      x: startX,
      y: startY,
      startX: startX,
      startY: startY,
      angle: angle,
      speed: speed,
      length: length,
      life: 0,
      maxLife: maxLife
    };
  }

  updateShootingStar() {
    if (!this.shootingStar) return;

    const star = this.shootingStar;
    star.life++;
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;

    if (star.life >= star.maxLife || star.x > this.width + 100 || star.y > this.height + 100) {
      this.shootingStar = null;
      this.nextShootingStarTime = performance.now() + this.getRandomShootingInterval();
    }
  }

  drawShootingStar() {
    if (!this.shootingStar) return;

    const star = this.shootingStar;
    // Fade in during first 20% of life, fade out over last 40%
    const progress = star.life / star.maxLife;
    let alpha = 1;
    if (progress < 0.2) {
      alpha = progress / 0.2;
    } else if (progress > 0.6) {
      alpha = (1 - progress) / 0.4;
    }
    alpha = Math.max(0, Math.min(1, alpha));

    const tailX = star.x - Math.cos(star.angle) * star.length;
    const tailY = star.y - Math.sin(star.angle) * star.length;

    // Gradient trail from head to tail
    const gradient = this.ctx.createLinearGradient(star.x, star.y, tailX, tailY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
    gradient.addColorStop(0.18, `rgba(165, 215, 255, ${alpha * 0.75})`);
    gradient.addColorStop(0.55, `rgba(99, 102, 241, ${alpha * 0.3})`);
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    this.ctx.save();
    this.ctx.lineWidth = 1.8;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(star.x, star.y);
    this.ctx.lineTo(tailX, tailY);
    this.ctx.stroke();

    // Glowing head point
    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, 1.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawLightModeGradient() {
    // Calm, elegant soft pastel gradient
    const grad = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.35, '#f1f5f9');
    grad.addColorStop(0.7, '#eef2ff');
    grad.addColorStop(1, '#f5f3ff');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Soft subtle pastel radial accent in top-left
    const radial = this.ctx.createRadialGradient(
      this.width * 0.25,
      this.height * 0.2,
      0,
      this.width * 0.25,
      this.height * 0.2,
      this.width * 0.55
    );
    radial.addColorStop(0, 'rgba(238, 242, 255, 0.8)');
    radial.addColorStop(1, 'rgba(248, 250, 252, 0)');
    this.ctx.fillStyle = radial;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawNebulas() {
    for (let i = 0; i < this.nebulas.length; i++) {
      const neb = this.nebulas[i];
      if (!this.reducedMotion) {
        neb.angle += neb.speed;
      }

      const currentX = neb.baseX + Math.cos(neb.angle) * neb.orbitX;
      const currentY = neb.baseY + Math.sin(neb.angle) * neb.orbitY;

      const [r, g, b] = neb.color;
      const grad = this.ctx.createRadialGradient(
        currentX,
        currentY,
        0,
        currentX,
        currentY,
        neb.radius
      );

      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${neb.opacity})`);
      grad.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, ${neb.opacity * 0.52})`);
      grad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${neb.opacity * 0.16})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  drawStars() {
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      let alpha = star.baseAlpha;
      if (!this.reducedMotion) {
        star.phase += star.twinkleSpeed;
        alpha = Math.max(0.12, Math.min(1.0, star.baseAlpha + Math.sin(star.phase) * 0.42));
      }

      if (star.sizeType === 3) {
        // Large star: with radiant soft glow
        const glowRadius = star.radius * 2.6;
        const glowGrad = this.ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          glowRadius
        );
        glowGrad.addColorStop(0, `rgba(${star.color}, ${alpha})`);
        glowGrad.addColorStop(0.35, `rgba(165, 180, 252, ${alpha * 0.45})`);
        glowGrad.addColorStop(1, 'rgba(165, 180, 252, 0)');

        this.ctx.fillStyle = glowGrad;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Bright white center core
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Small and medium stars
        this.ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  renderStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (!this.isDarkMode) {
      // Light Mode: Soft pastel gradient, no stars
      this.drawLightModeGradient();
    } else {
      // Dark Mode: Deep space background + static nebulas + static stars
      this.ctx.fillStyle = '#090d16';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.drawNebulas();
      this.drawStars();
    }
  }

  animate(now) {
    if (!this.isRunning) return;

    // Check if time for occasional shooting star (every 6-10 seconds)
    if (!this.shootingStar && now >= this.nextShootingStarTime) {
      this.triggerShootingStar();
    }

    // Clear frame
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Deep cosmic space canvas fill
    this.ctx.fillStyle = '#090d16';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Drifting Nebulas
    this.drawNebulas();

    // 2. Twinkling Stars
    this.drawStars();

    // 3. Occasional Shooting Star
    if (this.shootingStar) {
      this.updateShootingStar();
      this.drawShootingStar();
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
    if (this.motionMediaQuery && this.motionMediaQuery.removeEventListener) {
      this.motionMediaQuery.removeEventListener('change', this.handleReducedMotionChange);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Auto-initialize component when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.galaxyBackground = new GalaxyBackground('galaxy-bg-canvas');
  });
} else {
  window.galaxyBackground = new GalaxyBackground('galaxy-bg-canvas');
}

export interface ParticleFieldBurst {
	x: number;
	y: number;
	strength?: number;
}

export interface ParticleFieldOptions {
	reducedMotion: boolean;
	mobile: boolean;
}

type ParticleLayer = 'back' | 'mid' | 'front';

type Particle = {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
	layer: ParticleLayer;
	color: string;
	seed: number;
	trail: Array<{ x: number; y: number }>;
};

const PARTICLE_COLORS = ['#00d1ff', '#5b21b6', '#2dd4bf', '#facc15'];

export class RankupParticleField {
	private readonly canvas: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;
	private readonly reducedMotion: boolean;
	private readonly mobile: boolean;
	private readonly particles: Particle[] = [];
	private rafId: number | null = null;
	private width = 0;
	private height = 0;
	private scrollProgress = 0;
	private scrollVelocity = 0;
	private previousScrollProgress = 0;
	private previousScrollSampleTime = performance.now();
	private attractorTarget: { x: number; y: number } | null = null;
	private attractorCurrent: { x: number; y: number } | null = null;
	private previousFrameTime = 0;

	constructor(canvas: HTMLCanvasElement, options: ParticleFieldOptions) {
		const context = canvas.getContext('2d');
		if (!context) {
			throw new Error('2D canvas context is required for RankupParticleField.');
		}
		this.canvas = canvas;
		this.context = context;
		this.reducedMotion = options.reducedMotion;
		this.mobile = options.mobile;
		this.resize();
		this.seedParticles(this.mobile ? 120 : 520);
		if (this.reducedMotion) {
			this.render(0);
			return;
		}
		this.start();
	}

	public resize(): void {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
		this.canvas.width = Math.floor(this.width * ratio);
		this.canvas.height = Math.floor(this.height * ratio);
		this.canvas.style.width = `${this.width}px`;
		this.canvas.style.height = `${this.height}px`;
		this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
	}

	public setScrollProgress(progress: number): void {
		const clamped = Math.max(0, Math.min(1, progress));
		const now = performance.now();
		const deltaTime = Math.max(16, now - this.previousScrollSampleTime);
		const deltaProgress = clamped - this.previousScrollProgress;
		const velocity = deltaProgress / deltaTime;
		this.scrollVelocity = this.scrollVelocity * 0.78 + velocity * 0.22;
		this.previousScrollProgress = clamped;
		this.previousScrollSampleTime = now;
		this.scrollProgress = clamped;
	}

	public setAttractor(x: number, y: number): void {
		if (this.reducedMotion) {
			return;
		}
		this.attractorTarget = { x, y };
		if (!this.attractorCurrent) {
			this.attractorCurrent = { x, y };
		}
	}

	public clearAttractor(): void {
		this.attractorTarget = null;
	}

	public triggerBurst(burst: ParticleFieldBurst): void {
		if (this.reducedMotion) {
			return;
		}
		const strength = burst.strength ?? 5.2;
		const affected = this.mobile ? 18 : 58;
		for (let index = 0; index < affected; index += 1) {
			const particle = this.particles[Math.floor(Math.random() * this.particles.length)];
			const angle = Math.random() * Math.PI * 2;
			const layerMultiplier = particle.layer === 'front' ? 1.4 : particle.layer === 'mid' ? 1.1 : 0.85;
			const speed = (Math.random() * strength + 1.4) * layerMultiplier;
			particle.x = burst.x + (Math.random() - 0.5) * 36;
			particle.y = burst.y + (Math.random() - 0.5) * 36;
			particle.vx = Math.cos(angle) * speed;
			particle.vy = Math.sin(angle) * speed;
			particle.alpha = Math.min(1, particle.alpha + 0.16);
		}
	}

	public dispose(): void {
		if (this.rafId !== null) {
			window.cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	private seedParticles(count: number): void {
		this.particles.length = 0;
		for (let index = 0; index < count; index += 1) {
			const layer = this.resolveLayer(index, count);
			const sizeBase = layer === 'front' ? 2.2 : layer === 'mid' ? 1.6 : 1.1;
			const alphaBase = layer === 'front' ? 0.58 : layer === 'mid' ? 0.43 : 0.28;
			const trailLength = layer === 'front' ? 7 : layer === 'mid' ? 5 : 3;
			this.particles.push({
				id: index,
				x: Math.random() * this.width,
				y: Math.random() * this.height,
				vx: (Math.random() - 0.5) * (layer === 'front' ? 0.95 : layer === 'mid' ? 0.7 : 0.45),
				vy: (Math.random() - 0.5) * (layer === 'front' ? 0.95 : layer === 'mid' ? 0.7 : 0.45),
				size: Math.random() * 1.4 + sizeBase,
				alpha: Math.random() * 0.25 + alphaBase,
				layer,
				color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
				seed: Math.random() * Math.PI * 2,
				trail: Array.from({ length: trailLength }, () => ({ x: 0, y: 0 })),
			});
		}
	}

	private resolveLayer(index: number, count: number): ParticleLayer {
		const ratio = index / count;
		if (ratio > 0.7) {
			return 'front';
		}
		if (ratio > 0.35) {
			return 'mid';
		}
		return 'back';
	}

	private start(): void {
		const step = (timestamp: number) => {
			const frameBudget = this.mobile ? 1000 / 24 : 1000 / 60;
			if (!this.previousFrameTime) {
				this.previousFrameTime = timestamp;
			}
			const elapsed = timestamp - this.previousFrameTime;
			if (elapsed >= frameBudget) {
				this.previousFrameTime = timestamp;
				this.update(timestamp, elapsed);
				this.render(timestamp);
			}
			this.rafId = window.requestAnimationFrame(step);
		};
		this.rafId = window.requestAnimationFrame(step);
	}

	private update(timestamp: number, elapsed: number): void {
		const scrollBoost = 1 + Math.min(2.4, Math.abs(this.scrollVelocity) * 920);
		const depthBoost = 0.45 + this.scrollProgress * 1.75;
		if (this.attractorTarget && this.attractorCurrent) {
			this.attractorCurrent.x += (this.attractorTarget.x - this.attractorCurrent.x) * 0.18;
			this.attractorCurrent.y += (this.attractorTarget.y - this.attractorCurrent.y) * 0.18;
		} else if (this.attractorCurrent) {
			this.attractorCurrent = {
				x: this.attractorCurrent.x + (this.width * 0.5 - this.attractorCurrent.x) * 0.035,
				y: this.attractorCurrent.y + (this.height * 0.6 - this.attractorCurrent.y) * 0.035,
			};
		}
		for (const particle of this.particles) {
			const drift = Math.sin(timestamp * 0.00045 + particle.seed) * 0.06;
			const turbulence = Math.cos(timestamp * 0.00037 + particle.seed * 1.2) * 0.05;
			const layerSpeed = particle.layer === 'front' ? 1.25 : particle.layer === 'mid' ? 0.92 : 0.68;
			particle.vx += drift * layerSpeed;
			particle.vy += turbulence * layerSpeed;
			if (this.attractorCurrent) {
				const dx = this.attractorCurrent.x - particle.x;
				const dy = this.attractorCurrent.y - particle.y;
				const distance = Math.max(24, Math.hypot(dx, dy));
				const pull = particle.layer === 'front' ? 0.068 : particle.layer === 'mid' ? 0.052 : 0.038;
				particle.vx += (dx / distance) * pull;
				particle.vy += (dy / distance) * pull;
			}
			particle.vx *= 0.982;
			particle.vy *= 0.982;
			particle.x += particle.vx * scrollBoost * layerSpeed;
			particle.y += particle.vy * depthBoost * layerSpeed;
			this.pushTrailPoint(particle);
			this.wrap(particle);
			const alphaPulse = 0.08 * Math.sin(timestamp * 0.001 + particle.seed * 2);
			particle.alpha = Math.max(0.12, Math.min(0.95, particle.alpha + alphaPulse * (elapsed / 16)));
		}
	}

	private pushTrailPoint(particle: Particle): void {
		particle.trail.unshift({ x: particle.x, y: particle.y });
		if (particle.trail.length > (particle.layer === 'front' ? 7 : particle.layer === 'mid' ? 5 : 3)) {
			particle.trail.pop();
		}
	}

	private wrap(particle: Particle): void {
		if (particle.x < -44) {
			particle.x = this.width + 44;
		}
		if (particle.x > this.width + 44) {
			particle.x = -44;
		}
		if (particle.y < -44) {
			particle.y = this.height + 44;
		}
		if (particle.y > this.height + 44) {
			particle.y = -44;
		}
	}

	private render(timestamp: number): void {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.save();
		this.context.globalCompositeOperation = 'lighter';
		for (const particle of this.particles) {
			this.renderTrail(particle);
			const pulse = 0.18 * Math.sin(timestamp * 0.0024 + particle.seed * 1.8);
			const size = Math.max(0.5, particle.size + pulse);
			this.context.beginPath();
			this.context.fillStyle = this.hexToRgba(particle.color, particle.alpha);
			this.context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
			this.context.fill();
		}
		this.context.restore();
	}

	private renderTrail(particle: Particle): void {
		if (particle.trail.length < 2) {
			return;
		}
		this.context.beginPath();
		for (let index = 0; index < particle.trail.length; index += 1) {
			const point = particle.trail[index];
			if (index === 0) {
				this.context.moveTo(point.x, point.y);
				continue;
			}
			this.context.lineTo(point.x, point.y);
		}
		const trailOpacity = particle.layer === 'front' ? 0.22 : particle.layer === 'mid' ? 0.15 : 0.09;
		this.context.strokeStyle = this.hexToRgba(particle.color, trailOpacity);
		this.context.lineWidth = particle.layer === 'front' ? 1.8 : particle.layer === 'mid' ? 1.2 : 0.8;
		this.context.stroke();
	}

	private hexToRgba(hex: string, alpha: number): string {
		const clean = hex.replace('#', '');
		const bigint = Number.parseInt(clean, 16);
		const red = (bigint >> 16) & 255;
		const green = (bigint >> 8) & 255;
		const blue = bigint & 255;
		return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
	}
}

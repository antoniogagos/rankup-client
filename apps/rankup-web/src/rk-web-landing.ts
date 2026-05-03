import { type LandingLocale,buildLocalizedPath, resolveLandingLocale } from './localization.js';
import { RankupParticleField } from './particle-field.js';
import { msg } from '@lit/localize';
import { gsap } from 'gsap';
import { CustomEase, Flip, ScrollTrigger } from 'gsap/all';
import { css, html,LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

type RankingMovement = 'up' | 'down' | 'same';

type RankingRow = {
	id: string;
	name: string;
	points: number;
	movement: RankingMovement;
	isMe?: boolean;
};

type WrappedSlide = {
	title: string;
	value: string;
	emoji: string;
};

type EventCardModel = {
	title: string;
	players: number;
	ctaLabel: string;
};

const HERO_INITIAL_RANKING: RankingRow[] = [
	{ id: 'maria', name: 'María G.', points: 61, movement: 'same' },
	{ id: 'carlos', name: 'Carlos R.', points: 58, movement: 'same' },
	{ id: 'you', name: 'Tú', points: 56, movement: 'same', isMe: true },
	{ id: 'pablo', name: 'Pablo M.', points: 52, movement: 'same' },
	{ id: 'laura', name: 'Laura S.', points: 49, movement: 'same' },
];

const LIVE_INITIAL_RANKING: RankingRow[] = [
	{ id: 'maria', name: 'María G.', points: 22, movement: 'same' },
	{ id: 'carlos', name: 'Carlos R.', points: 20, movement: 'same' },
	{ id: 'you', name: 'Tú', points: 19, movement: 'same', isMe: true },
	{ id: 'pablo', name: 'Pablo M.', points: 17, movement: 'same' },
	{ id: 'laura', name: 'Laura S.', points: 14, movement: 'same' },
];

const HERO_EVENT_TEXT_ES = ['GOAL 14\' Mbappé', 'GOAL 23\' Bellingham', 'GOAL 41\' Rodrygo', 'GOAL 67\' Vinicius'];
const HERO_EVENT_TEXT_EN = ['GOAL 14\' Mbappé', 'GOAL 23\' Bellingham', 'GOAL 41\' Rodrygo', 'GOAL 67\' Vinicius'];
const LIVE_SCORERS = ['Vinicius Jr.', 'Lewandowski', 'Rodrygo', 'Gündogan', 'Bellingham'];

/**
 * @element rk-web-landing
 */
@customElement('rk-web-landing')
export class RkWebLanding extends LitElement {
	public static override styles = css`
	:host {
		--rk-bg: #02050e;
		--rk-bg-alt: #07152c;
		--rk-surface: rgba(10, 22, 44, 0.78);
		--rk-surface-strong: rgba(9, 25, 52, 0.92);
		--rk-surface-soft: rgba(8, 16, 32, 0.6);
		--rk-line: rgba(102, 163, 255, 0.32);
		--rk-text: #f4f8ff;
		--rk-text-soft: rgba(223, 233, 251, 0.84);
		--rk-accent: #00d9ff;
		--rk-accent-alt: #3c5cff;
		--rk-gold: #ffca3a;
		--rk-win: #42ff9d;
		--rk-loss: #ff6f91;
		display: block;
		position: relative;
		min-height: 100vh;
		color: var(--rk-text);
		font-family: 'Rajdhani', sans-serif;
		background: radial-gradient(circle at 50% -20%, rgba(0, 217, 255, 0.2), transparent 48%), radial-gradient(circle at 80% 0%, rgba(60, 92, 255, 0.22), transparent 44%), linear-gradient(180deg, #02050e 0%, #030817 48%, #02050e 100%);
		overflow-x: clip;
	}

	* {
		box-sizing: border-box;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	canvas[data-role='particle-field'] {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		opacity: 0.95;
		will-change: transform;
	}

	.preloader {
		position: fixed;
		inset: 0;
		z-index: 28;
		display: grid;
		place-items: center;
		background: #00040d;
		opacity: 0;
		pointer-events: none;
		transition: opacity 220ms ease;
	}

	.preloader--visible {
		opacity: 1;
		pointer-events: auto;
	}

	.preloader::before,
	.preloader::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(120deg, transparent 20%, rgba(0, 217, 255, 0.2) 50%, transparent 80%);
		mix-blend-mode: screen;
		animation: preloader-scan 880ms ease-in-out infinite;
	}

	.preloader::after {
		animation-delay: 160ms;
		opacity: 0.55;
	}

	.preloader__logo {
		position: relative;
		z-index: 2;
		font-family: 'Teko', sans-serif;
		font-size: clamp(4rem, 13vw, 11rem);
		line-height: 0.95;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #ecf5ff;
		text-shadow: 0 0 28px rgba(0, 217, 255, 0.45);
		animation: preloader-glitch 900ms linear infinite;
	}

	.preloader__sub {
		margin-top: 0.4rem;
		font-size: 1.2rem;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: rgba(200, 221, 252, 0.88);
		text-align: center;
	}

	@keyframes preloader-scan {
		0% {
			transform: translateX(-14%);
			opacity: 0;
		}
		40% {
			opacity: 0.8;
		}
		100% {
			transform: translateX(14%);
			opacity: 0;
		}
	}

	@keyframes preloader-glitch {
		0%,
		100% {
			text-shadow: 1px 0 rgba(0, 217, 255, 0.7), -1px 0 rgba(255, 202, 58, 0.4);
		}
		25% {
			text-shadow: -1px 0 rgba(0, 217, 255, 0.8), 1px 0 rgba(255, 202, 58, 0.3);
		}
		50% {
			text-shadow: 2px 0 rgba(0, 217, 255, 0.65), -2px 0 rgba(255, 202, 58, 0.2);
		}
		75% {
			text-shadow: -2px 0 rgba(0, 217, 255, 0.6), 2px 0 rgba(255, 202, 58, 0.2);
		}
	}

	.site {
		position: relative;
		z-index: 3;
	}

	.site::before {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: -1;
		background-image: linear-gradient(rgba(26, 54, 106, 0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 54, 106, 0.13) 1px, transparent 1px);
		background-size: 68px 68px;
		opacity: 0.38;
	}

	.layout {
		max-width: 1220px;
		margin: 0 auto;
		padding: 0 2rem 8.5rem;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 14;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.2rem 0;
		background: linear-gradient(180deg, rgba(1, 8, 19, 0.94), rgba(1, 8, 19, 0.42));
		backdrop-filter: blur(14px);
		border-bottom: 1px solid rgba(111, 160, 255, 0.2);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		font-family: 'Teko', sans-serif;
		font-size: clamp(2.1rem, 2.8vw, 2.6rem);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.brand__dot {
		display: inline-block;
		width: 0.82rem;
		height: 0.82rem;
		border-radius: 50%;
		background: radial-gradient(circle, #8cf8ff, #00d9ff 50%, #2054ff);
		box-shadow: 0 0 14px rgba(0, 217, 255, 0.8);
	}

	.header-actions {
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
	}

	.button,
	.locale-btn,
	.header-signin,
	.footer-cta,
	.sticky-cta__button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.72rem 1.3rem;
		border-radius: 999px;
		border: 1px solid rgba(132, 167, 246, 0.35);
		background: rgba(12, 27, 56, 0.68);
		color: var(--rk-text);
		font-size: 1.18rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.03em;
		cursor: pointer;
		transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
	}

	.button:hover,
	.locale-btn:hover,
	.header-signin:hover,
	.footer-cta:hover,
	.sticky-cta__button:hover {
		transform: translateY(-1px);
		border-color: rgba(146, 190, 255, 0.64);
		box-shadow: 0 0 0 1px rgba(146, 190, 255, 0.22) inset;
	}

	.button--primary,
	.footer-cta,
	.sticky-cta__button {
		background: linear-gradient(110deg, #17f2ff 0%, #40b7ff 50%, #4a52ff 100%);
		border-color: transparent;
		color: #001428;
		box-shadow: 0 12px 34px rgba(16, 186, 255, 0.38);
	}

	.button--secondary {
		background: rgba(7, 21, 45, 0.62);
		color: #d9e9ff;
	}

	.hero {
		position: relative;
		padding: 2.5rem 0 4.8rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(310px, 420px);
		gap: 2.2rem;
		align-items: stretch;
	}

	.hero-copy,
	.hero-hud {
		position: relative;
		padding: 1.7rem;
		border-radius: 1.4rem;
		border: 1px solid rgba(123, 167, 248, 0.35);
		background: linear-gradient(140deg, rgba(9, 24, 49, 0.92), rgba(7, 15, 32, 0.85));
		box-shadow: 0 20px 56px rgba(0, 0, 0, 0.34), inset 0 0 0 1px rgba(151, 188, 255, 0.08);
		overflow: hidden;
	}

	.hero-copy::after,
	.hero-hud::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(120deg, transparent 35%, rgba(11, 219, 255, 0.08), transparent 62%);
		mix-blend-mode: screen;
	}

	.hero__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.95rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: #85e6ff;
		margin-bottom: 1rem;
	}

	.hero__eyebrow::before {
		content: '';
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: var(--rk-win);
		box-shadow: 0 0 12px rgba(66, 255, 157, 0.7);
	}

	.hero__headline {
		margin: 0;
		font-family: 'Teko', sans-serif;
		font-size: clamp(3rem, 7.8vw, 6.2rem);
		line-height: 0.9;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		text-wrap: balance;
	}

	.hero__word {
		display: inline-block;
		margin-right: 0.22ch;
		will-change: transform, opacity;
	}

	.hero__subheadline {
		margin: 1.1rem 0 1.6rem;
		font-size: clamp(1.34rem, 2vw, 1.62rem);
		line-height: 1.35;
		color: var(--rk-text-soft);
		max-width: 38ch;
	}

	.hero__ctas {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.76rem;
	}

	.hero__badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 1.3rem;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.48rem 0.84rem;
		border-radius: 999px;
		background: rgba(5, 16, 36, 0.74);
		border: 1px solid rgba(122, 165, 246, 0.27);
		font-size: 1.01rem;
		color: rgba(227, 238, 255, 0.92);
	}

	.hero__disclaimer {
		margin-top: 0.98rem;
		font-size: 1.04rem;
		font-weight: 700;
		color: #d8ebff;
	}

	.scroll-hint {
		display: inline-flex;
		align-items: center;
		gap: 0.42rem;
		margin-top: 1.1rem;
		font-size: 0.88rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(150, 201, 255, 0.86);
	}

	.hero-hud {
		display: grid;
		grid-template-rows: auto auto 1fr;
		gap: 0.9rem;
	}

	.hero-hud__title {
		font-size: 0.96rem;
		letter-spacing: 0.21em;
		text-transform: uppercase;
		color: #9ce8ff;
	}

	.hero-hud__score {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.8rem;
		padding: 0.72rem 0.8rem;
		border-radius: 0.9rem;
		background: rgba(5, 15, 30, 0.85);
		border: 1px solid rgba(113, 159, 255, 0.31);
		font-family: 'Teko', sans-serif;
		font-size: 1.52rem;
		letter-spacing: 0.05em;
	}

	.hero-hud__score span:nth-child(2) {
		font-size: 2.08rem;
		color: #f6fbff;
	}

	.hero-hud__event {
		font-size: 0.98rem;
		color: #ffd769;
	}

	.ranking-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.52rem;
	}

	.ranking-row {
		display: grid;
		grid-template-columns: 2rem 1fr auto;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 0.72rem;
		border-radius: 0.82rem;
		background: rgba(4, 12, 25, 0.82);
		border: 1px solid rgba(107, 144, 225, 0.19);
		font-size: 1.08rem;
		will-change: transform;
	}

	.ranking-row--me {
		background: linear-gradient(130deg, rgba(8, 34, 61, 0.92), rgba(5, 20, 42, 0.92));
		border-color: rgba(45, 212, 191, 0.48);
		box-shadow: inset 0 0 0 1px rgba(45, 212, 191, 0.2);
	}

	.movement {
		font-weight: 700;
		display: inline-flex;
		min-width: 1ch;
	}

	.movement--up {
		color: var(--rk-win);
	}

	.movement--down {
		color: var(--rk-loss);
	}

	.movement--same {
		color: var(--rk-gold);
	}

	.section {
		position: relative;
		margin-top: 4.9rem;
		padding: 2.2rem 2rem;
		border-radius: 1.45rem;
		border: 1px solid rgba(118, 159, 236, 0.28);
		background: linear-gradient(145deg, rgba(5, 16, 33, 0.9), rgba(6, 20, 40, 0.72));
		box-shadow: 0 20px 58px rgba(0, 0, 0, 0.24);
		transform-style: preserve-3d;
	}

	.section::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(180deg, rgba(143, 186, 255, 0.11), transparent 30%);
		pointer-events: none;
	}

	.section__title {
		margin: 0;
		font-family: 'Teko', sans-serif;
		font-size: clamp(2.6rem, 6vw, 4.2rem);
		line-height: 0.92;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.section__subtitle {
		margin: 0.8rem 0 1.6rem;
		max-width: 58ch;
		font-size: 1.28rem;
		line-height: 1.35;
		color: var(--rk-text-soft);
	}

	.steps-track {
		position: relative;
		padding-top: 1rem;
	}

	.steps-track__line {
		position: absolute;
		top: 3.2rem;
		left: 6%;
		right: 6%;
		height: 3px;
		border-radius: 99px;
		background: rgba(80, 123, 216, 0.34);
		overflow: hidden;
	}

	.steps-track__progress {
		height: 100%;
		transform-origin: left center;
		transform: scaleX(0);
		background: linear-gradient(90deg, rgba(0, 217, 255, 0.18), rgba(0, 217, 255, 0.98), rgba(255, 202, 58, 0.76));
	}

	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
		position: relative;
		z-index: 1;
	}

	.step-card {
		padding: 1.15rem;
		border-radius: 1rem;
		border: 1px solid rgba(112, 158, 255, 0.22);
		background: rgba(9, 24, 51, 0.78);
	}

	.step-card__icon {
		width: 3.4rem;
		height: 3.4rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		font-size: 1.66rem;
		background: radial-gradient(circle, rgba(0, 217, 255, 0.45), rgba(15, 30, 65, 0.78));
		margin-bottom: 0.66rem;
	}

	.step-card h3 {
		margin: 0;
		font-size: 1.45rem;
	}

	.step-card p {
		margin: 0.5rem 0 0;
		font-size: 1.13rem;
		line-height: 1.3;
		color: var(--rk-text-soft);
	}

	.live-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 290px;
		gap: 1rem;
	}

	.live-card {
		padding: 1.2rem;
		border-radius: 1rem;
		border: 1px solid rgba(118, 163, 255, 0.34);
		background: linear-gradient(140deg, rgba(6, 17, 35, 0.94), rgba(4, 14, 31, 0.94));
	}

	.live-score {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Teko', sans-serif;
		font-size: clamp(1.6rem, 2.5vw, 2.3rem);
		letter-spacing: 0.04em;
		transition: filter 220ms ease, text-shadow 220ms ease;
	}

	.live-score--flash {
		filter: brightness(1.3);
		text-shadow: 0 0 18px rgba(0, 217, 255, 0.7);
	}

	.live-score__event {
		margin-top: 0.46rem;
		font-size: 1rem;
		color: #ffda73;
	}

	.live-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 0.9rem;
	}

	.live-toast {
		margin-top: 0.8rem;
		display: inline-flex;
		align-items: center;
		padding: 0.55rem 0.92rem;
		border-radius: 999px;
		border: 1px solid rgba(66, 255, 157, 0.48);
		background: rgba(4, 20, 14, 0.72);
		font-size: 1.02rem;
		font-weight: 700;
	}

	.live-side {
		display: grid;
		align-content: start;
		gap: 0.7rem;
		padding: 1rem;
		border-radius: 1rem;
		border: 1px solid rgba(112, 156, 232, 0.28);
		background: rgba(8, 19, 39, 0.82);
	}

	.live-side strong {
		font-size: 1.06rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #9ce7ff;
	}

	.mode-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.95rem;
	}

	.mode-card {
		--rx: 0deg;
		--ry: 0deg;
		display: grid;
		gap: 0.64rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 1px solid rgba(112, 156, 235, 0.35);
		background: linear-gradient(148deg, rgba(9, 23, 46, 0.86), rgba(7, 16, 31, 0.95));
		transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(0);
		transition: border-color 180ms ease, box-shadow 180ms ease;
		will-change: transform;
	}

	.mode-card:hover {
		border-color: rgba(130, 203, 255, 0.68);
		box-shadow: 0 16px 38px rgba(6, 28, 63, 0.48);
	}

	.mode-card h3 {
		margin: 0;
		font-size: 1.82rem;
	}

	.mode-card p {
		margin: 0;
		font-size: 1.16rem;
		line-height: 1.3;
		color: var(--rk-text-soft);
	}

	.mode-card__badge {
		display: inline-flex;
		align-items: center;
		padding: 0.32rem 0.62rem;
		border-radius: 999px;
		font-size: 0.86rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		background: rgba(66, 255, 157, 0.17);
		border: 1px solid rgba(66, 255, 157, 0.45);
	}

	.mode-card__badge--coming {
		background: linear-gradient(110deg, rgba(0, 217, 255, 0.18), rgba(72, 106, 255, 0.3), rgba(255, 202, 58, 0.2));
		border-color: rgba(133, 201, 255, 0.5);
	}

	.barrier-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.barrier-card {
		padding: 1rem;
		border-radius: 0.92rem;
		border: 1px solid rgba(109, 151, 226, 0.28);
		background: rgba(8, 19, 38, 0.75);
	}

	.barrier-card h3 {
		margin: 0;
		font-size: 1.35rem;
	}

	.barrier-card p {
		margin: 0.5rem 0 0;
		font-size: 1.12rem;
		line-height: 1.3;
		color: var(--rk-text-soft);
	}

	.barrier-merge {
		margin-top: 1rem;
		font-family: 'Teko', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #9defff;
	}

	.ranked {
		overflow: hidden;
	}

	.ranked-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 76px;
		gap: 1rem;
		align-items: center;
	}

	.ranked__track {
		display: grid;
		gap: 0.5rem;
	}

	.ranked__tier {
		padding: 0.7rem 0.84rem;
		border-radius: 999px;
		border: 1px solid rgba(118, 160, 241, 0.25);
		background: rgba(7, 20, 42, 0.8);
		font-size: 1rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.ranked__tier--top {
		background: linear-gradient(120deg, rgba(255, 202, 58, 0.2), rgba(7, 23, 49, 0.8));
		border-color: rgba(255, 202, 58, 0.44);
	}

	.ranked__climber-track {
		height: 280px;
		position: relative;
	}

	.ranked__climber {
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: radial-gradient(circle, #ffe896 0%, #ffb01f 58%, #ff7f11 100%);
		box-shadow: 0 0 24px rgba(255, 188, 63, 0.62);
	}

	.social-stack {
		display: grid;
		gap: 0.6rem;
	}

	.social-bubble {
		padding: 0.66rem 0.82rem;
		border-radius: 0.82rem;
		background: rgba(10, 23, 47, 0.9);
		border: 1px solid rgba(108, 150, 228, 0.28);
		max-width: 560px;
		font-size: 1.05rem;
		will-change: transform;
	}

	.events-carousel {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(220px, 1fr);
		gap: 0.78rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 0.35rem;
	}

	.event-card {
		position: relative;
		overflow: hidden;
		scroll-snap-align: start;
		padding: 1rem;
		border-radius: 0.95rem;
		border: 1px solid rgba(114, 154, 232, 0.28);
		background: linear-gradient(145deg, rgba(8, 20, 42, 0.92), rgba(7, 17, 33, 0.92));
		min-height: 194px;
		display: grid;
		align-content: space-between;
	}

	.event-card__parallax {
		position: absolute;
		inset: -12% -8%;
		pointer-events: none;
		background: radial-gradient(circle at 20% 20%, rgba(0, 217, 255, 0.2), transparent 42%), radial-gradient(circle at 78% 4%, rgba(255, 202, 58, 0.14), transparent 38%);
		transform: translate3d(0, 0, 0);
		will-change: transform;
	}

	.event-card h3,
	.event-card p,
	.event-card .event-card__players,
	.event-card .button {
		position: relative;
		z-index: 1;
	}

	.event-card h3 {
		margin: 0;
		font-size: 1.44rem;
	}

	.event-card p {
		margin: 0.34rem 0 0;
		font-size: 1rem;
		color: var(--rk-text-soft);
	}

	.event-card__players {
		margin-bottom: 0.56rem;
		font-family: 'Teko', sans-serif;
		font-size: 1.9rem;
		letter-spacing: 0.03em;
	}

	.wrapped-card {
		padding: 1.2rem;
		border-radius: 1rem;
		border: 1px solid rgba(113, 154, 233, 0.28);
		background: linear-gradient(145deg, rgba(8, 22, 45, 0.9), rgba(7, 17, 34, 0.9));
	}

	.wrapped-slide {
		display: grid;
		gap: 0.3rem;
		font-size: 1.14rem;
	}

	.wrapped-slide strong {
		font-family: 'Teko', sans-serif;
		font-size: 2.25rem;
		line-height: 0.9;
		letter-spacing: 0.04em;
	}

	.faq-item {
		padding: 0.76rem 0.88rem;
		border-radius: 0.9rem;
		border: 1px solid rgba(108, 151, 229, 0.25);
		background: rgba(7, 18, 36, 0.8);
	}

	.faq-item + .faq-item {
		margin-top: 0.58rem;
	}

	.faq-item__button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.7rem;
		padding: 0;
		border: 0;
		background: transparent;
		text-align: left;
		color: var(--rk-text);
		font-size: 1.14rem;
		font-weight: 700;
		cursor: pointer;
	}

	.faq-item__button span:last-child {
		font-family: 'Teko', sans-serif;
		font-size: 1.8rem;
		line-height: 1;
	}

	.faq-item p {
		margin: 0.4rem 0 0;
		font-size: 1.06rem;
		line-height: 1.35;
		color: var(--rk-text-soft);
	}

	.footer {
		text-align: center;
		padding-bottom: 3rem;
	}

	.footer-cta {
		font-size: 1.36rem;
		padding: 0.88rem 1.7rem;
		animation: footer-cta-pulse 1700ms ease-in-out infinite;
	}

	@keyframes footer-cta-pulse {
		0%,
		100% {
			box-shadow: 0 12px 34px rgba(16, 186, 255, 0.35);
		}
		50% {
			box-shadow: 0 15px 42px rgba(16, 186, 255, 0.56);
		}
	}

	.footer__links {
		margin-top: 1.1rem;
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.7rem;
		font-size: 1rem;
		color: var(--rk-text-soft);
	}

	.footer__disclaimer {
		margin-top: 1rem;
		font-size: 1rem;
		font-weight: 700;
		color: #dcf0ff;
	}

	.sticky-cta {
		position: fixed;
		left: 1rem;
		right: 1rem;
		bottom: 1rem;
		z-index: 22;
		display: none;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.7rem;
		border-radius: 999px;
		border: 1px solid rgba(116, 157, 236, 0.42);
		background: rgba(2, 10, 24, 0.92);
		backdrop-filter: blur(10px);
	}

	.sticky-cta--visible {
		display: flex;
	}

	.sticky-cta__close {
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		border-radius: 50%;
		border: 0;
		background: transparent;
		color: #d3e8ff;
		font-size: 1.42rem;
		cursor: pointer;
	}

	@media (max-width: 1040px) {
		.hero-grid,
		.live-layout,
		.mode-grid,
		.barrier-grid,
		.steps-grid,
		.ranked-grid {
			grid-template-columns: 1fr;
		}

		.steps-track__line {
			display: none;
		}

		.ranked__climber-track {
			height: 86px;
		}

		.ranked__climber {
			bottom: auto;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	@media (max-width: 700px) {
		.layout {
			padding: 0 1.08rem 7.4rem;
		}

		.hero-copy,
		.hero-hud,
		.section {
			padding: 1.3rem;
		}

		.site-header {
			padding-top: 0.86rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	`;

	@state() private locale: LandingLocale = resolveLandingLocale(window.location.pathname);

	@state() private showPreloader = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 900 && !window.localStorage.getItem('rk.web.preloader.seen.v2');

	@state() private heroRanking: RankingRow[] = [...HERO_INITIAL_RANKING];

	@state() private liveRanking: RankingRow[] = [...LIVE_INITIAL_RANKING];

	@state() private heroEventLabel = "GOAL 23' Vinicius";

	@state() private liveHomeScore = 1;

	@state() private liveAwayScore = 0;

	@state() private liveMinute = 23;

	@state() private liveEventLabel = "⚽ 23' Vinicius Jr.";

	@state() private liveToast = '';

	@state() private liveScoreFlash = false;

	@state() private stickyCtaVisible = false;

	@state() private stickyCtaDismissed = false;

	@state() private wrappedIndex = 0;

	@state() private openFaqIndex = 0;

	@query('#particleCanvas') private readonly particleCanvas!: HTMLCanvasElement;

	@query('#heroSection') private readonly heroSection!: HTMLElement;

	@query('#footerCtaButton') private readonly footerCtaButton!: HTMLElement;

	private particleField: RankupParticleField | null = null;

	private readonly observers: IntersectionObserver[] = [];

	private readonly cleanupCallbacks: Array<() => void> = [];

	private readonly activeTimelines: Array<gsap.core.Timeline> = [];

	private heroIntervalId: number | null = null;

	private liveIntervalId: number | null = null;

	private wrappedIntervalId: number | null = null;

	private preloaderTimeoutId: number | null = null;

	private toastTimeoutId: number | null = null;

	private flashTimeoutId: number | null = null;

	private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	private readonly lowPowerMode = this.prefersReducedMotion || window.innerWidth < 900;

	private readonly onScrollBound = this.onScroll.bind(this);

	private readonly onResizeBound = this.onResize.bind(this);

	private readonly onStickyDismissBound = this.dismissStickyCta.bind(this);

	private readonly onScrollToCoreLoopBound = this.scrollToCoreLoop.bind(this);

	private readonly onToggleLocaleBound = this.toggleLocale.bind(this);

	private readonly onSimulateGoalBound = this.onSimulateGoal.bind(this);

	private readonly onFaqToggleBound = this.onFaqToggle.bind(this);

	public override connectedCallback(): void {
		super.connectedCallback();
		window.addEventListener('scroll', this.onScrollBound, { passive: true });
		window.addEventListener('resize', this.onResizeBound, { passive: true });
	}

	public override firstUpdated(): void {
		this.bootstrapParticleField();
		this.setupObservers();
		this.setupAdvancedInteractions();
		this.runEntranceAnimation();
		this.startAutomations();
		this.onScroll();
		if (this.showPreloader) {
			this.preloaderTimeoutId = window.setTimeout(() => {
				this.showPreloader = false;
				window.localStorage.setItem('rk.web.preloader.seen.v2', 'true');
			}, 1300);
		}
	}

	public override disconnectedCallback(): void {
		window.removeEventListener('scroll', this.onScrollBound);
		window.removeEventListener('resize', this.onResizeBound);
		if (this.heroIntervalId !== null) {
			window.clearInterval(this.heroIntervalId);
		}
		if (this.liveIntervalId !== null) {
			window.clearInterval(this.liveIntervalId);
		}
		if (this.wrappedIntervalId !== null) {
			window.clearInterval(this.wrappedIntervalId);
		}
		if (this.preloaderTimeoutId !== null) {
			window.clearTimeout(this.preloaderTimeoutId);
		}
		if (this.toastTimeoutId !== null) {
			window.clearTimeout(this.toastTimeoutId);
		}
		if (this.flashTimeoutId !== null) {
			window.clearTimeout(this.flashTimeoutId);
		}
		for (const observer of this.observers) {
			observer.disconnect();
		}
		this.observers.length = 0;
		for (const cleanup of this.cleanupCallbacks) {
			cleanup();
		}
		this.cleanupCallbacks.length = 0;
		for (const timeline of this.activeTimelines) {
			timeline.kill();
		}
		this.activeTimelines.length = 0;
		this.particleField?.dispose();
		this.particleField = null;
		if (!this.lowPowerMode) {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		}
		super.disconnectedCallback();
	}

	protected override render() {
		const isEnglish = this.locale === 'en';
		const rootPath = isEnglish ? '/en' : '/es';
		const signupHref = '/es/registro';
		const signinHref = '/es/iniciar-sesion';
		const heroHeadline = msg(isEnglish ? 'Every goal flips your position.' : 'Cada gol te cambia de puesto.', { id: 'landing.v2.hero.headline' });
		const heroSubheadline = msg(
			isEnglish
				? 'Rankup turns every live match into tournament pressure with your friends. Predict, react, climb. No betting. No real money.'
				: 'Rankup convierte cada partido en presión de torneo con tus amigos. Predice, reacciona y escala. Sin apuestas. Sin dinero real.',
			{ id: 'landing.v2.hero.subheadline' },
		);
		const primaryCtaText = msg(isEnglish ? 'Start competing' : 'Empieza a competir', { id: 'landing.v2.cta.primary' });
		const secondaryCtaText = msg(isEnglish ? 'See the live loop' : 'Ver loop en vivo', { id: 'landing.v2.cta.secondary' });
		const stickyLabel = msg(isEnglish ? 'Start free' : 'Empieza gratis', { id: 'landing.v2.sticky.cta' });
		const disclaimerNoBetting = msg(
			isEnglish ? 'No betting. No real money. Skill + friends + live football.' : 'Sin apuestas. Sin dinero real. Habilidad + amigos + fútbol en vivo.',
			{ id: 'landing.v2.disclaimer.primary' },
		);
		const stickyClass = this.stickyCtaVisible && !this.stickyCtaDismissed ? 'sticky-cta sticky-cta--visible' : 'sticky-cta';

		const faqItems = [
			{
				question: msg(isEnglish ? 'Is Rankup betting or gambling?' : '¿Rankup es apuestas o gambling?', { id: 'landing.v2.faq.q1' }),
				answer: msg(
					isEnglish
						? 'No. Rankup is a free social competition game and never uses real money as gameplay.'
						: 'No. Rankup es un juego social competitivo gratuito y nunca usa dinero real como mecánica.',
					{ id: 'landing.v2.faq.a1' },
				),
			},
			{
				question: msg(isEnglish ? 'Do I need fantasy-level expertise?' : '¿Necesito nivel experto de fantasy?', { id: 'landing.v2.faq.q2' }),
				answer: msg(
					isEnglish
						? 'No. If you can read a match and predict a score, you can compete.'
						: 'No. Si puedes leer un partido y predecir un marcador, puedes competir.',
					{ id: 'landing.v2.faq.a2' },
				),
			},
			{
				question: msg(isEnglish ? 'Can I play only with friends?' : '¿Puedo jugar solo con amigos?', { id: 'landing.v2.faq.q3' }),
				answer: msg(
					isEnglish
						? 'Yes. Create a private tournament, share the code, and start in seconds.'
						: 'Sí. Crea un torneo privado, comparte código y empieza en segundos.',
					{ id: 'landing.v2.faq.a3' },
				),
			},
			{
				question: msg(isEnglish ? 'Is it completely free?' : '¿Es completamente gratis?', { id: 'landing.v2.faq.q4' }),
				answer: msg(isEnglish ? 'Yes. Fully free.' : 'Sí. Totalmente gratis.', { id: 'landing.v2.faq.a4' }),
			},
		];

		const wrappedSlides: WrappedSlide[] = [
			{
				title: msg(isEnglish ? 'Final position' : 'Posición final', { id: 'landing.v2.wrapped.position.title' }),
				value: isEnglish ? '3rd / 24 players' : '3° / 24 jugadores',
				emoji: '🏆',
			},
			{
				title: msg(isEnglish ? 'Hit rate' : 'Tasa de acierto', { id: 'landing.v2.wrapped.hitrate.title' }),
				value: '72%',
				emoji: '🎯',
			},
			{
				title: msg(isEnglish ? 'Top streak' : 'Racha top', { id: 'landing.v2.wrapped.streak.title' }),
				value: isEnglish ? '3 matchdays #1' : '3 jornadas #1',
				emoji: '⚡',
			},
			{
				title: msg(isEnglish ? 'Main rival' : 'Rival directo', { id: 'landing.v2.wrapped.rival.title' }),
				value: 'María G.',
				emoji: '🔥',
			},
		];

		const currentWrapped = wrappedSlides[this.wrappedIndex % wrappedSlides.length];
		const chatBubbles = [
			msg(isEnglish ? '💬 “No way you guessed 2-1.” — Pablo' : '💬 “No me creo que hayas puesto 2-1.” — Pablo', { id: 'landing.v2.social.chat1' }),
			msg(isEnglish ? '💬 “One goal and I pass you.” — María' : '💬 “Un gol y te paso.” — María', { id: 'landing.v2.social.chat2' }),
			msg(isEnglish ? '💬 “This tournament is mine.” — Carlos' : '💬 “Este torneo es mío.” — Carlos', { id: 'landing.v2.social.chat3' }),
			msg(isEnglish ? '💬 “Wait for minute 80 👀” — Laura' : '💬 “Esperad al minuto 80 👀” — Laura', { id: 'landing.v2.social.chat4' }),
		];

		const eventCards: EventCardModel[] = [
			{
				title: msg(isEnglish ? '🏆 Champions Clash' : '🏆 Choque Champions', { id: 'landing.v2.events.card1.title' }),
				players: 2847,
				ctaLabel: msg(isEnglish ? 'Join' : 'Unirse', { id: 'landing.v2.events.card1.cta' }),
			},
			{
				title: msg(isEnglish ? '⚡ Weekly Sprint' : '⚡ Sprint semanal', { id: 'landing.v2.events.card2.title' }),
				players: 892,
				ctaLabel: msg(isEnglish ? 'Join' : 'Unirse', { id: 'landing.v2.events.card2.cta' }),
			},
			{
				title: msg(isEnglish ? '🎯 LaLiga Pressure' : '🎯 Presión LaLiga', { id: 'landing.v2.events.card3.title' }),
				players: 5124,
				ctaLabel: msg(isEnglish ? 'Join' : 'Unirse', { id: 'landing.v2.events.card3.cta' }),
			},
			{
				title: msg(isEnglish ? '🌍 World Cup Road' : '🌍 Camino al Mundial', { id: 'landing.v2.events.card4.title' }),
				players: 12000,
				ctaLabel: msg(isEnglish ? 'Waitlist' : 'Lista de espera', { id: 'landing.v2.events.card4.cta' }),
			},
		];

		return html`
			<canvas id="particleCanvas" data-role="particle-field" aria-hidden="true"></canvas>
			<div class=${this.showPreloader ? 'preloader preloader--visible' : 'preloader'}>
				<div>
					<div class="preloader__logo">RANKUP</div>
					<div class="preloader__sub">Matchday boot sequence</div>
				</div>
			</div>
			<div class="site">
				<div class="layout">
					<header class="site-header">
						<div class="brand"><span class="brand__dot"></span>Rankup</div>
						<div class="header-actions">
							<button class="locale-btn" @click=${this.onToggleLocaleBound}>${this.locale.toUpperCase()} ▾</button>
							<a class="header-signin" href=${signinHref}>${msg(isEnglish ? 'Sign in' : 'Entrar', { id: 'landing.v2.header.signin' })}</a>
						</div>
					</header>

					<section class="hero" id="heroSection" data-burst-zone="hero">
						<div class="hero-grid">
							<div class="hero-copy">
								<div class="hero__eyebrow">${msg(isEnglish ? 'Live social tournament' : 'Torneo social en vivo', { id: 'landing.v2.hero.eyebrow' })}</div>
								<h1 class="hero__headline" id="heroHeadline">
									${heroHeadline.split(' ').map(word => html`<span class="hero__word">${word}</span>`)}
								</h1>
								<p class="hero__subheadline">${heroSubheadline}</p>
								<div class="hero__ctas">
									<a class="button button--primary hero__cta" href=${signupHref}>▶ ${primaryCtaText}</a>
									<button class="button button--secondary hero__cta" @click=${this.onScrollToCoreLoopBound}>${secondaryCtaText} ↓</button>
								</div>
								<div class="hero__badges">
									<span class="badge">✓ ${msg(isEnglish ? 'No betting' : 'Sin apuestas', { id: 'landing.v2.badge.no.betting' })}</span>
									<span class="badge">✓ ${msg(isEnglish ? '100% free' : '100% gratis', { id: 'landing.v2.badge.free' })}</span>
									<span class="badge">✓ ${msg(isEnglish ? 'Any level can play' : 'Cualquier nivel puede jugar', { id: 'landing.v2.badge.levels' })}</span>
								</div>
								<div class="hero__disclaimer">${disclaimerNoBetting}</div>
								<div class="scroll-hint">↓ ${msg(isEnglish ? 'Scroll and feel the pressure' : 'Haz scroll y siente la presión', { id: 'landing.v2.hero.scroll.hint' })}</div>
							</div>
							<div class="hero-hud">
								<div class="hero-hud__title">${msg(isEnglish ? 'Live ranking panel' : 'Panel de ranking en vivo', { id: 'landing.v2.hero.hud.title' })}</div>
								<div class="hero-hud__score">
									<span>RMA</span>
									<span>2 - 1</span>
									<span>BAR</span>
								</div>
								<div class="hero-hud__event">⚡ ${this.heroEventLabel}</div>
								<ol class="ranking-list" id="heroRankingList">
									${this.heroRanking.map((row, index) => this.renderRankingRow(row, index + 1, 'hero'))}
								</ol>
							</div>
						</div>
					</section>

					<section id="coreLoopSection" class="section" data-burst-zone="core-loop">
						<h2 class="section__title">${msg(isEnglish ? 'Compete in 3 moves' : 'Compite en 3 jugadas', { id: 'landing.v2.coreloop.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'Create the tournament, lock your predictions, and fight every goal in the ranking.' : 'Crea el torneo, bloquea tus predicciones y pelea cada gol en el ranking.', { id: 'landing.v2.coreloop.subtitle' })}</p>
						<div class="steps-track">
							<div class="steps-track__line"><div class="steps-track__progress"></div></div>
							<div class="steps-grid">
								<article class="step-card">
									<div class="step-card__icon">👥</div>
									<h3>${msg(isEnglish ? 'Create your lobby' : 'Crea tu lobby', { id: 'landing.v2.coreloop.step1.title' })}</h3>
									<p>${msg(isEnglish ? 'Private code, direct invite, instant start.' : 'Código privado, invitación directa e inicio instantáneo.', { id: 'landing.v2.coreloop.step1.body' })}</p>
								</article>
								<article class="step-card">
									<div class="step-card__icon">🎯</div>
									<h3>${msg(isEnglish ? 'Predict before lock' : 'Predice antes del cierre', { id: 'landing.v2.coreloop.step2.title' })}</h3>
									<p>${msg(isEnglish ? 'You commit scores before kickoff. No edits after lock.' : 'Envías marcador antes del pitido. Sin edición tras el lock.', { id: 'landing.v2.coreloop.step2.body' })}</p>
								</article>
								<article class="step-card">
									<div class="step-card__icon">📈</div>
									<h3>${msg(isEnglish ? 'React live' : 'Reacciona en vivo', { id: 'landing.v2.coreloop.step3.title' })}</h3>
									<p>${msg(isEnglish ? 'Goals hit, points move, ranking flips in real time.' : 'Caen goles, se mueven puntos y el ranking se da vuelta en tiempo real.', { id: 'landing.v2.coreloop.step3.body' })}</p>
								</article>
							</div>
						</div>
					</section>

					<section id="liveSection" class="section" data-burst-zone="live-demo">
						<h2 class="section__title">${msg(isEnglish ? 'Feel the match. Not after, now.' : 'Siente el partido. No después, ahora.', { id: 'landing.v2.live.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'When a goal lands, your group ranking updates instantly. This is where rivalry gets real.' : 'Cuando cae un gol, el ranking del grupo cambia al instante. Aquí se vuelve real la rivalidad.', { id: 'landing.v2.live.subtitle' })}</p>
						<div class="live-layout">
							<div class="live-card">
								<div class=${this.liveScoreFlash ? 'live-score live-score--flash' : 'live-score'}>
									<span>REAL MADRID</span>
									<span>${this.liveHomeScore} - ${this.liveAwayScore}</span>
									<span>BARCELONA</span>
								</div>
								<div class="live-score__event">${this.liveEventLabel}</div>
								<div class="live-controls">
									<button class="button button--primary" @click=${this.onSimulateGoalBound}>⚡ ${msg(isEnglish ? 'Simulate goal' : 'Simular gol', { id: 'landing.v2.live.sim.button' })}</button>
									<button class="button button--secondary" @click=${this.onScrollToCoreLoopBound}>${msg(isEnglish ? 'Back to rules' : 'Volver a reglas', { id: 'landing.v2.live.back.button' })}</button>
								</div>
								${this.liveToast ? html`<div class="live-toast">${this.liveToast}</div>` : null}
							</div>
							<div class="live-side">
								<strong>${msg(isEnglish ? 'Live ranking' : 'Ranking en vivo', { id: 'landing.v2.live.ranking.title' })}</strong>
								<ol class="ranking-list" id="liveRankingList">
									${this.liveRanking.map((row, index) => this.renderRankingRow(row, index + 1, 'live'))}
								</ol>
							</div>
						</div>
					</section>

					<section class="section" data-burst-zone="modes">
						<h2 class="section__title">${msg(isEnglish ? 'Multiple ways to dominate' : 'Múltiples formas de dominar', { id: 'landing.v2.modes.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'ScorePrediction is live now. Draft enters next with the same social pressure.' : 'ScorePrediction está activo ahora. Draft entra después con la misma presión social.', { id: 'landing.v2.modes.subtitle' })}</p>
						<div class="mode-grid">
							<article class="mode-card">
								<h3>⚽ ScorePrediction</h3>
								<p>${msg(isEnglish ? 'Exact-score competition where every goal can move your position in the table.' : 'Competición de marcador exacto donde cada gol puede mover tu puesto en la tabla.', { id: 'landing.v2.modes.scoreprediction.body' })}</p>
								<span class="mode-card__badge">${msg(isEnglish ? 'Live now' : 'Disponible', { id: 'landing.v2.modes.scoreprediction.badge' })}</span>
							</article>
							<article class="mode-card">
								<h3>🃏 Draft</h3>
								<p>${msg(isEnglish ? 'Build your matchday lineup and clash with your group with zero fantasy overload.' : 'Arma alineación por jornada y compite con tu grupo sin sobrecarga fantasy.', { id: 'landing.v2.modes.draft.body' })}</p>
								<span class="mode-card__badge mode-card__badge--coming">${msg(isEnglish ? 'Coming soon' : 'Próximamente', { id: 'landing.v2.modes.draft.badge' })}</span>
							</article>
						</div>
					</section>

					<section class="section" data-burst-zone="barrier">
						<h2 class="section__title">${msg(isEnglish ? 'Simple to start. Hard to win.' : 'Fácil de entrar. Difícil de ganar.', { id: 'landing.v2.barrier.title' })}</h2>
						<div class="barrier-grid">
							<article class="barrier-card">
								<h3>${msg(isEnglish ? 'For casual fans' : 'Para fans casuales', { id: 'landing.v2.barrier.casual.title' })}</h3>
								<p>${msg(isEnglish ? 'No fantasy spreadsheets. Read the match and play.' : 'Sin hojas de fantasy. Lees el partido y juegas.', { id: 'landing.v2.barrier.casual.body' })}</p>
							</article>
							<article class="barrier-card">
								<h3>${msg(isEnglish ? 'For competitive groups' : 'Para grupos competitivos', { id: 'landing.v2.barrier.competitive.title' })}</h3>
								<p>${msg(isEnglish ? 'Same adrenaline, less friction, zero betting baggage.' : 'Misma adrenalina, menos fricción y cero carga de apuestas.', { id: 'landing.v2.barrier.competitive.body' })}</p>
							</article>
						</div>
						<div class="barrier-merge">${msg(isEnglish ? 'Everyone can enter. Few can stay on top.' : 'Todos pueden entrar. Pocos se mantienen arriba.', { id: 'landing.v2.barrier.merge' })}</div>
					</section>

					<section id="rankedSection" class="section ranked" data-burst-zone="ranked">
						<h2 class="section__title">${msg(isEnglish ? 'Climb divisions. Earn respect.' : 'Sube divisiones. Gana respeto.', { id: 'landing.v2.ranked.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'Verified competition powers progression. No shortcuts. No fake prestige.' : 'La competición verificada mueve tu progreso. Sin atajos. Sin prestigio falso.', { id: 'landing.v2.ranked.subtitle' })}</p>
						<div class="ranked-grid">
							<div class="ranked__track">
								<div class="ranked__tier ranked__tier--top">🏆 Élite</div>
								<div class="ranked__tier">Platino</div>
								<div class="ranked__tier">Oro</div>
								<div class="ranked__tier">Plata</div>
								<div class="ranked__tier">Bronce</div>
							</div>
							<div class="ranked__climber-track">
								<div class="ranked__climber" aria-hidden="true"></div>
							</div>
						</div>
					</section>

					<section class="section" data-burst-zone="social">
						<h2 class="section__title">${msg(isEnglish ? 'Beating your friends hits harder' : 'Ganarle a tus amigos pega más fuerte', { id: 'landing.v2.social.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'Private tournaments, direct invites, chat pressure during every match.' : 'Torneos privados, invitaciones directas y presión por chat durante cada partido.', { id: 'landing.v2.social.subtitle' })}</p>
						<div class="social-stack">
							${chatBubbles.map(bubble => html`<div class="social-bubble">${bubble}</div>`)}
						</div>
						<div class="live-controls">
							<a class="button button--primary" href=${signupHref}>${msg(isEnglish ? 'Create your tournament' : 'Crea tu torneo', { id: 'landing.v2.social.cta' })}</a>
						</div>
					</section>

					<section class="section" data-burst-zone="events">
						<h2 class="section__title">${msg(isEnglish ? 'Official events. Real pressure.' : 'Eventos oficiales. Presión real.', { id: 'landing.v2.events.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'Verified events feed your global progression and your reputation.' : 'Los eventos verificados alimentan tu progreso global y tu reputación.', { id: 'landing.v2.events.subtitle' })}</p>
						<div class="events-carousel">
							${eventCards.map(card => this.renderEventCard(card))}
						</div>
					</section>

					<section class="section" data-burst-zone="wrapped">
						<h2 class="section__title">${msg(isEnglish ? 'Every tournament leaves a story' : 'Cada torneo deja historia', { id: 'landing.v2.wrapped.title' })}</h2>
						<p class="section__subtitle">${msg(isEnglish ? 'Your recap is proof of what you did under pressure.' : 'Tu recap es prueba de lo que hiciste bajo presión.', { id: 'landing.v2.wrapped.subtitle' })}</p>
						<div class="wrapped-card">
							<div class="wrapped-slide">
								<div>${currentWrapped.emoji} ${currentWrapped.title}</div>
								<strong>${currentWrapped.value}</strong>
								<div>${msg(isEnglish ? 'Share it and call your next tournament.' : 'Compártelo y convoca tu siguiente torneo.', { id: 'landing.v2.wrapped.caption' })}</div>
							</div>
						</div>
					</section>

					<section class="section" data-burst-zone="faq">
						<h2 class="section__title">${msg(isEnglish ? 'FAQ' : 'Preguntas frecuentes', { id: 'landing.v2.faq.title' })}</h2>
						${faqItems.map((item, index) => this.renderFaqItem(item.question, item.answer, index))}
					</section>

					<footer class="section footer" data-burst-zone="footer">
						<h2 class="section__title">${msg(isEnglish ? 'Ready to prove what you know?' : '¿Listo para demostrar lo que sabes?', { id: 'landing.v2.footer.title' })}</h2>
						<a id="footerCtaButton" class="footer-cta" href=${signupHref}>▶ ${primaryCtaText}</a>
						<div class="footer__links">
							<a href=${rootPath}>Rankup</a>
							<a href="#">${msg(isEnglish ? 'About' : 'Sobre nosotros', { id: 'landing.v2.footer.about' })}</a>
							<a href="#">${msg(isEnglish ? 'Privacy' : 'Privacidad', { id: 'landing.v2.footer.privacy' })}</a>
							<a href="#">${msg(isEnglish ? 'Terms' : 'Términos', { id: 'landing.v2.footer.terms' })}</a>
							<a href="#">X</a>
							<a href="#">Instagram</a>
							<a href="#">TikTok</a>
						</div>
						<div class="footer__disclaimer">${msg(isEnglish ? 'Rankup is not betting. No real-money gameplay.' : 'Rankup no es apuestas. Sin dinero real en el juego.', { id: 'landing.v2.footer.disclaimer' })}</div>
					</footer>
				</div>
			</div>
			<div class=${stickyClass}>
				<a class="sticky-cta__button" href=${signupHref}>▶ ${stickyLabel}</a>
				<button class="sticky-cta__close" @click=${this.onStickyDismissBound}>×</button>
			</div>
		`;
	}

	private renderRankingRow(row: RankingRow, rank: number, scope: string) {
		const movementSymbol = row.movement === 'up' ? '↑' : row.movement === 'down' ? '↓' : '→';
		const movementClass = row.movement === 'up' ? 'movement movement--up' : row.movement === 'down' ? 'movement movement--down' : 'movement movement--same';
		const rowClass = row.isMe ? 'ranking-row ranking-row--me' : 'ranking-row';
		return html`
			<li class=${rowClass} data-ranking-row data-row-id=${`${scope}:${row.id}`}>
				<span>${rank}.</span>
				<span><span class=${movementClass}>${movementSymbol}</span> ${row.name}</span>
				<span>${row.points} pts</span>
			</li>
		`;
	}

	private renderEventCard(card: EventCardModel) {
		const playersLabel = this.locale === 'en' ? 'players' : 'jugadores';
		return html`
			<article class="event-card js-count-up" data-target=${card.players.toString()}>
				<div class="event-card__parallax" aria-hidden="true"></div>
				<div>
					<h3>${card.title}</h3>
					<p>${msg(this.locale === 'en' ? 'Verified event' : 'Evento verificado', { id: 'landing.v2.events.card.kind' })}</p>
				</div>
				<div>
					<div class="event-card__players">${card.players.toLocaleString()} ${playersLabel}</div>
					<button class="button button--secondary">${card.ctaLabel}</button>
				</div>
			</article>
		`;
	}

	private renderFaqItem(question: string, answer: string, index: number) {
		const expanded = this.openFaqIndex === index;
		return html`
			<article class="faq-item">
				<button class="faq-item__button" data-faq-index=${index.toString()} @click=${this.onFaqToggleBound}>
					<span>${question}</span>
					<span>${expanded ? '−' : '+'}</span>
				</button>
				${expanded ? html`<p>${answer}</p>` : null}
			</article>
		`;
	}

	private onFaqToggle(event: Event): void {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) {
			return;
		}
		const indexText = target.dataset.faqIndex;
		if (!indexText) {
			return;
		}
		const index = Number.parseInt(indexText, 10);
		if (Number.isNaN(index)) {
			return;
		}
		this.openFaqIndex = this.openFaqIndex === index ? -1 : index;
	}

	private dismissStickyCta(): void {
		this.stickyCtaDismissed = true;
	}

	private scrollToCoreLoop(): void {
		const target = this.renderRoot.querySelector<HTMLElement>('#coreLoopSection');
		target?.scrollIntoView({ behavior: this.lowPowerMode ? 'auto' : 'smooth', block: 'start' });
	}

	private toggleLocale(): void {
		const targetLocale: LandingLocale = this.locale === 'es' ? 'en' : 'es';
		const localizedPath = buildLocalizedPath(targetLocale, window.location.pathname);
		const nextUrl = `${localizedPath}${window.location.search}${window.location.hash}`;
		window.location.assign(nextUrl);
	}

	private onSimulateGoal(): void {
		this.performGoalSimulation(true);
	}

	private async performGoalSimulation(triggerBurst: boolean): Promise<void> {
		const flipState = this.captureFlipState('#liveRankingList');
		const homeScored = Math.random() > 0.46;
		if (homeScored) {
			this.liveHomeScore += 1;
		} else {
			this.liveAwayScore += 1;
		}
		this.liveMinute = Math.min(96, this.liveMinute + this.randomBetween(2, 7));
		const scorer = LIVE_SCORERS[this.randomBetween(0, LIVE_SCORERS.length - 1)];
		this.liveEventLabel = `⚽ ${this.liveMinute}' ${scorer}`;
		const previousOrder = new Map(this.liveRanking.map((row, index) => [row.id, index]));
		const adjusted = this.liveRanking
			.map(row => {
				const delta = row.isMe ? this.randomBetween(1, 4) : this.randomBetween(-2, 3);
				return {
					...row,
					points: Math.max(0, row.points + delta),
				};
			})
			.sort((a, b) => b.points - a.points)
			.map((row, index) => {
				const previous = previousOrder.get(row.id) ?? index;
				const movement: RankingMovement = previous > index ? 'up' : previous < index ? 'down' : 'same';
				return {
					...row,
					movement,
				};
			});
		this.liveRanking = adjusted;
		this.liveScoreFlash = true;
		if (this.flashTimeoutId !== null) {
			window.clearTimeout(this.flashTimeoutId);
		}
		this.flashTimeoutId = window.setTimeout(() => {
			this.liveScoreFlash = false;
		}, 320);
		await this.updateComplete;
		this.playFlipAnimation(flipState, {
			duration: 0.66,
			ease: 'rk-spring',
			stagger: 0.03,
		});
		const myRankIndex = adjusted.findIndex(item => item.isMe);
		if (myRankIndex >= 0) {
			const rank = myRankIndex + 1;
			const prefix = this.locale === 'en' ? msg('⚽ Goal! You climbed to #', { id: 'landing.v2.live.toast.prefix.en' }) : msg('⚽ ¡Gol! Subiste al puesto ', { id: 'landing.v2.live.toast.prefix.es' });
			const suffix = this.locale === 'en' ? '' : '°';
			this.liveToast = `${prefix}${rank}${suffix}`;
			if (this.toastTimeoutId !== null) {
				window.clearTimeout(this.toastTimeoutId);
			}
			this.toastTimeoutId = window.setTimeout(() => {
				this.liveToast = '';
			}, 1800);
		}
		if (triggerBurst) {
			this.triggerBurstAtElement('#liveSection', 7.2);
		}
	}

	private startAutomations(): void {
		if (this.lowPowerMode) {
			return;
		}
		this.heroIntervalId = window.setInterval(() => {
			this.rotateHeroRanking();
		}, 3300);
		this.liveIntervalId = window.setInterval(() => {
			this.performGoalSimulation(false);
		}, 5200);
		this.wrappedIntervalId = window.setInterval(() => {
			this.wrappedIndex += 1;
		}, 3400);
	}

	private async rotateHeroRanking(): Promise<void> {
		const flipState = this.captureFlipState('#heroRankingList');
		const previousOrder = new Map(this.heroRanking.map((row, index) => [row.id, index]));
		this.heroRanking = this.heroRanking
			.map(row => ({
				...row,
				points: Math.max(0, row.points + this.randomBetween(-1, 3)),
			}))
			.sort((a, b) => b.points - a.points)
			.map((row, index) => {
				const previous = previousOrder.get(row.id) ?? index;
				const movement: RankingMovement = previous > index ? 'up' : previous < index ? 'down' : 'same';
				return {
					...row,
					movement,
				};
			});
		const heroEvents = this.locale === 'en' ? HERO_EVENT_TEXT_EN : HERO_EVENT_TEXT_ES;
		this.heroEventLabel = heroEvents[this.randomBetween(0, heroEvents.length - 1)] ?? heroEvents[0];
		await this.updateComplete;
		this.playFlipAnimation(flipState, {
			duration: 0.58,
			ease: 'rk-spring',
			stagger: 0.024,
		});
	}

	private bootstrapParticleField(): void {
		this.particleField = new RankupParticleField(this.particleCanvas, {
			reducedMotion: this.lowPowerMode,
			mobile: window.innerWidth < 880,
		});
	}

	private setupObservers(): void {
		const burstObserver = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (!entry.isIntersecting) {
						continue;
					}
					const bounds = entry.target.getBoundingClientRect();
					this.particleField?.triggerBurst({
						x: bounds.left + bounds.width * 0.5,
						y: bounds.top + bounds.height * 0.32,
						strength: 5.8,
					});
				}
			},
			{ threshold: 0.5 },
		);
		this.renderRoot.querySelectorAll<HTMLElement>('[data-burst-zone]').forEach(element => burstObserver.observe(element));
		this.observers.push(burstObserver);

		const footerObserver = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (!this.footerCtaButton) {
						continue;
					}
					if (entry.isIntersecting) {
						const bounds = this.footerCtaButton.getBoundingClientRect();
						this.particleField?.setAttractor(bounds.left + bounds.width * 0.5, bounds.top + bounds.height * 0.5);
					} else {
						this.particleField?.clearAttractor();
					}
				}
			},
			{ threshold: 0.3 },
		);
		const footer = this.renderRoot.querySelector<HTMLElement>('.footer');
		if (footer) {
			footerObserver.observe(footer);
			this.observers.push(footerObserver);
		}

		const counterObserver = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (!entry.isIntersecting) {
						continue;
					}
					counterObserver.unobserve(entry.target);
					const target = entry.target as HTMLElement;
					const numericTargetText = target.dataset.target;
					if (!numericTargetText) {
						continue;
					}
					const numericTarget = Number.parseInt(numericTargetText, 10);
					if (Number.isNaN(numericTarget)) {
						continue;
					}
					const label = target.querySelector<HTMLElement>('.event-card__players');
					if (!label) {
						continue;
					}
					this.animateCounter(label, numericTarget);
				}
			},
			{ threshold: 0.5 },
		);
		this.renderRoot.querySelectorAll<HTMLElement>('.js-count-up').forEach(element => counterObserver.observe(element));
		this.observers.push(counterObserver);
	}

	private setupAdvancedInteractions(): void {
		this.setupScrollChoreography();
		this.setupModeTilt();
		this.setupEventCardParallax();
		this.setupSocialBubblesAnimation();
	}

	private setupScrollChoreography(): void {
		if (this.lowPowerMode) {
			return;
		}
		const sections = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.section'));
		for (const section of sections) {
			gsap.fromTo(
				section,
				{ opacity: 0.4, y: 36, rotateX: 3, transformPerspective: 900, transformOrigin: '50% 0%' },
				{
					opacity: 1,
					y: 0,
					rotateX: 0,
					duration: 0.92,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: section,
						start: 'top 86%',
						toggleActions: 'play none none reverse',
					},
				},
			);
		}
		const progressLine = this.renderRoot.querySelector<HTMLElement>('.steps-track__progress');
		if (progressLine) {
			gsap.fromTo(
				progressLine,
				{ scaleX: 0 },
				{
					scaleX: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: '#coreLoopSection',
						start: 'top 78%',
						end: 'bottom 40%',
						scrub: true,
					},
				},
			);
		}
		const climber = this.renderRoot.querySelector<HTMLElement>('.ranked__climber');
		if (climber) {
			gsap.to(climber, {
				y: -210,
				ease: 'none',
				scrollTrigger: {
					trigger: '#rankedSection',
					start: 'top 78%',
					end: 'bottom 34%',
					scrub: true,
				},
			});
		}
	}

	private setupModeTilt(): void {
		if (this.lowPowerMode) {
			return;
		}
		const cards = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.mode-card'));
		for (const card of cards) {
			const onPointerMove = (event: PointerEvent) => {
				const bounds = card.getBoundingClientRect();
				const relativeX = (event.clientX - bounds.left) / bounds.width;
				const relativeY = (event.clientY - bounds.top) / bounds.height;
				const rotateY = (relativeX - 0.5) * 14;
				const rotateX = (0.5 - relativeY) * 11;
				gsap.to(card, {
					'--ry': `${rotateY.toFixed(2)}deg`,
					'--rx': `${rotateX.toFixed(2)}deg`,
					duration: 0.26,
					ease: 'power3.out',
				});
			};
			const onPointerLeave = () => {
				gsap.to(card, {
					'--ry': '0deg',
					'--rx': '0deg',
					duration: 0.5,
					ease: 'power3.out',
				});
			};
			card.addEventListener('pointermove', onPointerMove);
			card.addEventListener('pointerleave', onPointerLeave);
			this.cleanupCallbacks.push(() => {
				card.removeEventListener('pointermove', onPointerMove);
				card.removeEventListener('pointerleave', onPointerLeave);
			});
		}
	}

	private setupEventCardParallax(): void {
		if (this.lowPowerMode) {
			return;
		}
		const cards = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.event-card'));
		for (const card of cards) {
			const layer = card.querySelector<HTMLElement>('.event-card__parallax');
			if (!layer) {
				continue;
			}
			const onPointerMove = (event: PointerEvent) => {
				const bounds = card.getBoundingClientRect();
				const relativeX = (event.clientX - bounds.left) / bounds.width;
				const relativeY = (event.clientY - bounds.top) / bounds.height;
				const deltaX = (relativeX - 0.5) * 16;
				const deltaY = (relativeY - 0.5) * 16;
				gsap.to(layer, {
					x: deltaX,
					y: deltaY,
					duration: 0.28,
					ease: 'power2.out',
				});
			};
			const onPointerLeave = () => {
				gsap.to(layer, {
					x: 0,
					y: 0,
					duration: 0.5,
					ease: 'power3.out',
				});
			};
			card.addEventListener('pointermove', onPointerMove);
			card.addEventListener('pointerleave', onPointerLeave);
			this.cleanupCallbacks.push(() => {
				card.removeEventListener('pointermove', onPointerMove);
				card.removeEventListener('pointerleave', onPointerLeave);
			});
		}
	}

	private setupSocialBubblesAnimation(): void {
		if (this.lowPowerMode) {
			return;
		}
		const bubbles = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.social-bubble'));
		for (const [index, bubble] of bubbles.entries()) {
			const timeline = gsap.timeline({
				repeat: -1,
				repeatDelay: 2 + index * 0.4,
				delay: index * 0.12,
			});
			timeline
				.fromTo(bubble, { y: 18, opacity: 0.65, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.48, ease: 'back.out(1.7)' })
				.to(bubble, { y: -6, duration: 0.35, ease: 'sine.out' })
				.to(bubble, { y: 0, duration: 0.65, ease: 'elastic.out(1, 0.44)' });
			this.activeTimelines.push(timeline);
		}
	}

	private runEntranceAnimation(): void {
		if (this.lowPowerMode) {
			return;
		}
		gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);
		CustomEase.create('rk-impact', 'M0,0 C0.126,0.41 0.19,1 0.38,1 0.54,1 0.64,0.85 0.72,0.66 0.79,0.5 0.88,0.3 1,0');
		CustomEase.create('rk-spring', 'M0,0 C0.064,0.328 0.116,1.07 0.28,1.118 0.42,1.16 0.54,0.972 0.66,0.954 0.78,0.936 0.888,1.016 1,1');
		const timeline = gsap.timeline();
		timeline
			.from('.hero__eyebrow', { opacity: 0, y: 20, duration: 0.45, ease: 'rk-impact' })
			.from('.hero__word', { opacity: 0, yPercent: 120, stagger: 0.07, duration: 0.58, ease: 'rk-impact' }, '-=0.1')
			.from('.hero__subheadline', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.24')
			.from('.hero__cta', { opacity: 0, y: 16, scale: 0.96, stagger: 0.08, duration: 0.44, ease: 'back.out(1.5)' }, '-=0.2')
			.from('.hero__badges .badge', { opacity: 0, x: -14, stagger: 0.06, duration: 0.34, ease: 'power2.out' }, '-=0.24')
			.from('.hero-hud', { opacity: 0, x: 20, scale: 0.96, duration: 0.62, ease: 'power3.out' }, '-=0.52');
		this.activeTimelines.push(timeline);
	}

	private animateCounter(label: HTMLElement, target: number): void {
		const suffix = this.locale === 'en' ? 'players' : 'jugadores';
		if (this.lowPowerMode) {
			label.textContent = `${target.toLocaleString()} ${suffix}`;
			return;
		}
		const data = { value: 0 };
		gsap.to(data, {
			value: target,
			duration: 1.1,
			ease: 'power2.out',
			onUpdate: () => {
				label.textContent = `${Math.floor(data.value).toLocaleString()} ${suffix}`;
			},
			onComplete: () => {
				label.textContent = `${target.toLocaleString()} ${suffix}`;
			},
		});
	}

	private captureFlipState(listSelector: string) {
		if (this.lowPowerMode) {
			return null;
		}
		const rows = this.getRankingRowElements(listSelector);
		if (rows.length === 0) {
			return null;
		}
		return Flip.getState(rows);
	}

	private playFlipAnimation(
		state: ReturnType<typeof Flip.getState> | null,
		options: { duration: number; ease: string; stagger: number },
	): void {
		if (!state || this.lowPowerMode) {
			return;
		}
		Flip.from(state, {
			duration: options.duration,
			ease: options.ease,
			stagger: options.stagger,
			absolute: true,
			prune: true,
		});
	}

	private getRankingRowElements(listSelector: string): HTMLElement[] {
		const list = this.renderRoot.querySelector<HTMLElement>(listSelector);
		if (!list) {
			return [];
		}
		return Array.from(list.querySelectorAll<HTMLElement>('[data-ranking-row]'));
	}

	private onScroll(): void {
		if (!this.heroSection) {
			return;
		}
		const heroBounds = this.heroSection.getBoundingClientRect();
		this.stickyCtaVisible = heroBounds.bottom < window.innerHeight * 0.32;
		const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
		const progress = window.scrollY / maxScroll;
		this.particleField?.setScrollProgress(progress);
	}

	private onResize(): void {
		this.particleField?.resize();
		this.onScroll();
	}

	private triggerBurstAtElement(selector: string, strength: number): void {
		const element = this.renderRoot.querySelector<HTMLElement>(selector);
		if (!element) {
			return;
		}
		const bounds = element.getBoundingClientRect();
		this.particleField?.triggerBurst({
			x: bounds.left + bounds.width * 0.5,
			y: bounds.top + bounds.height * 0.3,
			strength,
		});
	}

	private randomBetween(minimum: number, maximum: number): number {
		return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-web-landing': RkWebLanding;
	}
}

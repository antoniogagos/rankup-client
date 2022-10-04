import { contextProvided } from '@lit-labs/context';
import { routerContext, RoutesController } from '@rankup/common/contexts/main-router-context.js';
import { SessionManagerConsumer } from '@rankup/common/contexts/session-manager-context.js';
import { msg } from '@rankup/common/i18n/localize.js';
import { arrowRightIcon } from '@rankup/samba/icons.js';
import buttonsStyles from '@rankup/samba/styles/buttons-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('pp-welcome-page')
export class PpWelcomePage extends LitElement {
	sessionManager = new SessionManagerConsumer(this, () => this.requestUpdate(), {
		'session-updated': () => this.requestUpdate(),
	});

	@contextProvided({ context: routerContext })
	router!: RoutesController;

	render() {
		const playNowLink = this.sessionManager.value?.isLogged
			? this.router.link('my-contests')
			: this.router.link('sign-in');
		return html`
			<div class="main">
				<img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />
				<span class="title">Rankup</span>
				<p>${msg('Juega contra tus amigos prediciendo los resultados')}</p>
				<a class="btn btn--primary btn--lg" href=${playNowLink}>
					${msg('Jugar ya')} ${arrowRightIcon}
				</a>
			</div>
			<picture>
				<source type="image/avif" srcset="/assets/images/ball-bg.avif" />
				<img src="/assets/images/ball-bg.webp" alt="Goal" />
			</picture>
		`;
	}

	static styles = [
		buttonsStyles,
		css`
			.main {
				align-items: center;
				background: var(--color-landing-bg);
				color: var(--color-landing-text);
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: center;
				position: absolute;
				width: 100%;
				z-index: 2;
			}

			.title {
				font-size: 3.5rem;
				font-weight: bold;
				margin: 1.4rem;
			}

			.main p {
				font-size: 1.8rem;
				max-width: 26rem;
				margin: 0;
				text-align: center;
			}

			.btn {
				position: absolute;
				bottom: 10vh;
			}

			.logo {
				filter: invert(100%);
			}

			picture img {
				height: 100%;
				left: 0;
				object-fit: cover;
				overflow: hidden;
				pointer-events: none;
				position: absolute;
				top: 0;
				width: 100%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'pp-welcome-page': PpWelcomePage;
	}
}

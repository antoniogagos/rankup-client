import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import buttonStyles from 'samba/styles/button-css.js';
import formControlStyles from 'samba/styles/form-control-css.js';
import linkStyles from 'samba/styles/link-css.js';

import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';

@customElement('rk-signin-page')
export class RkSignInPage extends LitElement {
	@property({ type: Boolean })
	_showPassword = false;

	@query('#email')
	emailInput!: HTMLInputElement;

	@query('#currentPassword')
	passwordInput!: HTMLInputElement;

	@query('form')
	form!: HTMLInputElement;

	private _togglePasswordVisibility() {
		this._showPassword = !this._showPassword;
	}

	private _onGoogleSignInClick() {
		rkPublicApp.sessionManager!.signInWithOAuth('Google');
	}

	private _onFormSubmit(evt: FormDataEvent) {
		evt.preventDefault();
		const form = evt.target as HTMLFormElement;
		if (form.checkValidity()) {
			const email = this.emailInput.value;
			const password = this.passwordInput.value;
			this._signIn(email, password);
		} else {
			form.reportValidity();
		}
	}

	private _onFormInput() {
		this.passwordInput.setCustomValidity('');
	}

	async _signIn(email: string, password: string) {
		try {
			await rkPublicApp.sessionManager!.signInWithPassword({ email, password });
		} catch (error: any) {
			if (error?.name === 'NotAuthorizedException' || error?.name === 'UserNotFoundException') {
				this.passwordInput.setCustomValidity(msg('Email o contraseña inválidos'));
				this.form.reportValidity();
			}
		}
	}

	render() {
		return html`
			<img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />
			<form @submit=${this._onFormSubmit} @input=${this._onFormInput}>
				<section>
					<div class="input-wrapper">
						${Icons('email-open', 24)}
						<input
							id="email"
							name="email"
							placeholder="Email"
							type="email"
							class="form-control"
							autocomplete="email"
							required />
					</div>
				</section>

				<section>
					<div class="input-wrapper">
						${Icons('privacy', 24)}
						<input
							class="form-control"
							id="currentPassword"
							name="current-password"
							placeholder=${msg('Contraseña')}
							type=${this._showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							aria-describedby="password-constraints"
							required />
						<button
							id="togglePassword"
							@click=${this._togglePasswordVisibility}
							type="button"
							aria-label=${this._showPassword
								? 'Hide password'
								: 'Show password as plain text. Warning: this will display your password on the screen.'}>
							${Icons(`${this._showPassword ? 'eye-hide' : 'eye'}`, 24)}
						</button>
					</div>
				</section>

				<a class="link--primary forgot-password-link" href=${path('FORGOT_PASSWORD')}>
					${msg('Olvidaste la contraseña?')}
				</a>

				<button class="btn--primary" id="signInButton">
					${msg('Iniciar sesión')} ${Icons('arrow-right', 16)}
				</button>
			</form>

			<div class="divisor">
				<div class="cross"></div>
				<div class="divisor-text">${msg('o continua con')}</div>
			</div>

			<button id="googleBtn" @click=${this._onGoogleSignInClick}>${Icons('google', 48)}</button>

			<footer>
				${msg('¿No tienes una cuenta?')}
				<a class="link--primary" href=${path('SIGNUP')}>${msg('Crea una')}</a>
			</footer>
		`;
	}

	static styles = [
		linkStyles,
		formControlStyles,
		buttonStyles,
		css`
			:host {
				align-items: center;
				background: var(--color-canvas-default);
				color: var(--color-fg-default);
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: center;
			}
			form {
				margin-top: 4rem;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				max-width: 500px;
				padding: 0 20px;
				width: 100%;
			}
			form section {
				margin: 0.8rem 0;
			}
			footer {
				position: absolute;
				bottom: 50px;
				font-size: 1.5rem;
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}
			footer a {
				text-decoration: underline;
			}
			#togglePassword {
				align-items: center;
				background: none;
				border: none;
				bottom: 0;
				display: flex;
				left: auto;
				margin: auto;
				position: absolute;
				right: 20px;
				top: 0;
			}
			#signInButton {
				margin: 4rem auto;
				white-space: nowrap;
				width: fit-content;
			}
			.logo {
				margin-top: -2rem;
			}
			.divisor {
				margin: 3.5rem;
				max-width: 500px;
				position: relative;
				text-align: center;
				width: 100%;
			}
			.divisor-text {
				background: var(--color-canvas-default);
				color: var(--color-fg-subtle);
				font-size: 15px;
				left: 0px;
				margin: -1rem auto;
				padding: 0 20px;
				position: absolute;
				right: 0px;
				text-align: center;
				width: fit-content;
				z-index: 2;
			}
			.cross {
				background: var(--color-canvas-subtle);
				height: 3px;
				position: absolute;
				top: 0;
				width: 100%;
			}
			.input-wrapper {
				position: relative;
			}
			.input-wrapper > svg {
				bottom: 0;
				left: 20px;
				margin: auto;
				position: absolute;
				top: 0;
			}
			.forgot-password-link {
				margin-left: auto;
				margin-top: 0.6rem;
				width: fit-content;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-signin-page': RkSignInPage;
	}
}

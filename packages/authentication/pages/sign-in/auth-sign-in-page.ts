import { localizePath, msg } from '@rankup/common/i18n/localize.js';
import {
	arrowRightIcon,
	emailOpenIcon,
	eyeHideIcon,
	eyeIcon,
	googleIcon,
	privacyIcon,
} from '@rankup/samba/icons.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import formControlStyles from '@rankup/samba/styles/form-control-css.js';
import linkStyles from '@rankup/samba/styles/link-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('auth-sign-in-page')
export class AuthSignInPage extends LitElement {
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
		appShell.sessionManager!.signInWithOAuth('Google');
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
			await appShell.sessionManager!.signInWithPassword({ email, password });
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
						${emailOpenIcon}
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
						${privacyIcon}
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
							${this._showPassword ? eyeHideIcon : eyeIcon}
						</button>
					</div>
				</section>

				<a class="link--primary forgot-password-link" href=${localizePath('/recuperar-contraseña')}>
					${msg('Olvidaste la contraseña?')}
				</a>

				<button class="btn--primary" id="signInButton">
					${msg('Iniciar sesión')} ${arrowRightIcon}
				</button>
			</form>

			<div class="divisor">
				<div class="cross"></div>
				<div class="divisor-text">${msg('o continua con')}</div>
			</div>

			<button id="googleBtn" class="btn" @click=${this._onGoogleSignInClick}>${googleIcon}</button>

			<footer>
				${msg('¿No tienes una cuenta?')}
				<a class="link--primary" href=${localizePath('/registro')}>${msg('Crea una')}</a>
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
		'auth-sign-in-page': AuthSignInPage;
	}
}

import { localizePath, msg } from '@rankup/common/i18n/localize';
import {
	arrowRightIcon,
	emailOpenIcon,
	eyeHideIcon,
	eyeIcon,
	privacyIcon,
	usernameIcon,
} from '@rankup/samba/icons.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import formControlStyles from '@rankup/samba/styles/form-control-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('auth-sign-up-page')
export class AuthSignUpPage extends LitElement {
	@property({ type: Boolean })
	_showPassword = false;

	@query('form')
	form!: HTMLFormElement;

	@query('#username')
	usernameInput!: HTMLInputElement;

	@query('#password')
	passwordInput!: HTMLInputElement;

	@query('#repeatedPassword')
	passwordRepeatInput!: HTMLInputElement;

	@query('#email')
	emailInput!: HTMLInputElement;

	@query('#signInButton')
	signInButton!: HTMLInputElement;

	togglePassword() {
		this._showPassword = !this._showPassword;
	}

	private _onFormInput() {
		this.passwordInput.setCustomValidity('');
		this.passwordRepeatInput.setCustomValidity('');
		this.emailInput.setCustomValidity('');
	}

	private _onFormSubmit(evt: FormDataEvent) {
		evt.preventDefault();
		const password = this.passwordInput.value;
		const repeatedPassword = this.passwordRepeatInput.value;
		this.passwordInput.setCustomValidity('');
		this.passwordRepeatInput.setCustomValidity('');
		if (password !== repeatedPassword) {
			this.passwordRepeatInput.setCustomValidity(msg("Passwords doesn't match"));
			this.form.reportValidity();
		} else if (this.form.checkValidity()) {
			const email = this.emailInput.value;
			const username = this.usernameInput.value;
			this._signUp(email, password, username);
		} else {
			this.form.reportValidity();
		}
	}

	private async _signUp(email: string, password: string, username: string) {
		try {
			this.signInButton.disabled = true;
			await appShell.sessionManager!.signUpWithPassword({
				email,
				password,
				username,
			});
			appShell.redirect(msg('/confirmar-registro'), { email });
		} catch (error: any) {
			if (error?.name === 'UsernameExistsException') {
				this.emailInput.setCustomValidity(msg('An account with this email already exists'));
				this.form.reportValidity();
			} else if (error?.name === 'InvalidPasswordException') {
				if (error?.message?.match('uppercase')) {
					this.passwordInput.setCustomValidity(msg('Password must have uppercase characters'));
				} else if (error?.message?.match('not long enough')) {
					this.passwordInput.setCustomValidity(msg('Password must have at least 6 characters'));
				} else if (error?.message?.match('numeric characters')) {
					this.passwordInput.setCustomValidity(msg('Password must have numeric characters'));
				} else {
					this.passwordInput.setCustomValidity(msg(error.message));
				}
				this.form.reportValidity();
			}
		} finally {
			this.signInButton.disabled = false;
		}
	}

	render() {
		return html`
			<img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />

			<form action="#" method="post" @submit=${this._onFormSubmit} @input=${this._onFormInput}>
				<section>
					<div class="input-wrapper">
						${usernameIcon}
						<input
							class="form-control"
							id="username"
							name="username"
							placeholder=${msg('Nombre de usuario')}
							type="text"
							autocomplete="username"
							required />
					</div>
				</section>

				<section>
					<div class="input-wrapper">
						${emailOpenIcon}
						<input
							class="form-control"
							id="email"
							name="email"
							placeholder="Email"
							type="email"
							autocomplete="email"
							required />
					</div>
				</section>

				<section>
					<div class="input-wrapper">
						${privacyIcon}
						<input
							class="form-control"
							id="password"
							name="password"
							placeholder=${msg('Contraseña')}
							type=${this._showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							aria-describedby="password-constraints"
							required />
						<button
							id="togglePassword"
							@click=${this.togglePassword}
							type="button"
							tabindex="-1"
							aria-label=${this._showPassword
								? 'Hide password'
								: 'Show password as plain text. Warning: this will display your password on the screen.'}>
							${this._showPassword ? eyeHideIcon : eyeIcon}
						</button>
					</div>
				</section>

				<section>
					<div class="input-wrapper">
						${privacyIcon}
						<input
							class="form-control"
							id="repeatedPassword"
							name="password"
							placeholder=${msg('Confirmar contraseña')}
							type=${this._showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							aria-describedby="password-constraints"
							required />
					</div>
				</section>

				<button class="btn btr--primary btn--md" id="signInButton">
					${msg('Crear cuenta')} ${arrowRightIcon}
				</button>
			</form>

			<footer>
				${msg('¿Ya tienes cuenta?')}
				<a href=${localizePath(msg('iniciar-sesion'))}>${msg('Inicia sesión')}</a>
			</footer>
		`;
	}

	static styles = [
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
			}
			footer a {
				color: var(--color-text-link);
				text-decoration: underline;
			}
			#signInButton {
				margin: 4rem auto;
				white-space: nowrap;
				width: fit-content;
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
			.logo {
				margin-top: -2rem;
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
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'auth-sign-up-page': AuthSignUpPage;
	}
}

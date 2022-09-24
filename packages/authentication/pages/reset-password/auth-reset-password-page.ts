import { localizePath, msg } from '@rankup/common/i18n/localize';
import {
	arrowLeftIcon,
	arrowRightIcon,
	emailOpenIcon,
	eyeHideIcon,
	eyeIcon,
	privacyIcon,
} from '@rankup/samba/icons.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import formControlStyles from '@rankup/samba/styles/form-control-css.js';
import linkStyles from '@rankup/samba/styles/link-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('auth-reset-password-page')
export class AuthResetPasswordPage extends LitElement {
	@property({ type: Boolean })
	showPassword = false;

	@property({ type: String })
	codeFromURL?: string;

	@property({ type: String })
	emailFromURL?: string;

	@query('#verificationCode')
	verificationCodeInput!: HTMLInputElement;

	@query('#email')
	emailInput!: HTMLInputElement;

	@query('#password')
	passwordInput!: HTMLInputElement;

	@query('form')
	form!: HTMLInputElement;

	private _hidden = false;

	private _showPassword = false;

	set hidden(val: boolean) {
		this._hidden = val;
		if (!val && this.codeFromURL === null) {
			this._processEmailAndCodeFromURL();
		}
	}

	@property({ type: Boolean })
	get hidden() {
		return this._hidden;
	}

	private _togglePassword() {
		this.showPassword = !this.showPassword;
	}

	private _onFormSubmit(evt: FormDataEvent) {
		evt.preventDefault();
		if (this.form.checkValidity()) {
			const email = this.emailInput.value;
			const verificationCode = this.verificationCodeInput.value;
			const password = this.passwordInput.value;
			this._resetPassword(email, verificationCode, password);
		} else {
			this.form.reportValidity();
		}
	}

	private _processEmailAndCodeFromURL() {
		const url = new URL(window.location.toString());
		this.emailFromURL ??= url.searchParams.get('email') ?? '';
		this.codeFromURL ??= url.searchParams.get('code') ?? '';
	}

	private async _resetPassword(email: string, verificationCode: string, newPassword: string) {
		try {
			const resp = await appShell.sessionManager!.confirmForgottenPassword(
				email,
				verificationCode,
				newPassword,
			);
			console.log('confirmed-change-pass', { resp });
		} catch (error: any) {
			this.passwordInput.setCustomValidity(error.message);
			this.form.reportValidity();
		}
	}

	render() {
		return html`
			<header>
				<a class="link--primary go-back-arrow" href=${localizePath(msg('iniciar-sesion'))}
					>${arrowLeftIcon}</a
				>
				<div>${msg('Restablecer contraseña')}</div>
			</header>
			<form @submit=${this._onFormSubmit}>
				<section ?hidden=${!!this.emailFromURL}>
					<div class="input-wrapper">
						${emailOpenIcon}
						<input
							class="form-control"
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder=${msg('Email')}
							required
							.value=${this.emailFromURL ?? ''} />
					</div>
				</section>

				<section ?hidden=${!!this.codeFromURL}>
					<div class="input-wrapper">
						${privacyIcon}
						<input
							class="form-control"
							id="verificationCode"
							name="verification-code"
							type="text"
							autocomplete="off"
							placeholder=${msg('Código recibido por email')}
							required
							.value=${this.codeFromURL ?? ''} />
					</div>
				</section>

				<section>
					<div class="input-wrapper">
						${privacyIcon}
						<input
							class="form-control"
							id="password"
							name="current-password"
							type=${this.showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							placeholder=${msg('Contraseña')}
							aria-describedby="password-constraints"
							required />
						<button
							tab-index="-1"
							id="togglePassword"
							@click=${this._togglePassword}
							type="button"
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
							id="repeatPassword"
							name="current-password"
							placeholder=${msg('Confirmar contraseña')}
							type=${this._showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							aria-describedby="password-constraints"
							required />
					</div>
				</section>
				<button class="btn--primary">${msg('Restablecer contraseña')} ${arrowRightIcon}</button>
			</form>
			<footer>
				${msg('¿No tienes una cuenta?')}
				<a class="link--primary" href=${localizePath(msg('/auth/sign-up'))}>${msg('Crea una')}</a>
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
			}
			header {
				align-items: center;
				box-sizing: border-box;
				display: flex;
				font-size: 1.6rem;
				justify-content: center;
				padding: 4rem;
				position: relative;
				width: 100%;
			}
			header a {
				position: absolute;
				left: 3rem;
			}
			footer {
				position: absolute;
				bottom: 50px;
				font-size: 1.5rem;
			}
			footer a {
				text-decoration: underline;
			}
			p {
				text-align: center;
				max-width: 275px;
				margin: 0 auto;
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
			button {
				width: fit-content;
				margin: 3rem auto;
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
			[hidden] {
				display: none !important;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'auth-reset-password-page': AuthResetPasswordPage;
	}
}

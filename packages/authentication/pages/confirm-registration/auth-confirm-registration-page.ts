import { contextProvided } from '@lit-labs/context';
import { routerContext, RoutesController } from '@rankup/common/contexts/main-router-context.js';
import {
	SessionManager,
	sessionManagerContext,
} from '@rankup/common/contexts/session-manager-context.js';
import { localizePath, msg } from '@rankup/common/i18n/localize.js';
import { arrowRightIcon, privacyIcon } from '@rankup/samba/icons.js';
import buttonsStyles from '@rankup/samba/styles/buttons-css.js';
import formControlCss from '@rankup/samba/styles/form-control-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('auth-confirm-registration-page')
export class AuthConfirmRegistrationPage extends LitElement {
	@contextProvided({ context: routerContext })
	router!: RoutesController;

	@contextProvided({ context: sessionManagerContext, subscribe: true })
	sessionManager!: SessionManager;

	@property({ type: Boolean })
	showPassword = false;

	@property({ type: Boolean })
	hidden = true;

	@query('#verificationCode')
	verificationCodeInput!: HTMLInputElement;

	@query('form')
	form!: HTMLInputElement;

	email?: string | null;

	code?: string | null;

	updated() {
		if (!this.hidden && this.code === null) {
			this._processEmailAndCodeFromURL();
		}
	}

	private _onFormInput() {
		this.verificationCodeInput.setCustomValidity('');
	}

	private _handleFormSubmit(evt: FormDataEvent) {
		evt.preventDefault();
		const form = evt.target as HTMLFormElement;
		const code = this.verificationCodeInput.value;
		if (form.checkValidity()) {
			this._confirmRegistration(this.email!, code);
		}
	}

	private _onResendCodeClicked(evt: MouseEvent) {
		evt.preventDefault();
		this._resendCode();
	}

	private async _confirmRegistration(email: string, code: string) {
		try {
			await this.sessionManager!.confirmRegistration(email, code);
			this.router.redirect(localizePath('/iniciar-sesion'));
		} catch (error: unknown) {
			if (error instanceof Error) {
				if (error.name === 'NotAuthorizedException' && error.message.match('status is CONFIRMED')) {
					// already confirmed, redirect to login page
					this.router.redirect(localizePath('/iniciar-sesion'));
					return;
				}
				this.verificationCodeInput.setCustomValidity(error.message);
				this.form.reportValidity();
			}
		}
	}

	private _processEmailAndCodeFromURL() {
		const url = new URL(window.location.toString());
		this.email ??= url.searchParams.get('email');
		this.code ??= url.searchParams.get('code') ?? '';
		if (this.email && this.code) {
			this._confirmRegistration(this.email, this.code);
		} else if (!this.email) {
			// request page change, since we can't do anything without an email
			this.router.redirect(localizePath('/registro'));
		}
	}

	private async _resendCode() {
		try {
			await this.sessionManager!.resendConfirmationCode(this.email!);
		} catch (error: unknown) {
			this.verificationCodeInput.setCustomValidity((error as Error).message);
			this.form.reportValidity();
		}
	}

	render() {
		return html`
			<img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />

			<form action="#" method="post" @submit=${this._handleFormSubmit} @input=${this._onFormInput}>
				<section>
					${msg('Se ha enviado un código a tu email. Introdúcelo abajo para confirmar tu cuenta.')}
				</section>

				<section>
					<div class="input-wrapper">
						${privacyIcon}
						<input
							class="form-control"
							id="verificationCode"
							name="verification-code"
							placeholder=${msg('Código de verificación')}
							type="text"
							autocomplete="off"
							.value=${this.code ?? ''}
							required />
					</div>
				</section>

				<button class="btn btr--primary btn--md" id="signinButton">
					${msg('Confirmar Registro')} ${arrowRightIcon}
				</button>

				<section>
					¿No lo recibiste?
					<a href="#" @click=${this._onResendCodeClicked}>Reenviar código</a>
				</section>
			</form>

			<footer>
				${msg('¿Ya tienes cuenta?')}
				<a href=${this.router.link('sign-in')}>${msg('Inicia sesión')}</a>
			</footer>
		`;
	}

	static styles = [
		formControlCss,
		buttonsStyles,
		css`
			:host {
				align-items: center;
				background: var(--color-canvas-default);
				color: var(--color-fg-default);
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			form {
				margin-top: 4rem;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				max-width: 50rem;
				padding: 0 2rem;
				width: 100%;
			}
			form section {
				margin: 0.8rem 0;
			}
			footer {
				position: absolute;
				bottom: 5rem;
				font-size: 1.5rem;
			}
			footer a {
				color: var(--color-text-link);
				text-decoration: underline;
			}
			#signinButton {
				margin: 4rem auto;
				white-space: nowrap;
				width: fit-content;
			}
			.input-wrapper {
				position: relative;
			}
			.input-wrapper > svg {
				bottom: 0;
				left: 2rem;
				margin: auto;
				position: absolute;
				top: 0;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'auth-confirm-registration-page': AuthConfirmRegistrationPage;
	}
}

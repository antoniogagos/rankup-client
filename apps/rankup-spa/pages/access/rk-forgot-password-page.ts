import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';
import { msg, str } from '@lit/localize';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';
import buttonStyles from '@rankup/samba/styles/button.css';
import formControlStyles from '@rankup/samba/styles/form-control.css';
import linkStyles from '@rankup/samba/styles/link.css';
import resetStyles from '@rankup/samba/styles/reset.css';
import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

@customElement('rk-forgot-password-page')
export class RkForgotPasswordPage extends LitElement {
	@state() private _sent = false;

	@state() private _loading = false;

	@service(ISessionManager) private readonly _sessionManager!: ISessionManager;

	@query('form') private declare _form: HTMLFormElement;

	@query('#email') private declare _emailInput: HTMLInputElement;

	private _onFormSubmit(evt: FormDataEvent) {
		evt.preventDefault();
		if (this._form.checkValidity()) {
			const email = this._emailInput.value;
			this._forgotPassword(email);
		}
	}

	private async _forgotPassword(email: string) {
		try {
			this._loading = true;
			await this._sessionManager.forgotPassword(email);
		} finally {
			this._loading = false;
			this._sent = true;
		}
	}

	private _formRender() {
		return html`
			<p>${msg('Introduce el email con el que te registraste en Rankup para recuperar la contraseña', { id: 'apps.rankup.spa.pages.access.rk.forgot.password.page.msg.l46c9' })}</p>

			<form @submit=${this._onFormSubmit}>
				<section>
					<div class="input-wrapper">
						${Icons('email-open', 24)}
						<input id="email" name="email" placeholder="Email" type="email" class="form-control" autocomplete="email" required />
					</div>
				</section>
				<button class="btn--primary" ?disabled=${this._loading}>${msg('Restablecer contraseña', { id: 'apps.rankup.spa.pages.access.rk.forgot.password.page.msg.l55c63' })} ${Icons('arrow-right', 16)}</button>
			</form>
		`;
	}

	private _sentRender() {
		return html` <p>${msg(str`Se ha enviado un email a ${this._emailInput.value}. Revisa tu correo para continuar con el proceso.`, { id: 'apps.rankup.spa.pages.access.rk.forgot.password.page.msg.l61c21' })}</p> `;
	}

	override render() {
		return html`
			<header>
				<a class="link--primary go-back-arrow" href=${path('SIGNIN')}>${Icons('arrow-left', 16)}</a>
				<div>${msg('Recordar contraseña', { id: 'apps.rankup.spa.pages.access.rk.forgot.password.page.msg.l68c12' })}</div>
			</header>

			${choose(this._sent, [
				[false, this._formRender.bind(this)],
				[true, this._sentRender.bind(this)],
			])}

			<footer>
				${msg('¿No tienes una cuenta?', { id: 'apps.rankup.spa.pages.access.rk.forgot.password.page.msg.l77c7' })}
				<a class="link--primary" href=${path('SIGNUP')}>${msg('Crea una', { id: 'apps.rankup.spa.pages.access.rk.forgot.password.page.msg.l78c55' })}</a>
			</footer>
		`;
	}

	static override styles = [
		resetStyles,
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
		progress-bar {
			width: 100%;
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
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-forgot-password-page': RkForgotPasswordPage;
	}
}

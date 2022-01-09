import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';
import { property, query, state } from 'lit/decorators.js';
// @ts-ignore
import formControlStyles from '/samba/styles/form-control.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };

export class RkConfirmRegistrationPage extends LitElement {
  @property({ type: Boolean })
  showPassword = false;

  @property({ type: Boolean })
  hidden = true;

  @query('#verificationCode')
  vertificationCodeInput: HTMLInputElement;

  @query('form')
  form: HTMLInputElement;

  email: string;

  code: string = null;

  updated() {
    if (!this.hidden && this.code === null) {
      this._processEmailAndCodeFromURL();
    }
  }

  private _onFormInput() {
    this.vertificationCodeInput.setCustomValidity('');
  }

  private _handleFormSubmit(evt: FormDataEvent) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const code = this.vertificationCodeInput.value;
    if (form.checkValidity()) {
      this._confirmRegistration(this.email, code);
    }
  }

  private _onResendCodeClicked(evt: MouseEvent) {
    evt.preventDefault();
    this._resendCode();
  }

  private async _confirmRegistration(email: string, code: string) {
    try {
      await rkPublicApp.sessionManager.confirmRegistration(email, code);
      rkPublicApp.redirectToPage('SIGNIN');
    } catch (err: any) {
      if (err?.name === 'NotAuthorizedException') {
        if (err?.message.match('status is CONFIRMED')) {
          // already confirmed, redirect to login page
          rkPublicApp.redirectToPage('SIGNIN');
          return;
        }
      }
      this.vertificationCodeInput.setCustomValidity(err.message);
      this.form.reportValidity();
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
      rkPublicApp.redirectToPage('SIGNUP');
    }
  }

  private async _resendCode() {
    try {
      await rkPublicApp.sessionManager.resendConfirmationCode(this.email);
    } catch (err: any) {
      this.vertificationCodeInput.setCustomValidity(err.message);
      this.form.reportValidity();
    }
  }

  render() {
    return html`
      <img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />

      <form action="#" method="POST" @submit=${this._handleFormSubmit} @input=${this._onFormInput}>
        <section>
          ${msg('Se ha enviado un código a tu email. Introdúcelo abajo para confirmar tu cuenta.')}
        </section>

        <section>
          <div class="input-wrapper">
            ${Icons('privacy', 24)}
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
          ${msg('Confirmar Registro')} ${Icons('arrow-right', 16)}
        </button>

        <section>
          ¿No lo recibiste?
          <a href="#" @click=${this._onResendCodeClicked}>Reenviar código</a>
        </section>
      </form>

      <footer>
        ${msg('¿Ya tienes cuenta?')}
        <a href=${path('SIGNIN')}>${msg('Inicia sesión')}</a>
      </footer>
    `;
  }

  static styles = [
    resetStyles,
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
      #signinButton {
        margin: 4rem auto;
        white-space: nowrap;
        width: fit-content;
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

customElements.define('rk-confirm-registration-page', RkConfirmRegistrationPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-confirm-registration-page': RkConfirmRegistrationPage;
  }
}

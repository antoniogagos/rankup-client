import { msg, str } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import buttonStyles from 'samba/styles/button.css' assert { type: 'css' };
import formControlStyles from 'samba/styles/form-control.css' assert { type: 'css' };
import linkStyles from 'samba/styles/link.css' assert { type: 'css' };
import resetStyles from 'samba/styles/reset.css' assert { type: 'css' };

import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';

@customElement('rk-forgot-password-page')
export class RkForgotPasswordPage extends LitElement {
  @state()
  private _sent = false;

  @state()
  private _loading = false;

  @query('form')
  private _form!: HTMLInputElement;

  @query('#email')
  private _emailInput!: HTMLInputElement;

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
      await rkPublicApp.sessionManager!.forgotPassword(email);
    } finally {
      this._loading = false;
      this._sent = true;
    }
  }

  private _formRender() {
    return html`
      <p>
        ${msg(
          'Introduce el email con el que te registraste en Rankup para recuperar la contraseña',
        )}
      </p>

      <form @submit=${this._onFormSubmit}>
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
        <button class="btn--primary">
          ${msg('Restablecer contraseña')} ${Icons('arrow-right', 16)}
        </button>
      </form>
    `;
  }

  private _sentRender() {
    return html`
      <p>
        ${msg(
          str`Se ha enviado un email a ${this._emailInput.value}. Revisa tu correo para continuar con el proceso.`,
        )}
      </p>
    `;
  }

  render() {
    return html`
      <header>
        <a class="link--primary go-back-arrow" href=${path('SIGNIN')}>${Icons('arrow-left', 16)}</a>
        <div>${msg('Recordar contraseña')}</div>
      </header>

      ${choose(this._sent, [
        [false, this._formRender.bind(this)],
        [true, this._sentRender.bind(this)],
      ])}

      <footer>
        ${msg('¿No tienes una cuenta?')}
        <a class="link--primary" href=${path('SIGNUP')}>${msg('Crea una')}</a>
      </footer>
    `;
  }

  static styles = [
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-forgot-password-page': RkForgotPasswordPage;
  }
}

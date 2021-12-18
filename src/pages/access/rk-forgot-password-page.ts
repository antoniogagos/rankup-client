import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';
// @ts-ignore
import formControlStyles from '/samba/styles/form-control.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import linkStyles from '/samba/styles/link.css' assert { type: 'css' };

export class RkForgotPasswordPage extends LitElement {
  handleFormSubmit(evt: FormDataEvent) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    if (form.checkValidity() === false) {
      console.log('Invalid');
    } else {
      evt.preventDefault();
    }
  }

  render() {
    return html`
      <header>
        <a class="link--primary go-back-arrow" href=${path('SIGNIN')}>${Icons('arrow-left', 16)}</a>
        <div>${msg('Recordar contraseña')}</div>
      </header>
      <p>
        ${msg(
          'Introduce el email con el que te registraste en Rankup para recuperar la contraseña',
        )}
      </p>
      <form @submit=${this.handleFormSubmit}>
        <section>
          <!-- <label for="email">Email</label> -->
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

customElements.define('rk-forgot-password-page', RkForgotPasswordPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-forgot-password-page': RkForgotPasswordPage;
  }
}

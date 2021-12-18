import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property } from 'lit/decorators.js';
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

export class RkResetPasswordPage extends LitElement {
  @property({ type: Boolean })
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

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
        <div>${msg('Restablecer contraseña')}</div>
      </header>
      <form @submit=${this.handleFormSubmit}>
        <section>
          <!-- <label for="current-password">Password</label> -->
          <div class="input-wrapper">
            ${Icons('privacy', 24)}
            <input
              class="form-control"
              id="current-password"
              name="current-password"
              placeholder=${msg('Contraseña')}
              type=${this.showPassword ? 'text' : 'password'}
              autocomplete="current-password"
              aria-describedby="password-constraints"
              required />
            <button
              tab-index="-1"
              id="toggle-password"
              @click=${this.togglePassword}
              type="button"
              aria-label=${this.showPassword
                ? 'Hide password'
                : 'Show password as plain text. Warning: this will display your password on the screen.'}>
              ${Icons(`${this.showPassword ? 'eye-hide' : 'eye'}`, 24)}
            </button>
          </div>
        </section>
        <section>
          <!-- <label for="current-password">Password</label> -->
          <div class="input-wrapper">
            ${Icons('privacy', 24)}
            <input
              class="form-control"
              id="current-password"
              name="current-password"
              placeholder=${msg('Confirmar contraseña')}
              type=${this.showPassword ? 'text' : 'password'}
              autocomplete="current-password"
              aria-describedby="password-constraints"
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
      #toggle-password {
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
    `,
  ];
}

customElements.define('rk-reset-password-page', RkResetPasswordPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-reset-password-page': RkResetPasswordPage;
  }
}

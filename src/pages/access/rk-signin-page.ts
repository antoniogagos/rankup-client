import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';
import { property } from 'lit/decorators.js';
// @ts-ignore
import inputStyles from '/samba/styles/input.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };

export class RkSignInPage extends LitElement {
  @property({ type: Boolean })
  showPassword = false;

  googleSignInClick() {
    rkPublicApp.sessionManager.signIn({ provider: 'google' });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleFormSubmit(evt: FormDataEvent) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    console.log('submit');
    if (form.checkValidity() === false) {
      console.log('not valid');
    } else {
      console.log('Signing in!');
    }
  }

  render() {
    return html`
      <img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />
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
              class="btn"
              autocomplete="email"
              required />
          </div>
        </section>
        <section>
          <!-- <label for="current-password">Password</label> -->
          <div class="input-wrapper">
            ${Icons('privacy', 24)}
            <input
              class="btn"
              id="current-password"
              name="current-password"
              placeholder=${msg('Contraseña')}
              type=${this.showPassword ? 'text' : 'password'}
              autocomplete="current-password"
              aria-describedby="password-constraints"
              required />
            <button
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
        <a class="forgot-password-link" href=${path('FORGOT_PASSWORD')}>
          ${msg('Olvidaste la contraseña?')}
        </a>
        <button class="btn" id="signinButton">
          ${msg('Iniciar sesión')} ${Icons('arrow-right', 16)}
        </button>
      </form>
      <div class="divisor">
        <div class="cross"></div>
        <div class="divisor-text">${msg('o continua con')}</div>
      </div>
      <button @click=${this.googleSignInClick}>${Icons('google', 48)}</button>
      <footer>
        ${msg('¿No tienes una cuenta?')}
        <a href=${path('SIGNUP')}>${msg('Crea una')}</a>
      </footer>
    `;
  }

  static styles = [
    resetStyles,
    inputStyles,
    buttonStyles,
    css`
      :host {
        align-items: center;
        background: var(--color-bg-doc);
        color: var(--color-text-primary);
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
      #google-button {
        margin-top: 0.5rem;
      }
      #signinButton {
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
        background: var(--color-bg-doc);
        color: var(--color-text-placeholder);
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
        background: var(--color-bg-primary);
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
        color: var(--color-text-secondary);
        margin-left: auto;
        margin-top: 0.6rem;
        width: fit-content;
      }
    `,
  ];
}

customElements.define('rk-signin-page', RkSignInPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-signin-page': RkSignInPage;
  }
}

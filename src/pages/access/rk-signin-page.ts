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

  togglePassword(evt: Event) {
    this.showPassword = !this.showPassword;
  }

  handleFormSubmit(evt: FormDataEvent) {
    const form = evt.target as HTMLFormElement;
    console.log('submit');
    if (form.checkValidity() === false) {
      console.log('not valid');
      evt.preventDefault();
    } else {
      alert('Signing in!');
      const signinButton = this.shadowRoot.querySelector('#signinButton') as HTMLButtonElement;
      signinButton.disabled = true;
      evt.preventDefault();
    }
  }

  render() {
    return html`
      <img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />
      <form action="#" method="POST" @submit=${this.handleFormSubmit}>
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
              autocomplete="username"
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
          ${msg('Iniciar sesión')} ${Icons('back-arrow', 16)}
        </button>
      </form>
      <div class="divisor">
        <div class="cross"></div>
        <div class="divisor-text">${msg('o continua con')}</div>
      </div>
      <button>${Icons('google', 18)}</button>
      <footer>
        ${msg('¿No tienes una cuenta?')}
        <a href=${path('SIGNUP')}>${msg('Crea una', { desc: 'Crear cuenta' })}</a>
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

      .logo {
        margin-top: -2rem;
      }

      .divisor {
        position: relative;
        width: 100%;
        max-width: 500px;
        text-align: center;
      }

      .divisor-text {
        background: var(--color-bg-doc);
        z-index: 2;
        color: var(--color-scale-gray-4);
        font-size: 15px;
        font-weight: bold;
        margin-top: -1rem;
        margin-bottom: 1rem;
        padding: 0 20px;
      }

      .cross {
        position: absolute;
        top: 0;
        height: 3px;
        background: var(--color-bg-primary);
        width: 100%;
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
        margin: 1.4rem 0;
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

      .alternative-services-container {
        text-align: center;
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

      .forgot-password-link {
        text-align: right;
        color: var(--color-text-secondary);
      }

      #signinButton {
        margin: 4rem auto;
        white-space: nowrap;
        width: fit-content;
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
    `,
  ];
}

customElements.define('rk-signin-page', RkSignInPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-signin-page': RkSignInPage;
  }
}

import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../unauthenticated-icons.js';
import { property, query } from 'lit/decorators.js';
// @ts-ignore
import formControlStyles from '/samba/styles/form-control.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };

export class RkSignUpPage extends LitElement {
  @property({ type: Boolean })
  showPassword = false;

  @query('form')
  form: HTMLFormElement;

  @query('#username')
  usernameInput: HTMLInputElement;

  @query('#password')
  passwordInput: HTMLInputElement;

  @query('#repeatedPassword')
  passwordRepeatInput: HTMLInputElement;

  @query('#email')
  emailInput: HTMLInputElement;

  @query('#signinButton')
  signinButton: HTMLInputElement;

  togglePassword() {
    this.showPassword = !this.showPassword;
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
      this.signinButton.disabled = true;
      await rkPublicApp.sessionManager.signUpWithPassword({
        email,
        password,
        username,
      });
      rkPublicApp.redirectToPage('CONFIRM_REGISTRATION', { email });
    } catch (err: any) {
      if (err?.name === 'UsernameExistsException') {
        this.emailInput.setCustomValidity(msg('An account with this email already exists'));
        this.form.reportValidity();
      } else if (err?.name === 'InvalidPasswordException') {
        if (err?.message?.match('uppercase')) {
          this.passwordInput.setCustomValidity(msg('Password must have uppercase characters'));
        } else if (err?.message?.match('not long enough')) {
          this.passwordInput.setCustomValidity(msg('Password must have at least 6 characters'));
        } else if (err?.message?.match('numeric characters')) {
          this.passwordInput.setCustomValidity(msg('Password must have numeric characters'));
        } else {
          this.passwordInput.setCustomValidity(msg(err.message));
        }
        this.form.reportValidity();
      }
    } finally {
      this.signinButton.disabled = false;
    }
  }

  render() {
    return html`
      <img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />

      <form action="#" method="POST" @submit=${this._onFormSubmit} @input=${this._onFormInput}>
        <section>
          <div class="input-wrapper">
            ${Icons('username', 24)}
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
            ${Icons('email-open', 24)}
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
            ${Icons('privacy', 24)}
            <input
              class="form-control"
              id="password"
              name="password"
              placeholder=${msg('Contraseña')}
              type=${this.showPassword ? 'text' : 'password'}
              autocomplete="current-password"
              aria-describedby="password-constraints"
              required />
            <button
              id="togglePassword"
              @click=${this.togglePassword}
              type="button"
              tabindex="-1"
              aria-label=${this.showPassword
                ? 'Hide password'
                : 'Show password as plain text. Warning: this will display your password on the screen.'}>
              ${Icons(`${this.showPassword ? 'eye-hide' : 'eye'}`, 24)}
            </button>
          </div>
        </section>

        <section>
          <div class="input-wrapper">
            ${Icons('privacy', 24)}
            <input
              class="form-control"
              id="repeatedPassword"
              name="password"
              placeholder=${msg('Confirmar contraseña')}
              type=${this.showPassword ? 'text' : 'password'}
              autocomplete="current-password"
              aria-describedby="password-constraints"
              required />
          </div>
        </section>

        <button class="btn btr--primary btn--md" id="signinButton">
          ${msg('Crear cuenta')} ${Icons('arrow-right', 16)}
        </button>
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

customElements.define('rk-signup-page', RkSignUpPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-signup-page': RkSignUpPage;
  }
}

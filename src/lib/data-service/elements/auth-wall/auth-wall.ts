import { AuthWall } from './authWall.js';

window.customElements.define('auth-wall', AuthWall);

declare global {
  interface HTMLElementTagNameMap {
    'auth-wall': AuthWall;
  }
}

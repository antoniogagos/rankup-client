import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit-labs/task';
import { Icons } from '../../authenticated-icons.js';
import { path, relativePath } from '../../lib/localization/rk-url-paths.js';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };

enum Tabs {
  RANKING = 1,
  MATCHDAY,
  CHAT,
}

export class RkTourneyFooter extends LitElement {
  @state()
  private _selectedTab = Tabs.MATCHDAY;

  private _tourneys = new Task(
    this,
    () => rkApp.ds.GetUserTourneys(),
    () => [null],
  );

  private _onTabClick(evt: MouseEvent) {
    if (evt.button === 0) {
      const name = (evt.target as HTMLAnchorElement).getAttribute('name');
      this._selectedTab = Number(name);
    }
  }

  private _onTabKeydown(evt: KeyboardEvent) {}

  render() {
    const staticPath = path('TOURNEY') + '/fj_rew';
    return html`
      <footer @click=${this._onTabClick} @keydown=${this._onTabKeydown}>
        <a
          href=${staticPath + relativePath('MATCHDAY')}
          class="header--item"
          name=${Tabs.MATCHDAY}
          ?selected=${this._selectedTab === Tabs.MATCHDAY}>
          <div class="item-icon">
            ${this._selectedTab === Tabs.MATCHDAY ? Icons('field-filled', 28) : Icons('field', 24)}
          </div>
        </a>
        <a
          href=${staticPath + relativePath('RANKING')}
          class="header--item"
          name=${Tabs.RANKING}
          ?selected=${this._selectedTab === Tabs.RANKING}>
          <div class="item-icon">
            ${this._selectedTab === Tabs.RANKING ? Icons('trophy-filled', 24) : Icons('trophy', 24)}
          </div>
        </a>
        <a
          href=${staticPath + relativePath('CHAT')}
          class="header--item"
          name=${Tabs.CHAT}
          ?selected=${this._selectedTab === Tabs.CHAT}>
          <div class="item-icon">
            ${this._selectedTab === Tabs.CHAT ? Icons('chat-filled', 24) : Icons('chat', 24)}
          </div>
        </a>
      </footer>
    `;
  }

  static styles = [
    resetStyles,
    buttonStyles,
    css`
      :host {
        display: block;
        z-index: 1;
        width: 100%;
        background: var(--color-footer-bg);
        color: var(--color-footer-text);
        font-weight: 600;
      }
      footer {
        border-top: 1px solid var(--color-border-subtle);
        max-width: 450px;
        margin: 0 auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        height: 5.6rem;
        font-size: 1.4rem;
      }
      .header--item {
        align-items: center;
        box-sizing: border-box;
        color: var(--color-footer-text);
        display: flex;
        flex-basis: 0;
        flex-direction: column;
        flex: 1 1 0;
        height: 100%;
        justify-content: space-between;
        padding: 0.5rem;
      }
      .header--item > * {
        pointer-events: none;
      }
      .header--item[selected] {
        color: green;
      }
      .header--item[selected] .item-icon {
        color: green;
      }
      .item-icon {
        align-items: center;
        color: var(--color-footer-icon);
        display: flex;
        height: 100%;
        justify-content: center;
        margin: 0 auto;
        max-width: 60px;
        width: 70%;
      }
    `,
  ];
}

customElements.define('rk-tourney-footer', RkTourneyFooter);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-footer': RkTourneyFooter;
  }
}

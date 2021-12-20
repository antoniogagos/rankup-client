import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit-labs/task';
import { Icons } from '../../authenticated-icons.js';
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
  private _selectedTab = Tabs.RANKING;

  private _tourneys = new Task(
    this,
    () => rkApp.ds.request.Tourneys.GetUserTourneys(),
    () => [null],
  );

  private _onTabClick(evt: MouseEvent) {
    if (evt.button === 0) {
      const name = (evt.target as HTMLAnchorElement).getAttribute('name');
      this._selectedTab = Number(name);
    }
  }

  render() {
    return html`
      <footer @click=${this._onTabClick}>
        <a
          class="header--item"
          name=${Tabs.RANKING}
          ?selected=${this._selectedTab === Tabs.RANKING}>
          <div class="item-icon">${Icons('tourney', 20)}</div>
          <span>${msg('Clasificación')}</span>
        </a>
        <a
          class="header--item"
          name=${Tabs.MATCHDAY}
          ?selected=${this._selectedTab === Tabs.MATCHDAY}>
          <div class="item-icon">${Icons('ball', 20)}</div>
          <span>${msg('Jornada')}</span>
        </a>
        <a class="header--item" name=${Tabs.CHAT} ?selected=${this._selectedTab === Tabs.CHAT}>
          <div class="item-icon">${Icons('chat', 20)}</div>
          <span>${msg('Chat')}</span>
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
      }
      footer {
        background: var(--color-footer-bg);
        box-shadow: var(--color-footer-shadow);
        box-sizing: border-box;
        color: var(--color-footer-text);
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
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
        padding-top: 0.8rem;
        padding: 0.6rem 2rem;
      }
      .header--item > * {
        pointer-events: none;
      }
      .header--item[selected] span {
        color: var(--color-footer-selected-text);
      }
      .header--item[selected] .item-icon {
        background-color: var(--color-footer-selected-bg-icon);
        border-radius: 20px;
        color: var(--color-footer-selected-icon);
      }
      .item-icon {
        align-items: center;
        color: var(--color-footer-icon);
        display: flex;
        height: 100%;
        justify-content: center;
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

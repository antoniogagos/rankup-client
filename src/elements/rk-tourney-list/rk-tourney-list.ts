import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit-labs/task';

import { Icons } from '../../unauthenticated-icons.js';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };

export class RkTourneyList extends LitElement {
  private _tourneys = new Task(
    this,
    () => rkApp.ds.request.Tourneys.GetUserTourneys(),
    () => [null],
  );

  render() {
    return html`
      <main>
        ${this._tourneys.render({
          pending: () => html``,
          complete: tourneys =>
            tourneys.map(
              tourney => html`
                ${tourney.competitionId}
              `,
            ),
        })}
      </main>
    `;
  }

  static styles = [
    resetStyles,
    buttonStyles,
    css`
      header {
        align-items: center;
        background: var(--color-header-bg);
        box-sizing: border-box;
        color: var(--color-header-text);
        display: flex;
        flex-direction: row;
        height: 70px;
        justify-content: space-between;
        padding: 20px;
        width: 100%;
        z-index: 2;
      }

      header section {
        display: flex;
        gap: 20px;
      }
    `,
  ];
}

customElements.define('rk-tourney-list', RkTourneyList);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-list': RkTourneyList;
  }
}

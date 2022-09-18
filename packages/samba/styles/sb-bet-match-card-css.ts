import { css } from 'lit';

export default css`
	.match-card {
		background-color: rgb(231, 237, 244);
		border-radius: 1.5rem;
		box-sizing: border-box;
		color: var(--color-fg-default);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 13rem;
		justify-content: space-between;
		margin: 0px auto;
		max-width: 450px;
		padding: 1rem 2rem;
		position: relative;
		width: 100%;
		user-select: none;
	}

	.card-header--right-content {
		align-items: center;
		display: flex;
		font-weight: 600;
		color: var(--color-attention-emphasis);
	}

	.card-header--right-content > div {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 0.4rem;
	}

	.match-card-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}

	.teams {
		align-items: center;
		display: flex;
		flex: 1 1 0%;
		gap: 1.5rem;
		justify-content: center;
		width: 100%;
	}

	.team {
		align-items: center;
		display: flex;
		flex: 1 1 0%;
		gap: 1rem;
		height: 100%;
		justify-content: space-between;
	}

	.team-name {
		font-weight: 700;
		font-size: 1.4rem;
	}

	.teams .away-team {
		text-align: right;
	}

	.bet-handler {
		align-items: center;
		display: grid;
		grid-template-rows: auto 30px auto;
		height: 100%;
	}

	.bet-input {
		background-color: var(--color-canvas-muted);
		border-radius: 20px;
		border: none;
		box-sizing: border-box;
		color: var(--color-fg-subtle);
		font-weight: 600;
		height: 35px;
		text-align: center;
		width: 35px;
		font-size: 1.8rem;
		cursor: default;
	}

	.bet-input:focus {
		outline: none;
	}

	.bet-input[type='number']::-webkit-inner-spin-button,
	.bet-input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.bet-input.win {
		color: var(--var-fg-default);
		background-color: #d1ecd3;
		/* color: #007b3f; */
	}

	.bet-input.draw {
		color: var(--var-fg-default);
		background-color: #d1e2ec;
		/* color: #35779c; */
	}

	.bet-input.lose {
		color: var(--var-fg-default);
		background-color: #ffdbdc;
		/* color: #c50000; */
	}

	.foot-note {
		color: var(--color-fg-subtle);
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 auto;
		margin-top: 1.25rem;
		max-width: 450px;
		padding: 0.2rem 0.5rem;
	}

	.foot-note > div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0rem 0.25rem;
	}

	.chevron-btn {
		display: flex;
		justify-content: center;
		color: var(--color-fg-muted);
	}

	#derbiLightningImg {
		height: 20px;
		width: 14px;
	}

	#derbiLightningImg.xs {
		height: 15px;
		width: 10px;
	}

	.offset-shadows > div {
		position: absolute;
		height: 6px;
		border-bottom-left-radius: 40px;
		border-bottom-right-radius: 40px;
		left: 0;
		right: 0;
		margin: auto;
	}

	.offset-shadows div:first-child {
		width: 90%;
		bottom: -5px;
		background: rgb(238, 242, 246);
	}

	.offset-shadows div:last-child {
		width: 70%;
		bottom: -10px;
		background: rgb(241, 245, 248);
	}
`;

/*
  <div class="match-card f6">
    <div class="match-card-header">
      <div>${new Intl.DateTimeFormat(['ban', 'id']).format(this.match.date)}</div>
      ${this.match.derbi
        ? html`
            <div class="card-header--right-content">${warningIcon} Derbi</div>
          `
        : ''}
    </div>
    <div class="teams">
      <div class="team home-team">
        <span class="team-name">Sevilla</span>
        <img width="42" height="42" src="/assets/teams/sevilla.png" alt="home logo" />
        <div class="bet-handler">
          <button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'home')}>
            ${chevronUpIcon}
          </button>
          <input
            min="0"
            step="1"
            value="0"
            type="number"
            class="bet-input ${homeBetInputClasses}"
            id="homeInput" />
          <button
            class="chevron-btn"
            @click=${() => this._onInputHandlerClick('subtract', 'home')}>
            ${chevronDownIcon}
          </button>
        </div>
      </div>
      ${this.match.derbi
        ? html`
            <img id="derbiLightningImg" src="/assets/images/lightning.svg" alt="Lightning" />
          `
        : ''}
      <div class="team away-team">
        <div class="bet-handler">
          <button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'away')}>
            ${chevronUpIcon}
          </button>
          <input
            min="0"
            step="1"
            value="0"
            type="number"
            class="bet-input ${awayBetInputClasses}"
            id="awayInput" />
          <button
            class="chevron-btn"
            @click=${() => this._onInputHandlerClick('subtract', 'away')}>
            ${chevronUpDown}
          </button>
        </div>
        <img width="42" height="42" src="/assets/teams/villareal.png" alt="away logo" />
        <span class="team-name">Villareal</span>
      </div>
    </div>
  </div>
  ${this.match.derbi
    ? html`
        <div class="foot-note">
          ${warningIcon} ¡Derbi! Bonus de +5 puntos al acertar resultado exacto
        </div>
      `
    : ''}
`;
*/

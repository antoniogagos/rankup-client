/*
<div class="contest-card" competitionId="premier">
  <img src="/assets/images/premier-league.svg" alt="Premier League logo" />
  <div class="contest-description">
    <div class="contest-name">Una de Premier</div>
    <span>${personIcon} 8</span>
  </div>
  <img src="/assets/images/silver-medal.svg" alt="Silver medal" />
  <div class="offset-shadows">
    <div></div>
    <div></div>
  </div>
</div>
*/

import { css } from 'lit';

export default css`
	.contest-card {
		background-color: var(--color-scale-gray-6);
		border-radius: 2rem;
		box-sizing: border-box;
		color: var(--color-fg-on-emphasis);
		display: grid;
		grid-column-gap: 1rem;
		grid-template-columns: max-content auto max-content;
		height: 12.4rem;
		max-height: 14.4rem;
		max-width: 44rem;
		padding: 2rem;
		position: relative;
		width: 90%;
		z-index: 1;
	}

	.contest-description {
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 0.5rem;
	}

	.offset-shadows > div {
		position: absolute;
		height: 1rem;
		border-bottom-left-radius: 4rem;
		border-bottom-right-radius: 4rem;
		left: 0;
		right: 0;
		margin: auto;
	}

	.offset-shadows div:first-child {
		width: 90%;
		bottom: -1rem;
	}

	.offset-shadows div:last-child {
		width: 75%;
		bottom: -2rem;
	}

	.contest-name {
		font-weight: bold;
		font-size: 1.6rem;
	}

	.contest-card[competitionId='laliga'] {
		background-color: #375cbf;
		background-image: url('/assets/patterns/laliga.svg');
		background-position: 50% 50%;
		background-size: cover;
	}

	.contest-card[competitionId='laliga'] .offset-shadows div:first-child {
		background: #cbd9ff;
	}

	.contest-card[competitionId='laliga'] .offset-shadows div:last-child {
		background: #e0e7ff;
	}

	.contest-card[competitionId='premier'] {
		background-image: url('/assets/patterns/premier-league.svg'),
			linear-gradient(to bottom right, #ff2882, #4c00a6);
		background-position: 50% 50%;
		background-size: cover;
	}

	.contest-card[competitionId='premier'] .offset-shadows div:first-child {
		background: #f8c8f1;
	}

	.contest-card[competitionId='premier'] .offset-shadows div:last-child {
		background: #ffe4fb;
	}

	.contest-card[competitionId='champions'] {
		background-image: url('/assets/patterns/champions-league.svg');
		background-position: 60% 22%;
		background-size: auto;
	}

	.contest-card[competitionId='champions'] .offset-shadows div:first-child {
		background: #8db1ed;
	}

	.contest-card[competitionId='champions'] .offset-shadows div:last-child {
		background: #d3e3fd;
	}
`;

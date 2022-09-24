import { css } from 'lit';

export default css`
	.page {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		overflow-y: auto;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	@keyframes RouterEntryLeft {
		from {
			transform: translateX(-3rem);
			opacity: 0;
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes RouterEntryOpacity {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes RouterExitRight {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			transform: translateX(180px);
			opacity: 0;
		}
	}

	[animation='slide'] {
		animation-name: RouterEntryLeft;
		animation-duration: 380ms;
		animation-timing-function: ease-out;
		animation-fill-mode: forwards;
	}

	[animation='opacity'] {
		animation-name: RouterEntryOpacity;
		animation-duration: 380ms;
		animation-timing-function: ease-out;
		animation-fill-mode: forwards;
	}

	[animation='exit'] {
		animation-name: RouterExitRight;
		animation-duration: 140ms;
		animation-timing-function: ease-in;
		animation-fill-mode: forwards;
	}
`;

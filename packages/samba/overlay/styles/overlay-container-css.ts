import { css } from 'lit';

export default css`
	:host {
		bottom: 0;
		left: 0;
		overflow: hidden;
		pointer-events: none;
		position: fixed;
		right: 0;
		top: 0;
	}
	#container {
		pointer-events: all;
		display: contents;
	}
	/* Backdrop */
	.backdrop {
		background: var(--overlays-backdrop-color, #1c375a29);
		height: 100%;
		pointer-events: all;
		position: fixed;
		width: 100%;
	}
	.backdrop.transparent {
		background: rgba(0, 0, 0, 0);
	}
`;

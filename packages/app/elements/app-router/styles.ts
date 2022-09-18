import { css } from 'lit';

export default css`
	app-router {
		display: contents;
		background: red;
	}

	@supports not (display: contents) {
		app-router {
			display: block;
			height: 100%;
		}
	}

	app-router > * {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		overflow-y: auto;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	app-router > [hidden] {
		display: none !important;
	}

	app-router__redirect {
		display: none;
	}
`;

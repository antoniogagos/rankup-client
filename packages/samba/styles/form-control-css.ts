import { css } from 'lit';

export default css`
	.input-contrast {
		background-color: var(--color-canvas-inset);
	}

	.form-control {
		/* border: 2px solid var(--color-border-default); */
		background: var(--color-canvas-inset);
		border-radius: 24px;
		border: 1px solid var(--color-border-subtle);
		box-shadow: var(--color-primer-shadow-inset);
		box-sizing: border-box;
		color: var(--color-fg-default);
		cursor: text;
		font-family: inherit;
		font-size: 1.6rem;
		height: 48px;
		padding: 0 55px;
		width: 100%;
		transition: box-shadow 300ms;
	}

	.form-control::placeholder {
		color: var(--color-text-placeholder);
		font-weight: 300;
	}

	.form-control:focus {
		background-color: var(--color-canvas-default);
		border-color: var(--color-accent-emphasis);
		box-shadow: var(--color-primer-shadow-focus);
		outline: none;
	}

	.form-control .form-text {
	}

	input:focus-visible {
		outline: none;
	}
`;

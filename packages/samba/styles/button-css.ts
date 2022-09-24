import { css } from 'lit';

export default css`
	button {
		outline-offset: 1px;
	}

	button {
		padding: 0;
		margin: 0;
		background: inherit;
		border: none;
		cursor: pointer;
		color: inherit;
	}

	.btn {
		align-items: center;
		background: var(--color-btn-bg);
		box-sizing: border-box;
		color: var(--color-btn-text);
		cursor: pointer;
		display: flex;
		width: fit-content;
		font-family: inherit;
		font-size: 1.6rem;
		font-weight: 600;
		gap: 1rem;
		pointer-events: all;
		transition: all 125ms;
		white-space: nowrap;
	}

	.btn--primary {
		border-radius: 2.4rem;
		border: 0.2rem solid var(--color-btn-border);
		box-shadow: var(--color-btn-shadow);
		justify-content: center;
		padding: 0.6rem 2rem;
	}

	.btn--xs {
		font-size: 1.4rem;
		min-height: 3.2rem;
	}

	.btn--s {
		font-size: 1.4rem;
		min-height: 4rem;
		min-width: 12rem;
	}

	.btn--md {
		font-size: 1.6rem;
		min-height: 4rem;
		min-width: 15.5rem;
	}

	.btn--lg {
		font-size: 1.8rem;
		min-height: 4.4rem;
		min-width: 17.5rem;
	}

	.btn--danger {
		color: var(--color-btn-danger-text);
	}

	.btn:hover {
		background-color: var(--color-btn-hover-bg);
	}

	.btn--primary:hover {
		border-color: var(--color-btn-hover-border);
	}

	.btn--danger:hover {
		color: var(--color-btn-danger-hover-text);
		border-color: var(--color-btn-danger-hover-border);
		background-color: var(--color-btn-danger-hover-bg);
	}

	a.btn {
		text-decoration: none;
	}
`;

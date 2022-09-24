import { css } from 'lit';

export default css`
	:host {
		background: var(--background-color-0);
		/* box-shadow: rgba(0, 0, 0, 0.23) 0px 1px 33px 0px; */
		box-shadow: rgba(0, 0, 0, 0.05) 0 1px 8px 0, rgba(0, 0, 0, 0.08) 0 0.5rem 2rem 0;
		border-radius: 11px;
		max-height: 750px;
		max-width: 70vw;
		padding: var(--overlay-padding);
		outline: 0;
		position: fixed;
		contain: layout style paint;
	}

	/*
:host([arrow-position="right"]) {
  box-shadow: rgba(60, 64, 67, 0.20) 3px 3px 11px 3px;
}
:host([arrow-position="bottom"]) {
  box-shadow: rgba(60, 64, 67, 0.20) 0px -3px 11px 3px;
}
:host([arrow-position="left"]) {
  box-shadow: rgba(60, 64, 67, 0.20) 3px 0px 11px 3px;
}
:host([arrow-position="top"]) {
}
*/

	:host([centered]) {
		margin: auto;
		left: 0;
		right: 0;
	}
`;

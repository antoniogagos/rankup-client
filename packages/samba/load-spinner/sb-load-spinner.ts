/* eslint-disable max-classes-per-file */
// import { observeProperties } from 'common/object-property-observer/object-property-observer.js';
// import type { PropertyValueMap, ReactiveController, ReactiveElement } from 'lit';
import { css, html, LitElement /* PropertyValues */ } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// class PropertiesObserver implements ReactiveController {
// 	constructor(
// 		public host: ReactiveElement,
// 		private callbacks: { [k: string]: (value: any, old: any) => void },
// 	) {
// 		if (host.nodeType !== Node.ELEMENT_NODE) throw new Error('InvalidHost');
// 		this.propertyNames = Object.keys(callbacks);
// 		console.log('created-', { callbacks });
// 		host.addController(this);
// 	}

// 	private propertyNames: string[] = [];

// 	hostConnected() {
// 		//
// 	}

// 	update(changedProperties: PropertyValues) {
// 		console.log('update-called', { changedProperties });
// 		for (const propName of this.propertyNames) {
// 			console.log({ propName, has: changedProperties.has(propName) });
// 			if (changedProperties.has(propName)) {
// 				const value = changedProperties.get(propName);
// 				const old = this[propName as keyof this];
// 				this.callbacks[propName](value, old);
// 			}
// 		}
// 	}
// }

@customElement('sb-load-spinner')
export class SbLoadSpinner extends LitElement {
	@property({ type: Boolean, reflect: true })
	active = true;

	@query('#spinnerContainer')
	foo!: HTMLDivElement;

	// static get properties() {
	// 	return {
	// 		active: { type: Boolean, reflect: true },
	// 	};
	// }

	// constructor() {
	// 	super();
	// 	// @ts-ignore
	// 	this.active = true;
	// }

	// private _propertiesObs = new PropertiesObserver(this, {
	// 	active: this.#activeChanged,
	// });

	// constructor() {
	//   super();
	// observeProperties(this, { active: this.#activeChanged });
	// }
	#coolingDown = false;

	connectedCallback() {
		super.connectedCallback?.();
	}

	protected firstUpdated() {
		console.log('first-updated', this.foo, this.shadowRoot?.querySelector('#spinnerContainer'));
	}

	// update(changedProperties: PropertyValues) {
	// 	console.log('update-instance', { changedProperties });
	// 	this._propertiesObs.update(changedProperties);
	// 	super.update(changedProperties);
	// }

	#activeChanged(active: boolean, old: boolean) {
		console.log('activeChanged', { active, old });
		this.toggleAttribute('aria-hidden', !active);
		this.toggleAttribute('visible', active);
		this.#coolingDown = !active && old;
		this.requestUpdate();
	}

	#reset() {
		this.active = false;
		this.#coolingDown = false;
		this.toggleAttribute('visible', false);
		this.requestUpdate();
	}

	render() {
		console.log('render...');
		const classNames = [
			this.active || this.#coolingDown ? 'active' : '',
			this.#coolingDown ? 'cooldown' : '',
		].join(' ');
		return html`
			<div
				id="spinnerContainer"
				class=${classNames}
				@animationend=${this.#reset}
				@webkit-animation-end=${this.#reset}>
				<div class="spinner-layer">
					<div class="circle-clipper left">
						<div class="circle"></div>
					</div>
					<div class="circle-clipper right">
						<div class="circle"></div>
					</div>
				</div>
			</div>
		`;
	}

	static styles = [
		css`
			/*
       * Constants:
       *      ARCSIZE     = 270 degrees (amount of circle the arc takes up)
       *      ARCTIME     = 1333ms (time it takes to expand and contract arc)
       *      ARCSTARTROT = 216 degrees (how much the start location of the arc
       *                                should rotate each time, 216 gives us a
       *                                5 pointed star shape (it's 360/5 * 3).
       *                                For a 7 pointed star, we might do
       *                                360/7 * 3 = 154.286)
       *      SHRINK_TIME = 400ms
       */

			:host {
				display: inline-block;
				position: relative;
				width: 28px;
				height: 28px;
				color: var(--primary-color, rgb(30, 136, 229));
			}

			:host(:not([visible])) {
				display: none;
			}

			#spinnerContainer {
				width: 100%;
				height: 100%;

				/* The spinner does not have any contents that would have to be
         * flipped if the direction changes. Always use ltr so that the
         * style works out correctly in both cases. */
				direction: ltr;
			}

			#spinnerContainer.active {
				-webkit-animation: container-rotate 1568ms linear infinite;
				animation: container-rotate 1568ms linear infinite;
			}

			@-webkit-keyframes container-rotate {
				to {
					-webkit-transform: rotate(360deg);
				}
			}

			@keyframes container-rotate {
				to {
					transform: rotate(360deg);
				}
			}

			.spinner-layer {
				display: flex;
				height: 100%;
				opacity: 0;
				position: absolute;
				white-space: nowrap;
				width: 100%;
			}

			/**
       * IMPORTANT NOTE ABOUT CSS ANIMATION PROPERTIES (keanulee):
       *
       * iOS Safari (tested on iOS 8.1) does not handle animation-delay very well - it doesn't
       * guarantee that the animation will start _exactly_ after that value. So we avoid using
       * animation-delay and instead set custom keyframes for each color (as layer-2undant as it
       * seems).
       */
			.active .spinner-layer {
				-webkit-animation-name: fill-unfill-rotate;
				-webkit-animation-duration: 5332ms;
				-webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				-webkit-animation-iteration-count: infinite;
				animation-name: fill-unfill-rotate;
				animation-duration: 5332ms;
				animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				animation-iteration-count: infinite;
				opacity: 1;
			}

			@-webkit-keyframes fill-unfill-rotate {
				12.5% {
					-webkit-transform: rotate(135deg);
				} /* 0.5 * ARCSIZE */
				25% {
					-webkit-transform: rotate(270deg);
				} /* 1   * ARCSIZE */
				37.5% {
					-webkit-transform: rotate(405deg);
				} /* 1.5 * ARCSIZE */
				50% {
					-webkit-transform: rotate(540deg);
				} /* 2   * ARCSIZE */
				62.5% {
					-webkit-transform: rotate(675deg);
				} /* 2.5 * ARCSIZE */
				75% {
					-webkit-transform: rotate(810deg);
				} /* 3   * ARCSIZE */
				87.5% {
					-webkit-transform: rotate(945deg);
				} /* 3.5 * ARCSIZE */
				to {
					-webkit-transform: rotate(1080deg);
				} /* 4   * ARCSIZE */
			}

			@keyframes fill-unfill-rotate {
				12.5% {
					transform: rotate(135deg);
				} /* 0.5 * ARCSIZE */
				25% {
					transform: rotate(270deg);
				} /* 1   * ARCSIZE */
				37.5% {
					transform: rotate(405deg);
				} /* 1.5 * ARCSIZE */
				50% {
					transform: rotate(540deg);
				} /* 2   * ARCSIZE */
				62.5% {
					transform: rotate(675deg);
				} /* 2.5 * ARCSIZE */
				75% {
					transform: rotate(810deg);
				} /* 3   * ARCSIZE */
				87.5% {
					transform: rotate(945deg);
				} /* 3.5 * ARCSIZE */
				to {
					transform: rotate(1080deg);
				} /* 4   * ARCSIZE */
			}

			.circle-clipper {
				display: inline-block;
				position: relative;
				width: 50%;
				height: 100%;
				overflow: hidden;
			}

			/**
       * Patch the gap that appear between the two adjacent div.circle-clipper while the
       * spinner is rotating (appears on Chrome 50, Safari 9.1.1, and Edge).
       */
			.spinner-layer::after {
				content: '';
				left: 45%;
				width: 10%;
				border-top-style: solid;
			}

			.spinner-layer::after,
			.circle-clipper .circle {
				box-sizing: border-box;
				position: absolute;
				top: 0;
				border-width: 3px;
				border-radius: 50%;
			}

			.circle-clipper .circle {
				bottom: 0;
				width: 200%;
				border-style: solid;
				border-bottom-color: transparent !important;
			}

			.circle-clipper.left .circle {
				left: 0;
				border-right-color: transparent !important;
				-webkit-transform: rotate(129deg);
				transform: rotate(129deg);
			}

			.circle-clipper.right .circle {
				left: -100%;
				border-left-color: transparent !important;
				-webkit-transform: rotate(-129deg);
				transform: rotate(-129deg);
			}

			.active .gap-patch::after,
			.active .circle-clipper .circle {
				-webkit-animation-duration: 1333ms;
				-webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				-webkit-animation-iteration-count: infinite;
				animation-duration: 1333ms;
				animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				animation-iteration-count: infinite;
			}

			.active .circle-clipper.left .circle {
				-webkit-animation-name: left-spin;
				animation-name: left-spin;
			}

			.active .circle-clipper.right .circle {
				-webkit-animation-name: right-spin;
				animation-name: right-spin;
			}

			@-webkit-keyframes left-spin {
				0% {
					-webkit-transform: rotate(130deg);
				}
				50% {
					-webkit-transform: rotate(-5deg);
				}
				to {
					-webkit-transform: rotate(130deg);
				}
			}

			@keyframes left-spin {
				0% {
					transform: rotate(130deg);
				}
				50% {
					transform: rotate(-5deg);
				}
				to {
					transform: rotate(130deg);
				}
			}

			@-webkit-keyframes right-spin {
				0% {
					-webkit-transform: rotate(-130deg);
				}
				50% {
					-webkit-transform: rotate(5deg);
				}
				to {
					-webkit-transform: rotate(-130deg);
				}
			}

			@keyframes right-spin {
				0% {
					transform: rotate(-130deg);
				}
				50% {
					transform: rotate(5deg);
				}
				to {
					transform: rotate(-130deg);
				}
			}

			#spinnerContainer.cooldown {
				-webkit-animation: container-rotate 1568ms linear infinite,
					fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);
				animation: container-rotate 1568ms linear infinite,
					fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);
			}

			@-webkit-keyframes fade-out {
				0% {
					opacity: 1;
				}
				to {
					opacity: 0;
				}
			}

			@keyframes fade-out {
				0% {
					opacity: 1;
				}
				to {
					opacity: 0;
				}
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'sb-load-spinner': SbLoadSpinner;
	}
}

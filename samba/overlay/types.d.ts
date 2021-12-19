import { ReactiveElement } from 'lit';
import { EventsMap as OverlayEventsMap } from './events.types.js';
import { OverlayController } from './overlay-controller.js';
import type { AnimationKeys } from './animations-presets.js';
import type { ListenersObject } from './common/listeners';

export { OverlayController, OverlayEventsMap as EventsMap };

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export class CustomElementClass extends ReactiveElement {
  overlayController?: OverlayController<this>;
}

export declare interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export type VerticalAlign = 'top' | 'bottom' | 'middle';

export type HorizontalAlign = 'left' | 'right' | 'center';

export type Animation = Keyframe[] | AnimationKeys;

export type Rect = Writeable<
  Pick<DOMRect, 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width'>
>;

export interface Options<Host, EventsMap extends OverlayEventsMap = OverlayEventsMap> {
  /** By default, it adds custom stylesheet to the overlay host to make it look like an overlay */
  addOverlayStyles?: boolean;
  animationIn?: Animation;
  animationInOptions?: AnimationOptions;
  animationOut?: Animation;
  animationOutOptions?: AnimationOptions;
  /**
   * Used by overlay-container
   * @default true
   */
  cancelOnOutsideClick?: boolean;
  /**
   * Used by overlay-container
   * @default false
   */
  cancelOnPopState?: boolean;
  /**
   * Used by overlay-container
   * @default true
   */
  closeOthers?: boolean;
  /**
   * Used by overlay-container
   * @default false
   */
  closeWhenOtherIsOpened?: boolean;
  container?: Node;
  /**
   * List of css selectors. The overlay will be draggable from elements that match any of them.
   */
  draggable?: string[];
  globalMargin?: number;
  horizontalAlign?: HorizontalAlign;
  horizontalOffset?: number;
  listeners?: ListenersObject<EventsMap>;
  /** @default false */
  noAutoFocus?: boolean;
  /** @default false */
  noAutoPositionize?: boolean;
  /** @default false */
  noAutoPositionizeOnResize?: boolean;
  /** Used by overlay-container */
  noCancelOnEscKey?: boolean;
  /** @default false */
  noHorizontalOverlap?: boolean;
  /** @default true */
  noVerticalOverlap?: boolean;
  opened?: boolean;
  positionEvent?: MouseEvent;
  positionRect?: Rect;
  positionTarget?: Element;
  preventAutoClose?: boolean;
  resizable?: boolean;
  /** @default false */
  restorePreviousFocusedElementOnClose?: boolean;
  stylesheets?: CSSStyleSheet[];
  /**
   * Used by overlay-container
   * @default false
   */
  transparentBackdrop?: boolean;
  verticalAlign?: VerticalAlign;
  verticalOffset?: number;
  withAnimation?: boolean;
  /**
   * Used by overlay-container
   * @default true
   */
  withBackdrop?: boolean;
  handleOutsideClick?: (evt: MouseEvent) => void;
  whenAnimationEnds?(this: Host): void;
}

// TBD
export interface PlacementEnum {
  TopStart: 'top-start';
  Top: 'top';
  TopEnd: 'top-end';
  LeftStart: 'left-start';
  Left: 'left';
  LeftEnd: 'left-end';
  BottomStart: 'bottom-start';
  Bottom: 'bottom';
  BottomEnd: 'bottom-end';
  RightStart: 'right-start';
  Right: 'right';
  RightEnd: 'right-end';
}

export type Placement = PlacementEnum[keyof PlacementEnum];

// interface ControllerEventsMap<T = ControllerHost>
//   extends ElementEventMap,
//     DocumentAndElementEventHandlersEventMap,
//     GlobalEventHandlersEventMap,
//     EventsMap<T> {}

// export interface ControllerHost<T = HTMLElement> extends ReactiveElement {
//   overlayController: OverlayController<this>;

//   addEventListener<K extends keyof ControllerEventsMap<T>>(
//     type: K,
//     listener: (this: T, ev: ControllerEventsMap<T>[K]) => any,
//     options?: boolean | AddEventListenerOptions,
//   ): void;

//   removeEventListener<K extends keyof ControllerEventsMap<T>>(
//     type: K,
//     listener: (this: T, ev: ControllerEventsMap<T>[K]) => any,
//     options?: boolean | EventListenerOptions,
//   ): void;
// }

import type { AnimationItem } from './elements/app-router/types';

export const appRouterAnimations: AnimationItem[] = [
  {
    id: 'slide-in',
    keyframeSet: [
      { transform: 'translate3d(0, -20px, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    keyframeOptions: /** @type {KeyframeAnimationOptions} */ {
      duration: 160,
      fill: 'forwards',
      easing: 'ease-out',
    },
  },
  {
    id: 'slide-out',
    keyframeSet: [
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      { transform: 'translate3d(0, 20px, 0)', opacity: 0 },
    ],
    keyframeOptions: /** @type {KeyframeAnimationOptions} */ {
      duration: 160,
      fill: 'forwards',
      easing: 'ease-out',
    },
  },
];

import type { AnimationItem } from './elements/app-router/types';

export const appRouterAnimations: AnimationItem[] = [
  {
    id: 'top-slide-in',
    keyframeSet: [
      { transform: 'translate3d(0, -20px, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    keyframeOptions: <KeyframeAnimationOptions>{
      duration: 160,
      fill: 'forwards',
      easing: 'ease-out',
    },
  },
  {
    id: 'top-slide-out',
    keyframeSet: [
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      { transform: 'translate3d(0, 20px, 0)', opacity: 0 },
    ],
    keyframeOptions: <KeyframeAnimationOptions>{
      duration: 160,
      fill: 'forwards',
      easing: 'ease-out',
    },
  },
  {
    id: 'slide-from-right',
    keyframeSet: [
      { transform: 'translate3d(120%, 0, 0)', filter: 'brightness(1)' },
      { filter: 'brightness(0.6)', offset: 0.2 },
      { transform: 'translate3d(0, 0, 0)' },
    ],
    keyframeOptions: {
      duration: 240,
      fill: 'forwards',
      // easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
      easing: 'ease-out',
    },
  },
  {
    id: 'slide-from-left',
    keyframeSet: [
      { transform: 'translate3d(-20%, 0, 0)', filter: 'brightness(0.6)' },
      { filter: 'brightness(0.6)', offset: 0.2 },
      { transform: 'translate3d(0, 0, 0)', filter: 'brightness(1)' },
    ],
    keyframeOptions: {
      duration: 260,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
      // easing: 'ease-out',
    },
  },
  {
    id: 'opacity-fast',
    keyframeSet: [{ opacity: '0' }, { opacity: '1' }],
    keyframeOptions: {
      duration: 144,
      fill: 'forwards',
      easing: 'ease-out',
    },
  },
  {
    id: 'opacity',
    keyframeSet: [{ opacity: '0' }, { opacity: '1' }],
    keyframeOptions: {
      duration: 260,
      fill: 'forwards',
      easing: 'ease-out',
    },
  },
  {
    id: 'scale-out',
    keyframeSet: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(.7)', opacity: 0 },
    ],
    keyframeOptions: {
      duration: 180,
      fill: 'forwards',
      easing: 'ease-in',
    },
  },
];

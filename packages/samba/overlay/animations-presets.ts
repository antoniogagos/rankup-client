export type AnimationKeys = keyof typeof AnimationsPresets | 'slide-in';

export const AnimationsPresets = {
  'scale-in': [
    { transform: 'scale(1.2)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 },
  ],
  'slide-in-from-top': [
    { transform: 'translateY(-8px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ],
  'slide-in-from-bottom': [
    { transform: 'translateY(8px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ],
  'slide-in-from-left': [
    { transform: 'translateX(-8px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ],
  'slide-in-from-right': [
    { transform: 'translateX(8px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ],
  'slide-out-to-top': [
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(-8px)', opacity: 0 },
  ],
  'slide-out-to-bottom': [
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(12px)', opacity: 0 },
  ],
  'slide-out-to-right': [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(12px)', opacity: 0 },
  ],
  'slide-out-to-left': [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(-12px)', opacity: 0 },
  ],
  'fade-in': [{ opacity: 0 }, { opacity: 1 }],
  'fade-out': [{ opacity: 1 }, { opacity: 0 }],
};

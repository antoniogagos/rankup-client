import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

const resolved = new WeakSet();

class LazyLoadDirective extends AsyncDirective {
  update(part: import('lit-html').ChildPart, [promise, element]: [Promise<void>, HTMLElement]) {
    if (!resolved.has(promise)) {
      Promise.resolve(promise).then(() => {
        this.setValue(element);
      });
      const event = new CustomEvent('pending-state', {
        composed: true,
        bubbles: true,
        detail: { promise },
      });
      part.parentNode.dispatchEvent(event);
    }
    return this.render(promise, element);
  }

  render(promise: Promise<void>, element: HTMLElement) {
    return 'loading';
  }
}

export const lazyLoad = directive(LazyLoadDirective);

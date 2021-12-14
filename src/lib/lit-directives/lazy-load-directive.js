import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

const resolved = new WeakSet();

class LazyLoadDirective extends AsyncDirective {
  /**
   * @param {import('lit-html').ChildPart} part
   * @param {*} param1
   * @returns
   */
  update(part, [promise, element]) {
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

  /**
   * @param {Promise<void>} promise
   * @param {HTMLElement} element
   */
  render(promise, element) {
    return 'loading';
  }
}

export const lazyLoad = directive(LazyLoadDirective);

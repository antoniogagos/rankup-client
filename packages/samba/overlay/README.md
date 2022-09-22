# Overlays

An overlay is a modal window that appears on top of everthing. Useful for displaying important information or requiring decision for example.

1. [Creating overlays](#1-creating-overlays)
2. [The Overlay Container](#3-the-overlay-container)

## 1. Creating overlays

Any HTMLElement can be opened within an overlay box.
The **OverlayController** will take care of opening, closing, animating, positioning, backdrops, adding the custom overlay styles, etc.

### 2.1. Using the open-overlay.js helper

The easiest way to create an overlay is by using the `open-overlay.js` helper.
This is the preferred method because it separates overlays from its content
(your custom-element will not import or specify anything related to overlays)

```js
// Creating a dialog from a custom-element

import {openOverlay} from '@rankup/samba/overlay/open-overlay.js';
import {MyCustomElement} from '...';
import type { MyCustomElement, Parameters } from '../../elements/my-element/my-element.js';
// Import types & element separeted, so that import isn't ignored at runtime
import '../../elements/my-element/my-element.js';

const overlayController = openOverlay<MyCustomElement, Parameters>('my-element', {
  foo: 2 // parameters defined at Parameters, if any
}, {
  addOverlayStyles: false,
  cancelOnOutsideClick: true,
  listeners: {
    'overlay-closed': evt => {},
  },
});
```

MyCustomElement must have the property **overlayController** which will be set by openOverlay.
This way the element can control it's ownn overlay when defined (close/cancel/ignore..)

```js
// Example

class MyCustomElementClass extends LitElement {

  overlayController?: OverlayController<this> = null;

  someFunc() {
    this.overlayController?.close();
  }

}
```

## 3. The Overlay Container

By default, the OverlayController appends all new overlays to the _document.body_
Ideally we should have a single container, and the OverlayController has a way to change that.

> Note: if you don't want to know more, just place the &lt;overlay-container&gt; anywhere, and that'll be the single container for overlays

Changing the container for overlays:

- OverlayController will dispatch a 'find-overlay-container' CustomEvent from the Window object everytime before next overlay insertion.
- Capture that event and change `evt.detail.container`

That and some other useful functionality can be found by just using the `<sb-overlay-container>` element

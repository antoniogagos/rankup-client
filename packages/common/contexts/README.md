# AppShell Contexts

This folder contains contexts that are available from the appShell to be used by any package.

So don't add any contexts where the appShell is not a provider here.

## Notes

- If you want to get notified when a context changes its value, use the ContextConsumer controller instead of the decorator.

```js
import { ContextConsumer } from '@lit-labs/context';

fooController = new ContextConsumer(
	this,
	fooContext,
	foo => {
		// change callback
	},
	true, // subscribe to changes
);
```

The decorator can't be used for this because it will call `requestUpdate()` without passing the changed property name you used. So the lifecycle lit methods (shouldUpdate / willUpdate / update) will not tell you if your context value has changed.

- A provider could be registered after a consumer has subscribed. This works but you have to consider if that's the case for your controller and assume it will be defined in the future. Maybe the Controller callback can help in some situations.

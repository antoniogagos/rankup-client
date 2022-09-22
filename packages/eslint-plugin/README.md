# eslint-plugin

Particular rules for rankup

## Usage

Add `rankup` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": ["rankup"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
	"rules": {
		"rankup/rule-name": 2
	}
}
```

## Supported Rules

### no-custom-elements-define

Don't allow registration of components via customElements.define, use @customElement decorator instead.

### no-duplicated-web-component

Check that there is no registration of 2 web components with the same name. This rule could be removed with scoped registries.

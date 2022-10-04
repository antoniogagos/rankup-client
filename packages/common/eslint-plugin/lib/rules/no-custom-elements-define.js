const CustomElementsCall =
	'[callee.object.type=Identifier][callee.object.name=customElements],' +
	'[callee.object.type=MemberExpression][callee.object.property.name=customElements]';
const CustomElementsDefine = `CallExpression[callee.property.name=define]:matches(${CustomElementsCall}):exit`;

/** @typedef {import('estree').CallExpression} CallExpression */
/** @typedef {import('estree').ExpressionStatement} ExpressionStatement */
/** @typedef {import('eslint').Rule.Node & {decorators?: any}} Node */

module.exports = {
	meta: {
		type: 'problem',
		schema: [],
		messages: {
			UseCustomElementDecorator:
				'Use lit decorator to register components: @customElement("{{customElementName}}")\n\tnot customElements.define("{{customElementName}}", ...)',
		},
		docs: {
			description: '',
		},
	},
	/** @param {import('eslint').Rule.RuleContext} context */
	create(context) {
		return {
			/** @param {Node} node */
			[CustomElementsDefine](node) {
				const customElementDefineNode = /** @type {CallExpression} */ (node).arguments[0];
				let customElementName = 'name';
				if (customElementDefineNode.type === 'Literal' && customElementDefineNode.value) {
					customElementName = String(customElementDefineNode.value);
				}
				context.report({
					node,
					messageId: 'UseCustomElementDecorator',
					data: { customElementName },
				});
			},
		};
	},
};

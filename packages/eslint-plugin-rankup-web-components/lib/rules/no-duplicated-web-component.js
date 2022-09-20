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
			CustomElementNameAlreadyUsed: 'Custom element name already declared: `{{customElementName}}`',
		},
		docs: {
			description: '',
		},
	},
	/** @param {import('eslint').Rule.RuleContext} context */
	create(context) {
		const customElementNames = new Set();
		const duplicatedCustomElementNames = new Set();
		return {
			/** @param {Node} node */
			'[decorators.length]': function (node) {
				if (node.decorators) {
					const customElementDecorator = node.decorators.find(
						/** @type {(d: any) => boolean} */ d =>
							d.expression && d.expression.callee.name === 'customElement',
					);
					if (customElementDecorator) {
						const customElementName = customElementDecorator.expression.arguments[0].value;
						if (customElementNames.has(customElementName)) {
							duplicatedCustomElementNames.add(customElementName);
							context.report({
								node,
								messageId: 'CustomElementNameAlreadyUsed',
								data: { customElementName },
							});
						} else {
							customElementNames.add(customElementName);
						}
					}
				}
			},
			/** @param {Node} node */
			[CustomElementsDefine](node) {
				const customElementDefineNode = /** @type {CallExpression} */ (node).arguments[0];
				if (customElementDefineNode.type === 'Literal' && customElementDefineNode.value) {
					const customElementName = String(customElementDefineNode.value);
					if (customElementNames.has(customElementName)) {
						duplicatedCustomElementNames.add(customElementName);
						context.report({
							node,
							messageId: 'CustomElementNameAlreadyUsed',
							data: { customElementName },
						});
					} else {
						customElementNames.add(customElementName);
					}
				}
			},
		};
	},
};

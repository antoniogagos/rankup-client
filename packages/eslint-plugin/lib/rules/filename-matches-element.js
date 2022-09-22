const { basename, dirname, extname } = require('path');
const transformFuncs = require('../name-transforms');

/** @typedef {import('eslint').Rule.Node & {decorators?: any}} Node */
/** @typedef {import('../name-transforms').Transforms} Transforms */
/** @typedef {import('eslint').Rule.CodePath} CodePath */
/** @typedef {import('estree').ClassDeclaration} ClassDeclaration */

/** @param {import('eslint').Rule.RuleContext} context */
function hasFileName(context) {
	const file = context.getFilename();
	return !(file === '<input>' || file === '<text>');
}

/** @param {string} path */
function* expandDirectoryNames(path) {
	const dirs = path.toLowerCase().split(/[/\\]/g);
	while (dirs.length) {
		yield dirs.join('');
		dirs.shift();
	}
}

module.exports = {
	meta: {
		type: 'problem',
		docs: { description: '' },
		messages: {
			filenameError: "File name should be '{{allowed}}' but was '{{filename}}'",
			customElementNameError:
				'Custom element name @customElement("{{customElementName}}") should match filename but kebab-case: @customElement("{{shouldBe}}")',
		},
		schema: [
			{
				type: 'object',
				properties: {
					transform: {
						oneOf: [
							{ enum: ['none', 'snake', 'kebab', 'pascal'] },
							{
								type: 'array',
								items: { enum: ['none', 'snake', 'kebab', 'pascal'] },
								minItems: 1,
								maxItems: 4,
							},
						],
					},
					suffix: {
						onfOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
					},
					matchDirectory: {
						type: 'boolean',
					},
				},
			},
		],
	},
	/** @param {import('eslint').Rule.RuleContext} context */
	create(context) {
		if (!hasFileName(context)) return {};
		return {
			/** @param {ClassDeclaration} node */
			['[type=ClassDeclaration][decorators.length]'](node) {
				if (!node.id) return;
				const className = node.id.name;
				const names = [className];
				const filename = basename(context.getFilename(), extname(context.getFilename()));
				/** @type {Transforms[]} */
				const transforms = [].concat(context.options?.[0]?.transform || ['kebab', 'pascal']);
				/** @type {string[]} */
				const suffixes = [].concat(context.options?.[0]?.suffix || []);
				/** @type {string[]} */
				const prefixes = [].concat(context.options?.[0]?.prefix || []);
				if (context.options?.[0]?.matchDirectory) {
					prefixes.push(...expandDirectoryNames(dirname(context.getFilename())));
				}
				for (const newName of transformFuncs.generateNames(prefixes, suffixes, className)) {
					names.push(newName);
				}
				const allowedFileNames = new Set();
				for (const className of names) {
					for (const transform of transforms) {
						allowedFileNames.add(transformFuncs[transform](className));
					}
				}
				if (!allowedFileNames.has(filename)) {
					const allowed = Array.from(allowedFileNames).join('" or "');
					context.report({
						node: /** @type {Node} */ (node),
						messageId: 'filenameError',
						data: {
							allowed,
							filename,
						},
					});
				}
				const customElementDecorator = /** @type {Node} */ (node).decorators?.find(
					/** @type {(d: any) => boolean} */ d =>
						d.expression && d.expression.callee.name === 'customElement',
				);
				if (customElementDecorator) {
					const customElementName = customElementDecorator.expression.arguments[0].value;
					if (!allowedFileNames.has(customElementName)) {
						context.report({
							node: /** @type {Node} */ (node),
							messageId: 'customElementNameError',
							data: {
								shouldBe: transformFuncs.kebab(filename),
								customElementName,
							},
						});
					}
				}
			},
		};
	},
};

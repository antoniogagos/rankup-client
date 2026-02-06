'use strict';

const NEWLINE_REGEX = /\r?\n/;

function getLineIndent(line) {
	const match = line.match(/^\s*/);
	return match ? match[0] : '';
}

function findFirstNonEmptyLine(raw) {
	const lines = raw.split(NEWLINE_REGEX);
	for (const line of lines) {
		if (line.trim().length > 0) {
			return {
				indent: getLineIndent(line),
			};
		}
	}
	return null;
}

function isCssTaggedTemplate(node) {
	return node && node.type === 'TaggedTemplateExpression' && node.tag && node.tag.type === 'Identifier' && node.tag.name === 'css';
}

function isStylesKey(node) {
	if (!node) {
		return false;
	}
	if (node.type === 'Identifier') {
		return node.name === 'styles';
	}
	if (node.type === 'Literal') {
		return node.value === 'styles';
	}
	return false;
}

module.exports = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce Lit css template indentation and closing bracket layout.',
		},
		fixable: 'code',
		messages: {
			indent: 'Lit css templates must align content with the css` line.',
			closeIndent: 'Lit css template closing backtick must align with the css` line.',
			closeBracket: 'Lit css templates in static styles arrays must close as `]` (no trailing comma/newline).',
		},
	},
	create(context) {
		const sourceCode = context.getSourceCode();
		const sourceText = sourceCode.getText();

		function checkIndent(node) {
			if (!isCssTaggedTemplate(node)) {
				return;
			}
			const template = node.quasi;
			if (!template || !template.range) {
				return;
			}
			const raw = sourceCode.getText(template);
			if (!raw.includes('\n')) {
				return;
			}
			const rawContent = raw.slice(1, -1);
			const firstLine = findFirstNonEmptyLine(rawContent);
			if (!firstLine) {
				return;
			}
			const lineText = sourceCode.lines[node.loc.start.line - 1] || '';
			const cssIndent = getLineIndent(lineText);
			if (firstLine.indent !== cssIndent) {
				const canFix = firstLine.indent.startsWith(cssIndent);
				context.report({
					node: template,
					messageId: 'indent',
					fix: canFix
						? fixer => {
								const extraIndent = firstLine.indent.slice(cssIndent.length);
								const prefixToRemove = cssIndent + extraIndent;
								const lines = rawContent.split(NEWLINE_REGEX);
								const updated = lines.map(line => (line.startsWith(prefixToRemove) ? cssIndent + line.slice(prefixToRemove.length) : line)).join('\n');
								return fixer.replaceTextRange([template.range[0] + 1, template.range[1] - 1], updated);
						  }
						: null,
				});
			}

			const backtickIndex = template.range[1] - 1;
			if (backtickIndex >= 0) {
				const lineStart = sourceText.lastIndexOf('\n', backtickIndex - 1);
				const lineStartIndex = lineStart === -1 ? 0 : lineStart + 1;
				const closingIndent = sourceText.slice(lineStartIndex, backtickIndex);
				if (closingIndent !== cssIndent && /^[\t ]*$/.test(closingIndent)) {
					context.report({
						node: template,
						messageId: 'closeIndent',
						fix: fixer => fixer.replaceTextRange([lineStartIndex, backtickIndex], cssIndent),
					});
				}
			}
		}

		function checkCloseBracket(node) {
			if (!node || !node.static || !isStylesKey(node.key)) {
				return;
			}
			const value = node.value;
			if (!value || value.type !== 'ArrayExpression') {
				return;
			}
			const elements = value.elements.filter(Boolean);
			if (elements.length === 0) {
				return;
			}
			const last = elements[elements.length - 1];
			if (!isCssTaggedTemplate(last) || !last.range) {
				return;
			}
			const arrayEndToken = sourceCode.getLastToken(value);
			if (!arrayEndToken || arrayEndToken.value !== ']') {
				return;
			}
			const between = sourceCode.text.slice(last.range[1], arrayEndToken.range[0]);
			if (between.length === 0) {
				return;
			}
			const canFix = /^[\s,]*$/.test(between);
			context.report({
				node: arrayEndToken,
				messageId: 'closeBracket',
				fix: canFix ? fixer => fixer.replaceTextRange([last.range[1], arrayEndToken.range[0]], '') : null,
			});
		}

		return {
			TaggedTemplateExpression: checkIndent,
			PropertyDefinition: checkCloseBracket,
			Property: checkCloseBracket,
		};
	},
};

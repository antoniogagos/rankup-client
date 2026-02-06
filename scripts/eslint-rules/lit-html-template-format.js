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

function isHtmlTaggedTemplate(node) {
	return node && node.type === 'TaggedTemplateExpression' && node.tag && node.tag.type === 'Identifier' && node.tag.name === 'html';
}

module.exports = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce Lit html template indentation.',
		},
		fixable: 'code',
		messages: {
			indent: 'Lit html templates must indent content one tab beyond the html` line.',
			closeIndent: 'Lit html template closing backtick must align with the html` line.',
		},
	},
	create(context) {
		const sourceCode = context.getSourceCode();
		const sourceText = sourceCode.getText();

		function checkIndent(node) {
			if (!isHtmlTaggedTemplate(node)) {
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
			const htmlIndent = getLineIndent(lineText);
			const expectedIndent = `${htmlIndent}\t`;
			if (firstLine.indent !== expectedIndent) {
				const fix = fixer => {
					const lines = rawContent.split(NEWLINE_REGEX);
					const updated = lines.map(line => (line.startsWith(firstLine.indent) ? expectedIndent + line.slice(firstLine.indent.length) : line)).join('\n');
					return fixer.replaceTextRange([template.range[0] + 1, template.range[1] - 1], updated);
				};
				context.report({
					node: template,
					messageId: 'indent',
					fix,
				});
			}

			const backtickIndex = template.range[1] - 1;
			if (backtickIndex >= 0) {
				const lineStart = sourceText.lastIndexOf('\n', backtickIndex - 1);
				const lineStartIndex = lineStart === -1 ? 0 : lineStart + 1;
				const closingIndent = sourceText.slice(lineStartIndex, backtickIndex);
				if (closingIndent !== htmlIndent && /^[\t ]*$/.test(closingIndent)) {
					context.report({
						node: template,
						messageId: 'closeIndent',
						fix: fixer => fixer.replaceTextRange([lineStartIndex, backtickIndex], htmlIndent),
					});
				}
			}
		}

		return {
			TaggedTemplateExpression: checkIndent,
		};
	},
};

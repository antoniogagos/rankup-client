import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as ts from 'typescript';

type TextEdit = {
	start: number;
	end: number;
	replacement: string;
};

type FixStats = {
	filesChanged: number;
	callsUpdated: number;
	skippedCalls: string[];
};

const ROOT = process.cwd();

function run(command: string): string {
	return execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).toString();
}

function getTypeScriptFiles(): string[] {
	const output = run('rg --files apps packages --glob "*.ts"');
	return output
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
		.filter(file => !file.endsWith('.d.ts'));
}

function buildIdFromPosition(filePath: string, source: ts.SourceFile, position: number): string {
	const location = source.getLineAndCharacterOfPosition(position);
	const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
	const withoutExtension = relative.replace(/\.ts$/, '');
	const tokens = withoutExtension
		.split('/')
		.flatMap(segment => segment.split(/[^a-zA-Z0-9]+/))
		.map(token => token.toLowerCase())
		.filter(Boolean);
	tokens.push('msg');
	tokens.push(`l${location.line + 1}c${location.character + 1}`);
	return tokens.join('.');
}

function hasIdProperty(node: ts.ObjectLiteralExpression): boolean {
	return node.properties.some(property => {
		if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
			return false;
		}
		const name = property.name;
		if (!name) {
			return false;
		}
		if (ts.isIdentifier(name)) {
			return name.text === 'id';
		}
		if (ts.isStringLiteral(name)) {
			return name.text === 'id';
		}
		return false;
	});
}

function editForMsgCall(filePath: string, source: ts.SourceFile, call: ts.CallExpression): TextEdit | null {
	if (call.arguments.length === 0) {
		return null;
	}
	const id = buildIdFromPosition(filePath, source, call.getStart(source));
	const secondArg = call.arguments[1];
	if (!secondArg) {
		const firstArg = call.arguments[0];
		return {
			start: firstArg.end,
			end: firstArg.end,
			replacement: `, { id: '${id}' }`,
		};
	}
	if (!ts.isObjectLiteralExpression(secondArg)) {
		return null;
	}
	if (hasIdProperty(secondArg)) {
		return null;
	}
	const insertAt = secondArg.end - 1;
	const separator = secondArg.properties.length === 0 ? '' : ', ';
	return {
		start: insertAt,
		end: insertAt,
		replacement: `${separator}id: '${id}'`,
	};
}

function collectMsgIdentifiers(source: ts.SourceFile): Set<string> {
	const msgIdentifiers = new Set<string>();
	for (const statement of source.statements) {
		if (!ts.isImportDeclaration(statement) || !statement.importClause || !statement.moduleSpecifier) {
			continue;
		}
		if (!ts.isStringLiteral(statement.moduleSpecifier) || statement.moduleSpecifier.text !== '@lit/localize') {
			continue;
		}
		const bindings = statement.importClause.namedBindings;
		if (!bindings || !ts.isNamedImports(bindings)) {
			continue;
		}
		for (const element of bindings.elements) {
			const imported = element.propertyName?.text ?? element.name.text;
			if (imported === 'msg') {
				msgIdentifiers.add(element.name.text);
			}
		}
	}
	return msgIdentifiers;
}

function applyEdits(text: string, edits: TextEdit[]): string {
	if (edits.length === 0) {
		return text;
	}
	const ordered = [...edits].sort((left, right) => right.start - left.start);
	let result = text;
	for (const edit of ordered) {
		result = `${result.slice(0, edit.start)}${edit.replacement}${result.slice(edit.end)}`;
	}
	return result;
}

function runCodemod(): FixStats {
	const files = getTypeScriptFiles();
	const stats: FixStats = {
		filesChanged: 0,
		callsUpdated: 0,
		skippedCalls: [],
	};
	for (const relativeFile of files) {
		const filePath = path.join(ROOT, relativeFile);
		const sourceText = readFileSync(filePath, 'utf8');
		const source = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		const msgIdentifiers = collectMsgIdentifiers(source);
		if (msgIdentifiers.size === 0) {
			continue;
		}
		const edits: TextEdit[] = [];
		const visit = (node: ts.Node): void => {
			if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && msgIdentifiers.has(node.expression.text)) {
				const edit = editForMsgCall(filePath, source, node);
				if (edit) {
					edits.push(edit);
					stats.callsUpdated += 1;
				} else {
					const secondArg = node.arguments[1];
					if (node.arguments.length > 0 && secondArg && !ts.isObjectLiteralExpression(secondArg)) {
						const loc = source.getLineAndCharacterOfPosition(node.getStart(source));
						stats.skippedCalls.push(`${relativeFile}:${loc.line + 1}:${loc.character + 1}`);
					}
				}
			}
			ts.forEachChild(node, visit);
		};
		visit(source);
		if (edits.length === 0) {
			continue;
		}
		const nextText = applyEdits(sourceText, edits);
		if (nextText !== sourceText) {
			writeFileSync(filePath, nextText);
			stats.filesChanged += 1;
		}
	}
	return stats;
}

const result = runCodemod();
console.log(`localize-add-msg-ids: updated ${result.callsUpdated} msg() call(s) in ${result.filesChanged} file(s).`);
if (result.skippedCalls.length > 0) {
	console.log('localize-add-msg-ids: skipped non-object options at:');
	for (const entry of result.skippedCalls) {
		console.log(`- ${entry}`);
	}
}

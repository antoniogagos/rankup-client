import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LOG_DIR = join(process.cwd(), 'docs', 'work', 'log');
const LOG_FILE_RE = /^\d{4}-\d{2}-\d{2}\.md$/;

const VALIDATE_LINE_RE = /(^|\n)\s*-\s*`?yarn validate`?\s*->\s*(PASS|FAIL)\b/i;

function main(): void {
	let logFiles: string[];
	try {
		logFiles = readdirSync(LOG_DIR).filter(name => LOG_FILE_RE.test(name));
	} catch (err) {
		console.error(`repo:work-log-verification: cannot read ${LOG_DIR}`);
		console.error(err);
		process.exit(1);
	}

	if (logFiles.length === 0) {
		console.error('repo:work-log-verification: no log files found under docs/work/log/');
		console.error('Expected at least one file named YYYY-MM-DD.md');
		process.exit(1);
	}

	const failures: string[] = [];

	for (const file of logFiles) {
		const fullPath = join(LOG_DIR, file);
		if (!statSync(fullPath).isFile()) continue;

		const content = readFileSync(fullPath, 'utf8');

		if (!content.includes('## Verification')) {
			failures.push(`${file}: missing "## Verification" section`);
			continue;
		}

		if (!VALIDATE_LINE_RE.test(content)) {
			failures.push(`${file}: missing yarn validate PASS/FAIL line (expected e.g. "- \`yarn validate\` -> PASS")`);
		}
	}

	if (failures.length > 0) {
		console.error('repo:work-log-verification failed:\n');
		for (const f of failures) console.error(`- ${f}`);

		console.error('\nFix by adding this block to the log file(s):\n');
		console.error('## Verification\n- `yarn validate` -> PASS\n');
		console.error('or\n## Verification\n- `yarn validate` -> FAIL\n- Notes: <short reason + environment>\n');

		process.exit(1);
	}

	console.log(`repo:work-log-verification: OK (${logFiles.length} file(s) checked)`);
}

export function runWorkLogVerification(): void {
	main();
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

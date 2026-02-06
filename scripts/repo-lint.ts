import { spawnSync } from 'node:child_process';

function run(command: string, args: string[]): void {
	const result = spawnSync(command, args, { stdio: 'inherit' });
	if (result.status && result.status !== 0) {
		process.exit(result.status);
	}
	if (result.error) {
		throw result.error;
	}
}

const args = process.argv.slice(2);
const hasFix = args.includes('--fix');

if (hasFix) {
	run('yarn', ['exec', 'prettier', '--write', '--ignore-path', '.prettierignore', '**/*.{js,jsx,json,md,css,html,yml,yaml}']);
}

run('eslint', ['--ext', '.ts', './packages', '--max-warnings=0', ...args]);

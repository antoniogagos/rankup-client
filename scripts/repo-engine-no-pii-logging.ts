import { execSync } from 'node:child_process';

const guardedPaths = [
	'packages/rankup/src/runtime',
	'packages/rankup/src/algorithms',
	'packages/rankup/src/registry',
	'packages/rankup/src/shared',
	'packages/api-mock/src/core/engine-runtime.ts',
];

function fail(message: string, output?: string) {
	console.error('repo:guardrails failed');
	console.error(`- ${message}`);
	if (output) {
		console.error(output);
	}
	process.exit(1);
}

function runNoLoggingSinkGuardrail(): void {
	const command = [
		'rg -n --glob "*.ts"',
		'"\\b(console\\.(log|info|warn|error|debug|trace)|console\\s*\\[[^\\]]+\\]|process\\.(stdout|stderr)\\.write|logger\\.(log|info|warn|error|debug|trace)|logger\\s*\\[[^\\]]+\\])\\s*\\("',
		...guardedPaths,
	].join(' ');

	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			fail('Engine/runtime source must not write direct logs (no console/logger/process stdout/stderr sinks) to avoid PII leakage.', output);
		}
		fail('Engine no-PII logging guardrail did not behave as expected.');
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		if (status === 0) {
			return;
		}
		fail('Unable to run engine no-PII logging guardrail.');
	}
}

export function runEngineNoPiiLoggingGuardrail(): void {
	runNoLoggingSinkGuardrail();
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runEngineNoPiiLoggingGuardrail();
}

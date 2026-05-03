import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

type VitestReport = {
	success: boolean;
	testResults?: Array<{
		name: string;
		startTime?: number;
		endTime?: number;
		status?: string;
	}>;
};

type LayerBudget = {
	label: string;
	pattern: string;
	maxMs: number;
	durationMs: number;
};

const totalBudgetMs = Number(process.env.P0_BUDGET_TOTAL_MS ?? 420_000);

const layerBudgets: LayerBudget[] = [
	{ label: 'mappers', pattern: '/__tests__/p0/mappers/', maxMs: 90_000, durationMs: 0 },
	{ label: 'contracts', pattern: '/__tests__/p0/contracts/', maxMs: 120_000, durationMs: 0 },
	{ label: 'smoke', pattern: '/__tests__/p0/smoke/', maxMs: 180_000, durationMs: 0 },
	{ label: 'streaming', pattern: '/__tests__/p0/streaming/', maxMs: 60_000, durationMs: 0 },
];

function fail(message: string, details?: string): never {
	console.error('test:p0:budget failed');
	console.error(`- ${message}`);
	if (details) {
		console.error(details);
	}
	process.exit(1);
}

function formatMs(ms: number): string {
	return `${(ms / 1000).toFixed(2)}s`;
}

function normalizePath(filePath: string): string {
	return filePath.replace(/\\/g, '/');
}

function collectLayerDurations(report: VitestReport): LayerBudget[] {
	const next = layerBudgets.map(layer => ({ ...layer }));
	for (const testResult of report.testResults ?? []) {
		const name = normalizePath(testResult.name ?? '');
		const startTime = typeof testResult.startTime === 'number' ? testResult.startTime : undefined;
		const endTime = typeof testResult.endTime === 'number' ? testResult.endTime : undefined;
		const durationMs = startTime !== undefined && endTime !== undefined ? Math.max(0, endTime - startTime) : 0;
		if (durationMs <= 0) {
			continue;
		}
		for (const layer of next) {
			if (name.includes(layer.pattern)) {
				layer.durationMs += durationMs;
				break;
			}
		}
	}
	return next;
}

export function runP0BudgetGate(): void {
	if (!Number.isFinite(totalBudgetMs) || totalBudgetMs <= 0) {
		fail(`Invalid P0_BUDGET_TOTAL_MS value: ${process.env.P0_BUDGET_TOTAL_MS ?? '(unset)'}`);
	}

	const tempDir = mkdtempSync(join(tmpdir(), 'rankup-p0-budget-'));
	const reportPath = join(tempDir, 'vitest-p0-report.json');

	try {
		const startedAt = performance.now();
		const result = spawnSync(
			'yarn',
			['vitest', 'run', '-c', 'vitest.p0.config.ts', '--reporter=default', '--reporter=json', `--outputFile=${reportPath}`],
			{ stdio: 'inherit' },
		);
		const wallDurationMs = performance.now() - startedAt;

		if (result.status !== 0) {
			fail('P0 tests failed before budget checks could pass.');
		}

		const report = JSON.parse(readFileSync(reportPath, 'utf8')) as VitestReport;
		if (!report.success) {
			fail('Vitest JSON report indicates unsuccessful P0 execution.');
		}

		const exceededMessages: string[] = [];
		if (wallDurationMs > totalBudgetMs) {
			exceededMessages.push(`total wall duration ${formatMs(wallDurationMs)} exceeded budget ${formatMs(totalBudgetMs)}`);
		}

		const resolvedLayerBudgets = collectLayerDurations(report);
		for (const layer of resolvedLayerBudgets) {
			if (layer.durationMs > layer.maxMs) {
				exceededMessages.push(`${layer.label} duration ${formatMs(layer.durationMs)} exceeded budget ${formatMs(layer.maxMs)}`);
			}
		}

		if (exceededMessages.length > 0) {
			fail(
				'P0 runtime budget exceeded.',
				[
					...exceededMessages,
					`layer summaries: ${resolvedLayerBudgets.map(layer => `${layer.label}=${formatMs(layer.durationMs)}`).join(', ')}`,
				].join('\n'),
			);
		}

		console.log(
			`test:p0:budget passed (total=${formatMs(wallDurationMs)}, ${resolvedLayerBudgets.map(layer => `${layer.label}=${formatMs(layer.durationMs)}`).join(', ')})`,
		);
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runP0BudgetGate();
}

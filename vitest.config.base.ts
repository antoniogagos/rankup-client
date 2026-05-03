import { defineConfig } from 'vitest/config';

export const vitestBase = defineConfig({
	test: {
		environment: 'node',
		globals: false,
		setupFiles: ['./vitest.setup.ts'],
		testTimeout: 10_000,
		hookTimeout: 10_000,
		reporters: ['default'],
		isolate: true,
		retry: 0,
	},
});

const { FlatCompat } = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const promise = require('eslint-plugin-promise');
const litCssTemplateFormat = require('./scripts/eslint-rules/lit-css-template-format.js');
const litHtmlTemplateFormat = require('./scripts/eslint-rules/lit-html-template-format.js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const baseConfigs = compat.extends('@open-wc', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'plugin:promise/recommended', 'prettier');

module.exports = [
	{
		ignores: ['**/dist/**', '**/*.d.ts', 'packages/api/**', 'packages/api-mock/**', 'apps/rankup-spa/assets/**'],
	},
	...baseConfigs,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'simple-import-sort': simpleImportSort,
			promise,
			local: {
				rules: {
					'lit-css-template-format': litCssTemplateFormat,
					'lit-html-template-format': litHtmlTemplateFormat,
				},
			},
		},
		rules: {
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-shadow': 2,
			'@typescript-eslint/no-use-before-define': [
				'error',
				{
					functions: false,
					classes: false,
					variables: true,
					ignoreTypeReferences: true,
				},
			],
			'class-methods-use-this': 'off',
			'consistent-return': 'off',
			'simple-import-sort/exports': 'error',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [['^']],
				},
			],
			'local/lit-css-template-format': 'error',
			'local/lit-html-template-format': 'error',
			'no-await-in-loop': 'off',
			'no-console': 'off',
			'no-dupe-class-members': 'off',
			'no-shadow': 'off',
			'no-undef': 'off',
			'no-unused-vars': 0,
			'no-use-before-define': 'off',
			'no-useless-escape': 'off',
			'prefer-destructuring': 'off',
			'prefer-template': 'off',
			'promise/catch-or-return': 'off',
			'promise/always-return': 'off',
			'promise/avoid-new': 'off',
			'promise/no-callback-in-promise': 'off',
			'promise/no-native': 'off',
			'promise/no-nesting': 'off',
			'promise/no-new-statics': 'off',
			'promise/no-promise-in-callback': 'off',
			'promise/no-return-in-finally': 'off',
			'promise/no-return-wrap': 'off',
			'promise/param-names': 'off',
			'promise/prefer-await-to-callbacks': 'off',
			'promise/prefer-await-to-then': 'off',
			'promise/valid-params': 'off',
			'lit-a11y/accessible-emoji': 'off',
			'lit-a11y/alt-text': 'off',
			'lit-a11y/anchor-has-content': 'off',
			'lit-a11y/anchor-is-valid': 'off',
			'lit-a11y/aria-activedescendant-has-tabindex': 'off',
			'lit-a11y/aria-attr-valid-value': 'off',
			'lit-a11y/aria-attrs': 'off',
			'lit-a11y/aria-role': 'off',
			'lit-a11y/aria-unsupported-elements': 'off',
			'lit-a11y/autocomplete-valid': 'off',
			'lit-a11y/click-events-have-key-events': 'off',
			'lit-a11y/heading-has-content': 'off',
			'lit-a11y/iframe-title': 'off',
			'lit-a11y/img-redundant-alt': 'off',
			'lit-a11y/mouse-events-have-key-events': 'off',
			'lit-a11y/no-access-key': 'off',
			'lit-a11y/no-autofocus': 'off',
			'lit-a11y/no-distracting-elements': 'off',
			'lit-a11y/no-invalid-change-handler': 'off',
			'lit-a11y/no-redundant-role': 'off',
			'lit-a11y/role-has-required-aria-attrs': 'off',
			'lit-a11y/role-supports-aria-attr': 'off',
			'lit-a11y/scope': 'off',
			'lit-a11y/tabindex-no-positive': 'off',
			'lit-a11y/valid-lang': 'off',
			'import/no-unresolved': 'off',
			'import/named': 'off',
			'import/export': 'off',
			'import/no-named-as-default': 'off',
			'import/no-named-as-default-member': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/no-mutable-exports': 'off',
			'import/no-amd': 'off',
			'import/first': 'off',
			'import/no-duplicates': 'off',
			'import/extensions': 'off',
			'import/order': 'off',
			'import/newline-after-import': 'off',
			'import/prefer-default-export': 'off',
			'import/no-absolute-path': 'off',
			'import/no-dynamic-require': 'off',
			'import/no-webpack-loader-syntax': 'off',
			'import/no-named-default': 'off',
		},
	},
	{
		files: ['packages/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@rankup/api-mock',
							message: 'Packages must not import @rankup/api-mock.',
						},
					],
					patterns: [
						{
							group: ['@rankup/api-mock/*'],
							message: 'Packages must not import @rankup/api-mock subpaths.',
						},
						{
							group: ['@rankup/api/*'],
							message: 'Use the @rankup/api entrypoint (no deep imports).',
						},
					],
				},
			],
		},
	},
	{
		files: ['packages/rankup/src/domains/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@rankup/api',
							message: 'Domain modules must not import @rankup/api.',
						},
						{
							name: '@rankup/api-mock',
							message: 'Domain modules must not import @rankup/api-mock.',
						},
					],
				},
			],
		},
	},
	{
		files: ['packages/platform/src/api/create-rankup-api-client.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['@rankup/api-mock/*'],
							message: 'Use the @rankup/api-mock entrypoint (no deep imports).',
						},
						{
							group: ['@rankup/api/*'],
							message: 'Use the @rankup/api entrypoint (no deep imports).',
						},
					],
				},
			],
		},
	},
	{
		files: ['apps/rankup-spa/pages/**/*.ts', 'apps/rankup-spa/elements/**/*.ts', 'packages/samba/**/*.ts'],
		rules: {
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@rankup/api',
							message: 'UI and samba must not import @rankup/api. Use domain contracts.',
						},
						{
							name: '@rankup/api-mock',
							message: 'UI and samba must not import mock implementations.',
						},
						{
							name: 'openapi-fetch',
							message: 'UI and samba must not import HTTP runtime clients.',
						},
					],
					patterns: [
						{
							group: ['**/platform/api/!(common)/**', '**/src/platform/api/!(common)/**', '**/platform/api/!(common).*', '**/src/platform/api/!(common).*'],
							message: 'UI and samba must not import platform API implementations outside api/common.',
						},
						{
							group: ['**/platform/!(instantiation)/**/browser/**', '**/src/platform/!(instantiation)/**/browser/**'],
							message: 'UI and samba must not import platform implementations (browser/*) except instantiation browser helpers.',
						},
						{
							group: ['**/platform/instantiation/!(browser)/**', '**/src/platform/instantiation/!(browser)/**'],
							message: 'UI and samba must not import DI primitives (platform/instantiation/common). Use @service or scopedServicesController.',
						},
						{
							group: ['**/platform/compositionRoot**', '**/src/platform/compositionRoot**'],
							message: 'UI and samba must not import the composition root.',
						},
						{
							group: ['**/lib/composition-root**'],
							message: 'UI and samba must not import the composition root.',
						},
						{
							group: [
								'@rankup/rankup/domains/**/browser/**',
								'@rankup/rankup/domains/**/mock/**',
								'**/rankup/domains/**/browser/**',
								'**/rankup/domains/**/mock/**',
							],
							message: 'UI and samba must not import domain implementations (browser/mock). Use contracts or AppServices.',
						},
						{
							group: ['**/lib/env', '**/lib/env.*'],
							message: 'UI and samba must not import env directly. Use services/controllers instead.',
						},
					],
				},
			],
		},
	},
	{
		files: ['web-dev-server.config.mjs', 'apps/rankup-spa/web-dev-server.config.mjs', 'apps/rankup-web/web-dev-server.config.mjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'import/no-import-module-exports': 'off',
		},
	},
	{
		files: ['packages/base/**/*.ts'],
		rules: {
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-shadow': 'off',
			'max-classes-per-file': 'off',
			'no-void': 'off',
		},
	},
];

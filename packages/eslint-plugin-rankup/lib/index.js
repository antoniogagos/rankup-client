const rules = require('./rules.js');

module.exports = {
	rules: require('./rules.js'),
	configs: {
		recommended: {
			parserOptions: {
				sourceType: 'module',
			},
			env: {
				es2021: true,
			},
			plugins: ['rankup'],
			rules: Object.fromEntries(
				Object.keys(rules)
					// @ts-ignore
					.filter(r => rules[r].meta.type === 'problem')
					.map(r => [`rankup/${r}`, 'error']),
			),
		},
	},
};

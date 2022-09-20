/** @typedef {'snake' | 'kebab' | 'pascal' | 'none'} Transforms */

module.exports = {
	/** @param {string} str */
	snake(str) {
		return str
			.replace(/([A-Z0-9]($|[a-z0-9]))/g, '_$1')
			.replace(/^_/g, '')
			.toLowerCase();
	},
	/** @param {string} str */
	kebab(str) {
		return str
			.replace(/([A-Z0-9]($|[a-z0-9]))/g, '-$1')
			.replace(/^-/g, '')
			.toLowerCase();
	},
	/** @param {string} str */
	pascal(str) {
		return str.replace(/^./g, c => c.toLowerCase());
	},
	/** @param {string} str */
	none(str) {
		return str;
	},
	/**
	 * @param {string[]} prefixes
	 * @param {string[]} suffixes
	 * @param {string} name
	 */
	*generateNames(prefixes, suffixes, name) {
		for (const prefix of prefixes) {
			if (name.toLowerCase().startsWith(prefix.toLowerCase())) {
				const truncated = name.slice(prefix.length);
				yield truncated;
				for (const suffix of suffixes) {
					if (truncated.toLowerCase().endsWith(suffix.toLowerCase())) {
						yield truncated.slice(0, truncated.length - suffix.length);
					}
				}
			}
		}
		for (const suffix of suffixes) {
			if (name.toLowerCase().endsWith(suffix.toLowerCase())) {
				const truncated = name.slice(0, name.length - suffix.length);
				yield truncated;
				for (const prefix of prefixes) {
					if (truncated.toLowerCase().startsWith(prefix.toLowerCase())) {
						yield truncated.slice(prefix.length);
					}
				}
			}
		}
	},
};

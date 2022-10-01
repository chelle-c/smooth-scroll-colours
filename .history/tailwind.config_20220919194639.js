/** @type {import('tailwindcss').Config} */
module.exports = {
	future: {
		purgeLayersByDefault: true,
		removeDeprecatedGapUtilities: true,
	},
	purge: {
		content: ['./src/**/*.svelte'],
		enabled: production, // disable purge in dev
	},
	content: [],
	theme: {
		extend: {},
	},
	plugins: [],
};

/** @type {import('tailwindcss').Config} */
const production = process.env.NODE_ENV !== 'development'
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

/** @type {import('tailwindcss').Config} */
const production = process.env.NODE_ENV !== "development";
export default {
	content: ["./src/**/*.{html,js,svelte}", "./public/**/*.html"],
	theme: {
		extend: {},
	},
	plugins: [],
	future: {
		removeDeprecatedGapUtilities: true,
	},
	purge: {
		enabled: production,
	},
};

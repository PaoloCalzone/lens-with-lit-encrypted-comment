/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				serif: ['Space Grotesk', ...defaultTheme.fontFamily.serif],
			},
		},
	},
	plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
}

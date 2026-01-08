/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./components/**/*.tsx', './pages/**/*.tsx'],
	darkMode: 'class',
	theme: {
		extend: {
			/*
			 * ===========================================
			 * TYPOGRAPHY: Font family configuration
			 * Used globally via Tailwind's font-sans/font-mono classes
			 * ===========================================
			 */
			fontFamily: {
				sans: ['"Courier New"', 'Courier', '"Lucida Sans Typewriter"', '"Lucida Typewriter"', 'monospace'],
				mono: ['"Courier New"', 'Courier', '"Lucida Sans Typewriter"', '"Lucida Typewriter"', 'monospace'],
			},

			/*
			 * ===========================================
			 * COLORS
			 * ===========================================
			 */
			colors: {
				'accent-1': '#FAFAFA',
				'accent-2': '#EAEAEA',
				'accent-7': '#333',
				success: '#0070f3',
				cyan: '#79FFE1',

			/*
			 * Primary color palette - used for:
			 * - Links (prose content)
			 * - Blockquote left border (via typography plugin)
			 * - List markers/bullets (via typography plugin)
			 * - Tag brackets and hashtags (via Tag component)
			 * Change this to update accent color throughout the theme
			 */
			primary: colors.violet,

				/*
				 * Semantic text colors - CSS variables defined in styles/index.css
				 * These adapt automatically to dark/light mode
				 * Usage: text-text-heading, text-text-body, text-text-muted
				 * Or via utility classes: .text-heading, .text-body, .text-muted
				 */
				'text-heading': 'var(--color-text-heading)', // Titles, headings, nav links
				'text-body': 'var(--color-text-body)',       // Article body text, prose content
				'text-muted': 'var(--color-text-muted)',     // Dates, meta info, footer, secondary text
			},

			/*
			 * ===========================================
			 * BORDER COLOR
			 * Overrides Tailwind's default border color
			 * Uses CSS variable defined in styles/index.css
			 * Adapts to dark/light mode automatically
			 * Usage: standard `border` class (no need for border-gray-200 etc.)
			 * Used by: footer border, HR separators
			 * ===========================================
			 */
			borderColor: {
				DEFAULT: 'var(--color-border)',
			},

			/*
			 * ===========================================
			 * TYPOGRAPHY PLUGIN (@tailwindcss/typography)
			 * Customizes prose content styling
			 * ===========================================
			 */
			typography: ({ theme }) => ({
				DEFAULT: {
				  css: {
					// Links: dashed underline style (matches Prototype site aesthetic)
					a: {
					  textDecorationStyle: 'dashed',
					  textUnderlineOffset: '4px',
					  '&:hover': {
						textDecorationStyle: 'dashed',
					  },
					},

					// HR/separator: uses semantic border color
					hr: {
					  borderColor: 'var(--color-border)',
					},

					// Blockquote: primary color left border accent
					blockquote: {
					  borderLeftColor: theme('colors.primary.500'),
					  borderLeftWidth: '4px',
					},

					// List markers: primary color for visual accent
					'ul > li::marker': {
					  color: theme('colors.primary.500'),
					},
					'ol > li::marker': {
					  color: theme('colors.primary.500'),
					},

					// Hashnode callout embeds
					'div[data-node-type="callout"]': {
					  display: 'flex',
					  'justify-content': 'flex-start',
					  'align-items': 'flex-start',
					  'background-color': '#F8FAFC',
					  border: '1px solid #E2E8F0',
					  padding: ' 1rem 1.5rem',
					  gap: '0.5rem',
					  'border-radius': '0.5rem',
					  margin: '1rem 0',
					  'word-break': 'break-word',
					},
					'div[data-node-type="callout-emoji"]': {
					  background: '#E2E8F0',
					  'border-radius': '0.5rem',
					  minWidth: '1.75rem',
					  width: '1.75rem',
					  height: '1.5rem',
					  display: 'flex',
					  'margin-top': '0.3rem',
					  'justify-content': 'center',
					  'align-items': 'center',
					  'font-size': '1rem',
					}
				  },
				}
			}),
			spacing: {
				28: '7rem',
			},
			letterSpacing: {
				tighter: '-.04em',
			},
			lineHeight: {
				tight: 1.2,
			},
			fontSize: {
				'5xl': '2.5rem',
				'6xl': '2.75rem',
				'7xl': '4.5rem',
				'8xl': '6.25rem',
			},
			boxShadow: {
				sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
				md: '0 8px 30px rgba(0, 0, 0, 0.12)',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};

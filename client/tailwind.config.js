/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.700'),
                        maxWidth: 'none',
                        a: {
                            color: theme('colors.blue.600'),
                            '&:hover': {
                                color: theme('colors.blue.700'),
                            },
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                        code: {
                            color: theme('colors.red.600'),
                            backgroundColor: theme('colors.gray.100'),
                            borderRadius: theme('borderRadius.DEFAULT'),
                            paddingLeft: theme('spacing.1'),
                            paddingRight: theme('spacing.1'),
                            paddingTop: theme('spacing.0.5'),
                            paddingBottom: theme('spacing.0.5'),
                        },
                        pre: {
                            backgroundColor: theme('colors.gray.900'),
                            color: theme('colors.gray.100'),
                        },
                        blockquote: {
                            borderLeftColor: theme('colors.blue.500'),
                            fontStyle: 'italic',
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.gray.300'),
                        a: {
                            color: theme('colors.blue.400'),
                            '&:hover': {
                                color: theme('colors.blue.300'),
                            },
                        },
                        code: {
                            color: theme('colors.red.400'),
                            backgroundColor: theme('colors.gray.800'),
                        },
                        pre: {
                            backgroundColor: theme('colors.gray.800'),
                            color: theme('colors.gray.200'),
                        },
                        blockquote: {
                            borderLeftColor: theme('colors.blue.400'),
                            color: theme('colors.gray.300'),
                        },
                        h1: { color: theme('colors.white') },
                        h2: { color: theme('colors.white') },
                        h3: { color: theme('colors.white') },
                        h4: { color: theme('colors.white') },
                        strong: { color: theme('colors.white') },
                        thead: {
                            borderBottomColor: theme('colors.gray.700'),
                        },
                        tbody: {
                            'tr:last-child': {
                                borderBottomWidth: '0',
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}


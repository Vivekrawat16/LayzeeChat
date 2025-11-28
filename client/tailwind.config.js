/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Google Brand Colors
                'google-blue': '#4285F4',
                'google-red': '#DB4437',
                'google-yellow': '#F4B400',
                'google-green': '#0F9D58',

                // Material Design 3 Neutrals
                'md-background': '#F8F9FA',
                'md-surface': '#FFFFFF',
                'md-on-surface': '#1F1F1F',
                'md-surface-variant': '#E8EAED',

                // Legacy support
                primary: '#4285F4',
                secondary: '#a855f7',
                dark: '#0f172a',
            },
            fontFamily: {
                display: ['Plus Jakarta Sans', 'sans-serif'],
                body: ['DM Sans', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
                sans: ['DM Sans', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'md-1': '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
                'md-2': '0 3px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
                'md-3': '0 10px 20px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                'md-4': '0 15px 25px rgba(0, 0, 0, 0.12), 0 5px 10px rgba(0, 0, 0, 0.1)',
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                glass: '12px',
            },
            transitionDuration: {
                '400': '400ms',
            },
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Syne', 'Inter', 'sans-serif'],
            },
            colors: {
                mint: {
                    50:  '#F0FAF7',
                    100: '#D6F5EB',
                    200: '#AEEBD6',
                    300: '#7EDFC3',
                    400: '#4ECDA4',
                    500: '#2DB88E',
                    600: '#2D8C7A',
                    700: '#256B61',
                    800: '#1F5148',
                    900: '#1A3D36',
                    950: '#112824',
                },
                // Legacy alias tokens — keep backward compat
                'aa-dark': '#1A3D36',
                'aa-dark-lighter': '#256B61',
                'aa-primary': '#2D8C7A',
                'aa-primary-dark': '#256B61',
                'aa-secondary': '#6B9E93',
                'aa-green': '#2DB88E',
                'aa-red': '#dc2626',
                'aa-card': '#ffffff',
                'aa-bg': '#F0FAF7',
                'aa-border': '#AEEBD6',
                'aa-text': '#1A3D36',
                'aa-text-muted': '#6B9E93',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'slide-in-right': 'slideInRight 0.3s ease-out forwards',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(16px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(45, 140, 122, 0.3)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(45, 140, 122, 0)' },
                },
            },
            boxShadow: {
                'mint': '0 4px 24px -4px rgba(45, 140, 122, 0.18)',
                'mint-lg': '0 8px 40px -8px rgba(45, 140, 122, 0.24)',
            },
        },
    },
    plugins: [],
}

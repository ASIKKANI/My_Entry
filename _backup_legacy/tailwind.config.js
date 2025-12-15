/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#09090b", // Zinc 950
                surface: "#18181b", // Zinc 900
                surfaceHighlight: "#27272a", // Zinc 800
                primary: {
                    DEFAULT: "#8b5cf6", // Violet 500
                    hover: "#7c3aed", // Violet 600
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#27272a", // Zinc 800
                    foreground: "#fafafa", // Zinc 50
                },
                muted: {
                    DEFAULT: "#71717a", // Zinc 500
                    foreground: "#a1a1aa", // Zinc 400
                },
                accent: {
                    DEFAULT: "#f472b6", // Pink 400
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

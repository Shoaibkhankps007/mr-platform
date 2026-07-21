/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12203B",
          50: "#EEF1F6",
          100: "#D6DCE8",
          400: "#3D4E6E",
          700: "#1A2C4C",
          900: "#0B1526",
        },
        paper: "#F5F6F2",
        clinical: {
          teal: "#0F8B7A",
          tealDark: "#0B6357",
          amber: "#C97A2B",
          red: "#B4423A",
        },
      },
      fontFamily: {
        display: ["'Source Serif 4'", "ui-serif", "Georgia", "serif"],
        body: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        widest2: "0.18em",
      },
    },
  },
  plugins: [],
}


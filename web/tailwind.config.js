/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7FAFF",
          2: "#EEF4FB",
          3: "#E2EBF6",
        },
        ink: {
          DEFAULT: "#172B4D",
          soft: "#52647A",
          mute: "#8392A6",
        },
        brand: {
          DEFAULT: "#1D4ED8",
          dark: "#1E40AF",
          light: "#DBEAFE",
          50: "#EFF6FF",
        },
        mustard: {
          DEFAULT: "#F5C451",
          dark: "#D9A928",
          light: "#FEF3C7",
        },
        coral: {
          DEFAULT: "#0EA5E9",
        },
        line: "#DCE6F1",
      },
      fontFamily: {
        display: ['"Manrope"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,43,77,.04), 0 4px 16px rgba(23,43,77,.06)",
        pop: "0 10px 40px rgba(23,43,77,.12)",
      },
    },
  },
  plugins: [],
};

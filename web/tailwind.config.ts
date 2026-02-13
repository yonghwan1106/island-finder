import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#1B3A5C",
          600: "#162F4A",
          700: "#112439",
          800: "#0C1927",
          900: "#070E16",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#0D9488",
          600: "#0F766E",
          700: "#115E59",
          800: "#134E4A",
          900: "#042F2E",
        },
        ocean: {
          50: "#E6F7FA",
          100: "#B3E8F2",
          200: "#80D9EA",
          300: "#4DCAE2",
          400: "#26BED9",
          500: "#00B2D0",
          600: "#0098B3",
          700: "#007E96",
          800: "#006479",
          900: "#004A5C",
        },
        sand: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

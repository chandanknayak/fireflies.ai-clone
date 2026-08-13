import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        fireflies: {
          purple: "#7635FF",
          "purple-dark": "#5E2BD1",
          "purple-light": "#EDE5FF",
          "purple-hover": "#6220EE",
          pink: "#E84393",
          gray: {
            50: "#F9F9FB",
            100: "#F3F3F6",
            200: "#E8E8ED",
            300: "#D1D1D6",
            400: "#AEAEB2",
            500: "#8E8E93",
            600: "#636366",
            700: "#48484A",
            800: "#3A3A3C",
            900: "#1C1C1E",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        fireflies: "0 1px 3px rgba(118, 53, 255, 0.08), 0 1px 2px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

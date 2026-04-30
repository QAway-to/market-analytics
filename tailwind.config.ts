import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cb: {
          blue:    "#0052FF",
          "blue-hover": "#0041CC",
          bg:      "#0A0B0D",
          surface: "#131722",
          card:    "#1C1E26",
          border:  "#2A2D3A",
          text:    "#E8ECF0",
          muted:   "#5B616E",
          green:   "#05B169",
          red:     "#CF202F",
          yellow:  "#F5A623",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Emerald palette
        paper: "#FAFAF8",
        "paper-alt": "#F0F0EC",
        ink: "#0A0A0A",
        emerald: {
          DEFAULT: "#00A878",
          soft: "#2DB88E",
        },
        amber: "#F5A623",
        mint: "#7DDBA3",
      },
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

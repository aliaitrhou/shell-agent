import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        spaceMono: ["Space Mono", "monospace"],
      },
      boxShadow: {
        custom: "0px 0px 30px 0px rgba(255, 255, 255, 0.2)",
        zincShadow: "0px 0px 15px 0px rgba(106, 106, 116, 0.4)",
        zincShadowHover: "0px 0px 15px 0px  rgba(106, 106, 116, 0.6)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

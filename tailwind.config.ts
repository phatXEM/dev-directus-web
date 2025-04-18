import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [require("@tailwindcss/forms")],
};
export default config;

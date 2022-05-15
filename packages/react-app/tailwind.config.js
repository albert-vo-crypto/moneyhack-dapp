module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a2db5a",
        secondary: "#f7bb29",
        black: "#041727",
        white: "#f4f5f5",
        gray: "#ccd0d3",
        purple: "#a877c8",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

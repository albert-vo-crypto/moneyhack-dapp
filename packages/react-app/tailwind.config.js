module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navtext: "#041727",
        navbg: "#f4f5f5",
        highlight: "#4F46E5",
        textonhighlight: "#041727",
        primary: "#f4f5f5",
        primarytext: "#f4f5f5",
        secondary: "#4F46E5",
        secondarylight: "#f7bb29",
        black: "#041727",
        white: "#f4f5f5",
        gray: "#ccd0d3",
        purple: "#a877c8",
        purple2: "#8B5CF6",
        green: "a2db5a",
        gold: "#f7bb29",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

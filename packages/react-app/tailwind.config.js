module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
 
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};

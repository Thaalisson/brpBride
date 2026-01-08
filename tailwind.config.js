module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"Manrope\"", "sans-serif"]
      },
      colors: {
        ink: "var(--ink)",
        accent: "var(--accent)",
        "accent-warm": "var(--accent-warm)"
      },
      boxShadow: {
        glow: "0 0 35px rgba(98, 212, 255, 0.25)"
      }
    }
  },
  plugins: []
};

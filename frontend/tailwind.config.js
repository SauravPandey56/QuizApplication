/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 20s infinite alternate",
        "cursor-float": "cursorFloat 1.5s ease-out forwards",
        "scroll": "scroll 40s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(50px, -80px) scale(1.2)",
          },
          "66%": {
            transform: "translate(-40px, 40px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        cursorFloat: {
          "0%": {
            opacity: "0.8",
            marginTop: "0px",
            filter: "blur(0px)",
          },
          "100%": {
            opacity: "0",
            marginTop: "-80px",
            filter: "blur(4px)",
          },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }, /* Moving left by half because content is duplicated */
        }
      },
    },
  },
  plugins: [],
}

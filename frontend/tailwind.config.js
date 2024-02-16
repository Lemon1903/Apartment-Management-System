function withOpcacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) return `hsl(var(${variableName}))`;
    return `hsla(var(${variableName}), ${opacityValue})`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      "sf-pro-rounded": ["SF Pro Rounded", "sans-serif"],
    },
    extend: {
      colors: {
        border: withOpcacity("--border"),
        input: withOpcacity("--input"),
        ring: withOpcacity("--ring"),
        background: withOpcacity("--background"),
        foreground: withOpcacity("--foreground"),
        primary: {
          DEFAULT: withOpcacity("--primary"),
          foreground: withOpcacity("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withOpcacity("--secondary"),
          foreground: withOpcacity("--secondary-foreground"),
        },
        destructive: {
          DEFAULT: withOpcacity("--destructive"),
          foreground: withOpcacity("--destructive-foreground"),
        },
        muted: {
          DEFAULT: withOpcacity("--muted"),
          foreground: withOpcacity("--muted-foreground"),
        },
        accent: {
          DEFAULT: withOpcacity("--accent"),
          foreground: withOpcacity("--accent-foreground"),
        },
        popover: {
          DEFAULT: withOpcacity("--popover"),
          foreground: withOpcacity("--popover-foreground"),
        },
        // card: {
        //   DEFAULT: withOpcacity("--card"),
        //   foreground: withOpcacity("--card-foreground"),
        // },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

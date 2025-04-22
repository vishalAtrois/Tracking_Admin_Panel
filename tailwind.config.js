module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        // You can add custom colors, fonts, or spacing here.
        colors: {
          'custom-bg': '#1f2937', // Custom dark gray background color (same as Tailwind's gray-800)
        },
        spacing: {
          '128': '32rem', // Example custom spacing, you can add more if needed.
        },
      },
    },
    plugins: [],
  };
  
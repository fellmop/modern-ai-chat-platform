module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        panel: '#101522',
        panelSoft: '#171d2e',
        glow: '#7c8cff',
        accent: '#8b5cf6',
        soft: '#1d2540',
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 140, 255, 0.35)',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(circle at top left, rgba(139,92,246,0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.25), transparent 35%)',
      },
    },
  },
  plugins: [],
};

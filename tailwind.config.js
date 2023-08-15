/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}"],
  darkMode: 'class',
  theme: {
    extend: {
      ontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        heading: ['Montserrat', 'Helvetica', 'sans-serif'],
        body: ['Open Sans', 'Arial', 'sans-serif'],
        tech: ['Source Code Pro', 'monospace'], // Adicionando uma fonte com toque de tecnologia
      },
      colors: {
        primary: '#0077CC',
        secondary: '#F3FBFF',
        tertiary: '#D6EDFF',
        quaternary: '#5fc6c5',
        quinary: '#4bb3b2',
        text1: '#333333',     // Texto 1
        text2: '#666666',     // Texto 2
        text3: '#999999',     // Texto 3

        // Modo Dark
        primarydark: '#002651', // Cor Primária (Modo Dark)
        secondarydark: '#034077', // Cor Secundária (Modo Dark)
        tertiarydark: '#0c53a5', // Cor Terciária (Modo Dark)
        text1dark: '#F3FBFF', // Texto 1 (Modo Dark)
        text2dark: '#cccccc', // Texto 2 (Modo Dark)
        text3dark: '#999999', // Texto 3 (Modo Dark)
      },
    },  
  },
  plugins: [],
};

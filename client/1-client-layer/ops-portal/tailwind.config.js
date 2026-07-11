/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { brand: '#C6006F', ink: '#172033', canvas: '#F8F9FB' }, boxShadow: { card: '0 1px 3px rgba(15,23,42,.04), 0 10px 30px rgba(15,23,42,.04)' } } },
  plugins: [],
}

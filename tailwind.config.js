
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend : {
      colors :{
        'react-gray' : '#f6f7f9',
        'react-bg-box' : '#f1f1f3',
        'react-text' : '#292b32',
        'react-outline' : '#d9dae2',
        'react-select' : '#077EA4',
        'wire-blue' : '#8CD867',
        'wire-red': '  #077EA4 ',
        'wire-green': '#D62828',
        'react-choice': '#e6f7ff',
      },
      spacing: {
        'card':'30rem',
        '128': '32rem',
        
        'bigger':'42rem',
      },
      scale: {
        '102': '1.02',
        '101': '1.01',
        '103': '1.03',
        '104': '1.04',

    },
  },
  plugins: [],
},
}

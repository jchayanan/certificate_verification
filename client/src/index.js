import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from 'styled-components';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    @import url('https://fonts.googleapis.com/css2?family=Yantramanav:wght@400;500;700;900&display=swap');
    font-family: 'Yantramanav', sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`

const theme = {
    colors: {
      background: "#ffffff00",
      font: "#353535",
      font2: "#8b92a1"
    },
    fonts: ['Yantramanav'],
    fontSizes: {
      small: "1em",
      medium: "2em",
      large: "3em"
    }
  }

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

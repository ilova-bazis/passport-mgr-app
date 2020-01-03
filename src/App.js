import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Form from './Form';
import FileUpload from './FileUpload';
import WebSocketio from './WebSocket';
import axios, {post} from 'axios';
// import Upload from './Upload';
import { createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
// import { MuiThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});




function App() {
 
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          
          <WebSocketio></WebSocketio>
        </header>
      </div>
    </ThemeProvider>
    
  );
}

export default App;

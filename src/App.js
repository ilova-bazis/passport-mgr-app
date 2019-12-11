import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Form from './Form';
import FileUpload from './FileUpload';
import WebSocketio from './WebSocket';
import axios, {post} from 'axios';
// import Upload from './Upload';




function App() {
 
  return (
    <div className="App">
      <header className="App-header">
        
        <WebSocketio></WebSocketio>
      </header>
    </div>
  );
}

export default App;

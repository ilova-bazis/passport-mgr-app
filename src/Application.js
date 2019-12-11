
import React from 'react';
import axios, { post } from 'axios';
import { Button, TextField, Typography } from '@material-ui/core';
import FileUpload from './FileUpload';

class Application extends React.Component {

    constructor(props){
        super(props);
        this.getProfile = this.getProfile.bind(this);
    }

    state = {
        filename: ""
    }
    fileUpload = (file) => {
      const url = 'https://wssdev.nexustls.com/files/file';
      // const url = 'http://localhost:8080/file';
      console.log('matters raised to the application');
      const formData = new FormData();
      formData.append('file',file)
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }
      post(url, formData,config).then(response=>{
        this.setState({filename: response.data.filename});  
      });
    }
  
    getProfile(){

        this.props.getProfile();
    }
    render(){
        return(
        <>
            <Button variant="contained" onClick={this.getProfile}>Start New Application</Button>
            <Typography variant="h6">Upload Document</Typography>
            <FileUpload fileUpload={this.fileUpload}></FileUpload>
            <TextField value={this.state.filename}></TextField>
            <Button variant="outlined">Submit Document</Button>
        </>)
    }
}

export default Application;
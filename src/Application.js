
import React from 'react';
import axios, { post } from 'axios';
import { Button, TextField, Typography } from '@material-ui/core';
import FileUpload from './FileUpload';
import { confirmDocument} from './functions/ConfirmDocument';
import { submitApplication } from './functions/SubmitApplication';

class Application extends React.Component {

    constructor(props){
        super(props);
        this.startApplication = this.startApplication.bind(this);
        this.submitApplica = this.submitApplica.bind(this);
        this.confirmDoc = this.confirmDoc.bind(this);
        this.submitDocument = this.submitDocument.bind(this);
        this.setProfile = this.setProfile.bind(this);
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
  
    startApplication(){

        this.props.startApplication();
    }
    submitDocument(){
        console.log('triggered');
        this.props.submitDocument(this.state.filename);
    }
    confirmDoc(){


        console.log("Confirm document");
        this.props.sendWS((person, specs, uuid)=>{
            let mrz = specs.mrz;
            let passport =  {
                type: mrz.type,
                country: mrz.country,
                number: mrz.number,
                date_of_birth: mrz.DOB,
                expiration_date: mrz.expirationDate,
                issue_date: mrz.issueDate,
                nationality: mrz.nationality,
                sex: mrz.sex,
                first_name: mrz.firstName,
                last_name: mrz.lastName,
                personal_number:mrz.presonalNumber,
            }
            let req = {
                id: uuid,
                version: 3, 
                method: "document.confirm",
                params: {
                    applicationID: specs.application.applicationID ,
                    documentID: specs.document.documentID,
                    document: {
                        passport: passport
                    }
                }
            }
            return {request: req, function: confirmDocument};
        });
    }
    submitApplica(){
        console.log("application submit");
        this.props.sendWS((person, specs, uuid)=>{
            let req = {
                id: uuid,
                version: 3,
                method: "document.application.submit",
                params: {
                    applicationID: specs.application.applicationID
                }
            }
            return {request: req, function: submitApplication};
        });
    }

    setProfile(){
        this.props.setProfile(this.state.filename);
    }
    render(){
        return(
        <>
            <Button variant="contained" onClick={this.startApplication}>Start New Application</Button>
            <Typography variant="h6">Upload Document</Typography>
            <FileUpload fileUpload={this.fileUpload}></FileUpload>
            <TextField value={this.state.filename}></TextField>
            <Button variant="outlined" onClick = {this.submitDocument}>Submit Document</Button>
            <Button variant="outlined" onClick = {this.submitApplica}>Submit Application</Button>
            <Button variant="contained" onClick={this.setProfile}>Set Profile</Button>

        </>)
    }
}

export default Application;
import React from 'react';
import { Button, TextField, TextareaAutosize, Grid, Typography, Select, MenuItem, Radio, RadioGroup, FormControlLabel} from '@material-ui/core';
import Application from './Application';
import uuid from 'uuid/v4';
// import util, {TextEncoder} from 'util';
import * as util from 'text-encoding';
import ReactJson from 'react-json-view';

import {startApplication} from './functions/ApplicationActions';
import {getPeople} from './functions/GetPeople';
import { submitDocument } from './functions/SubmitDocument';

const wsState = [<span className="dotRed"></span>, <span className="dotGreen"></span>];
const person = {
	"contacts": [],

	"device": [{
		"_id": "5d68da6919c7132a77c2c49c",
		"device_name": "Dayton.Mante",
		"device_id": "a39548ec-f330-4a56-a22c-4edf8a7b4935",
		"platform": "ios",
		"app_version": "v2.2.4 (1)",
		"ip": "171.108.119.5",
		"api_key": "4f54b7c3-2431-4ac1-807f-c5acd4ec1ed3",
		"__v": 0,
		"session_id": "7aee379a-d97a-4f5a-a5cb-062f9cc439e4"
	}],
	"accountList": [],
	"_id": "5d68da6919c7132a77c2c4a1",
	"firstName": "Sauer",
	"lastName": "Hintz",
	"phone": "+9926810065547",
	"email": "testov.testovich@yahoo.com",
	"__v": 0,
	"account_id": null
}


export default class WebSocketio extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            reply: [],
            ws: null,
            people: null,
            person: person,
            requests: {},
            specs: {}
        }

        this.clearLog = this.clearLog.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.disconnectWS = this.disconnectWS.bind(this);
        this.setWebSocketRules = this.setWebSocketRules.bind(this);
        this.setDocumentType = this.setDocumentType.bind(this);

    }
    // const [reply, setReply] = React.useState([]);
    // const [ws, setWs] = React.useState(null);
    // let ws = null;

    onMessage(e){
        // console.log(temp);
        let temp = this.state.reply;
        let reqs = this.state.requests;
        if(e.id !== undefined){
            try{
                this.state.requests[e.id.toLowerCase()](e, this.state.person, this.state.specs).then(data=>{
                    this.setState({specs:{...this.state.specs, ...data}});
                });
            }
            catch{
                console.log("Function not found.");
            }
            delete reqs[e.id.toLowerCase()];
        }
        temp.unshift(e);
        this.setState({reply:[...temp], requests: reqs});
    }

    componentDidMount() {
        getPeople().then(response=>{
            console.log(response.data.persons.filter(val=>val.device[0].session_id !== undefined));
            this.setState({people: response.data.persons.filter(val=>val.device[0].session_id !== undefined)});
        });
    }
    
    disconnectWS() {
        let t = this.state.ws;
        if(t !== null){
            t.close();
        }
        this.setState({ws: null});
        
    }
    clearLog(){

        this.setState({reply:[]});
    }
    sendMessage(){
        this.state.ws.send(this.converter({
            id: uuid(),
            version: 3,
            method: 'contact.sync',
            params: {
                contacts: []
            }
        }));
    }
    converter = (json) => {
        let encoder = new util.TextEncoder();

        let data = encoder.encode(JSON.stringify(json));
        // return new util.TextEncoder().encode(JSON.stringify(json));
        return data;

    }
    wsDisconnected = (data)=>{
        // console.log(data);
        this.setState({ws: null});
    }

    connectWS = ()=> {
        let temp = new WebSocket("wss://wssdev.nexustls.com/wssprox1/http");

        temp.binaryType = 'arraybuffer';
        
        temp.onopen = (data) => sendHeaders(data);
        temp.onerror = (e) => console.log(e);
        temp.onmessage = (e) => {
            try{

                let dd = JSON.parse(new util.TextDecoder('utf-8').decode(e.data));
                
                console.log(dd);
                if(dd.id !== undefined){
                    if(dd.params !== undefined){
                        console.log('sending ack');
                        temp.send(this.converter({
                            id: dd.id,
                            method: "ack",
                            version: 3,
                            params:{
                                receivedMSG: dd.params.length
                            }
                        }));
                    }
                   
                }
                this.onMessage(dd);
            }
            catch(error) {
                console.log("Message Error while parsing", error);
                // console.log(error);
            }
        };

        temp.onclose = (e)=> this.wsDisconnected(e);
    
    
      
    
        const sendHeaders = (data) => {
            temp.send(this.converter({
                version: 3,
                id: uuid(),
                method: 'client.authorization',
                params: {
                    api_key: this.state.person.device[0].api_key,
                    app_version: this.state.person.device[0].app_version,
                    platform: this.state.person.device[0].platform,
                    device_id: this.state.person.device[0].device_id,
                    device_name: this.state.person.device[0].device_name,
                    session_id: this.state.person.device[0].session_id
                }
            }));
        }

        this.setState({ws:temp});
    }

    startApplication = ()=>{
        let reqUUID = uuid();
        let req = {
            version: 3, 
            id: reqUUID,
            method: "document.application.start",
            params: {
                isoCode: "TJK",
                country: "TJK"
            }
        }
  
        this.state.ws.send(this.converter(req));
        this.setState({requests: {...this.state.requests, [reqUUID.toLowerCase()]: startApplication }});
    }

    submitDocument = (filename) => {
        let reqUUID = uuid();
        let req = {
            version: 3, 
            id: reqUUID,
            method: "document.submit",
            params: {
                applicationID: this.state.specs.application.applicationID,
                documentType: this.state.specs.type,
                countryCode: "TJK",
                set: '8a7cf1fb-36a6-4b0a-ac61-97a9b9bd106b',
                filename: filename
            }
        }
  
        console.log(req);
        this.state.ws.send(this.converter(req));
        this.setState({requests: {...this.state.requests, [reqUUID.toLowerCase()]: submitDocument }, specs: {...this.state.specs, filename: filename}});
    }

    setDocumentType(e) {

        console.log(e);
        console.log(e.target);
        this.setState({specs:{...this.state.specs, type: e.target.value}});
    }
    setWebSocketRules(e) {
        let person = this.state.people.filter(val=>val._id === e.target.value)
        this.setState({person: person[0]});
    }
    // console.log(ws);
    render(){
        return (<>
            <Grid container>
                <Grid md={6}>
                    <Grid>
                        <Typography variant='body1'>Select session:</Typography>
                        <Select onChange={this.setWebSocketRules}>
                            { this.state.people === null ? <MenuItem>No Sessions</MenuItem> : this.state.people.map(val=>(<MenuItem value={val._id}>{val.lastName + " " + val.firstName}</MenuItem>)) }
                        </Select>
                        <Typography variant='h6'>WebSocket Status: { this.state.ws ? wsState[this.state.ws.readyState] : wsState[0]}</Typography>
                        <Button  variant='contained' disabled={ this.state.ws !== null } onClick={this.connectWS}>Connect</Button>
                        <Button  variant='contained' disabled={ this.state.ws === null } onClick={this.disconnectWS}>Disconnect</Button>
                        <Button variant='contained' onClick={this.clearLog}>Clear Log</Button>
                    </Grid>
                    <Grid>
                        <Grid>
                            <Typography variant='h5'>Document Manager steps:</Typography>
                            <RadioGroup aria-label="gender" name="gender1" value={this.state.specs.type} onChange={this.setDocumentType}>
                                <FormControlLabel value="TAJIK_FOREIGN_PASSPORT_MAIN_PAGE" control={<Radio />} label="Passport" />
                                <FormControlLabel value="SELFIE_PHOTO" control={<Radio />} label="Selfie" />
                            </RadioGroup>
                            <Application startApplication={this.startApplication} submitDocument={this.submitDocument}></Application>
                        </Grid>
                            <Button variant='contained' onClick={this.sendMessage}>Send Contact Sync</Button>
                    </Grid>
                    
                    
                </Grid>
                <Grid md={6}>
                    <ReactJson src={this.state.reply}></ReactJson>
                </Grid>
            </Grid>
        </>)
    }
    





}
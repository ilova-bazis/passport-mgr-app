import React from 'react';
import { Button, TextField, TextareaAutosize, MuiThemeProvider, Menu, Grid, Typography, Select, MenuItem, Radio, RadioGroup, FormControlLabel} from '@material-ui/core';
import Application from './Application';
import uuid from 'uuid/v4';
// import util, {TextEncoder} from 'util';
import * as util from 'text-encoding';
import ReactJson from 'react-json-view';

import {startApplication} from './functions/ApplicationActions';
import {getPeople} from './functions/GetPeople';
import { submitDocument } from './functions/SubmitDocument';
import Analytics from './Analytics';
import faker from 'faker';
import DocumentMgr from './DocumentMgr';
import Chat from './Chat';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
 

const wsState = [<span className="dotRed"></span>, <span className="dotGreen"></span>];
const person = {
    "contacts": [],
    "device": [
        {
            "_id": "5dff12951e80a835c1fcc35a",
            "device_name": "Winfield_Nicolas60",
            "device_id": "054f38a4-bf95-4c3c-808a-c626cb2c9e40",
            "platform": "ios",
            "app_version": "v2.2.4 (2)",
            "ip": "232.16.48.125",
            "api_key": "4f54b7c3-2431-4ac1-807f-c5acd4ec1ed3",
            "__v": 0,
            "session_id": "470d3b0d-c40d-4f53-b27a-651ffbdd6e81"
        }
    ],
    "accountList": [],
    "_id": "5dff12961e80a835c1fcc541",
    "firstName": "Walker",
    "lastName": "Spencer",
    "phone": "+9928810524131",
    "email": "walker1@gmail.com",
    "__v": 0,
    "account_id": null
};


const LinkO = (props)=>(<Link to="/document" />);
export default class WebSocketio extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            reply: [],
            ws: null,
            people: null,
            person: person,
            requests: {},
            specs: {type: "TAJIK_FOREIGN_PASSPORT_MAIN_PAGE", conversation: []},
            anchorEl: null,
        }

        this.clearLog = this.clearLog.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.disconnectWS = this.disconnectWS.bind(this);
        this.setWebSocketRules = this.setWebSocketRules.bind(this);
        this.setDocumentType = this.setDocumentType.bind(this);
        this.sendInvite = this.sendInvite.bind(this);
        this.setProfile = this.setProfile.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);


    }
    // const [reply, setReply] = React.useState([]);
    // const [ws, setWs] = React.useState(null);
    // let ws = null;

    async onMessage(e){
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
            // console.log(response.data.persons.filter(val=>val.device[0].session_id !== undefined));
            this.setState({people: response.data.persons.filter(val=>val.device[0].session_id !== undefined)});
        }).catch(err=>console.log(err));
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
    async sendMessage(){
        this.state.ws.send(this.converter({
            id: uuid(),
            version: 3,
            method: 'session.addPushToken',
            params: {
                devToken: false,
                tokenType: 2,
                token: "noviyUUID-"+uuid()
            }
        }));
    }
    sendInvite(){
        this.state.ws.send(this.converter({
            id: uuid(),
            version: 3,
            method: 'user.invite.contact',
            params: {
                language: "ENG",
                phone: "+992927733015"
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
                        let ack = {
                            id: dd.id,
                            method: "ack",
                            version: 3,
                            params:{
                                receivedMSG: dd.params.length
                            }
                        };
                        console.log(ack)
                        temp.send(this.converter(ack));
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
    sendWS = (cb) => {
        
        let id = uuid();
        let p = cb(this.state.person, this.state.specs, id);
        // console.log(p.request);
        this.state.ws.send(this.converter(p.request));
        this.setState({requests: {...this.state.requests, [id.toLowerCase()]: p.function}});
        // cb()
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
  
        // console.log(req);
        this.state.ws.send(this.converter(req));
        this.setState({requests: {...this.state.requests, [reqUUID.toLowerCase()]: submitDocument }, specs: {...this.state.specs, filename: filename}});
    }

    setDocumentType(e) {

        // console.log(e);
        // console.log(e.target);
        this.setState({specs:{...this.state.specs, type: e.target.value}});
    }
    setWebSocketRules(e) {
        let person = this.state.people.filter(val=>val._id === e.target.value)
        this.setState({person: person[0]});
    }

    setProfile(filename) {
        let reqUUID = uuid();
        let req = {
            version: 3, 
            id: reqUUID,
            method: "contact.get",
            params: {
                // firstname: this.state.person.firstName,
                // lastname: this.state.person.lastName,
                // username: faker.internet.domainWord(),
                // avatar: filename
            }
        }
  
        // console.log(req);
        this.state.ws.send(this.converter(req));
    }

    // [anchorEl, setAnchorEl] = React.useState(null);

    handleMenuClick(event){
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuClose(){
        // e.preventDefault();
        this.setState({anchorEl: null});
    };

    // console.log(ws);
    render(){
        // console.log(this.state);
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
                        <Router>
                            <div>
                                <div>
                                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleMenuClick}>
                                        Open Menu
                                    </Button>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={this.state.anchorEl}
                                        keepMounted
                                        open={Boolean(this.state.anchorEl)}
                                        onClose={this.handleMenuClose}
                                    >
                                        <Link to="/document"><MenuItem onClick={this.handleMenuClose}>Document</MenuItem></Link>
                                        <Link to="/chat"><MenuItem onClick={this.handleMenuClose}>Chat</MenuItem></Link>
                                        <Link to="/misc"><MenuItem onClick={this.handleMenuClose}>Misc</MenuItem></Link>
                                    </Menu>
                                </div>

                                    {/* A <Switch> looks through its children <Route>s and
                                        renders the first one that matches the current URL. */}
                                    <Switch>
                                        <Route path="/document">
                                            <DocumentMgr setDocumentType={this.setDocumentType} specs={this.state.specs}></DocumentMgr>
                                            <Application  sendWS = {this.sendWS} startApplication={this.startApplication} submitDocument={this.submitDocument} setProfile={this.setProfile}></Application>
                                        </Route>
                                        <Route path="/chat">
                                            <Chat sendWS={this.sendWS} conversation={this.state.specs.conversation}></Chat>
                                        </Route>
                                        <Route path="/misc">
                                            <Typography vairant="h5">Misc</Typography>
                                            <Button variant='contained' onClick={this.sendMessage}>Send Contact Sync</Button>
                                            <Button variant='contained' onClick={this.sendInvite}>Send Invite</Button>
                                        </Route>
                                    </Switch>
                                </div>
                            </Router>
                                        </Grid>
                         
                            
                            <Analytics></Analytics>
                    </Grid>
                    
                    
                </Grid>
                <Grid md={6}>
                    <ReactJson theme="monokai" src={this.state.reply}></ReactJson>
                </Grid>
            </Grid>
        </>)
    }
    





}
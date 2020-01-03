import React from 'react';
import { Button, Grid, ListItem, Divider, List, ListItemAvatar, ListItemText, Avatar, TextField, Typography } from '@material-ui/core';
// import {getConversation} from './functions/GetConversation';
import {withStyles} from '@material-ui/core/styles';

const style = (themes) =>({
    root: {
        color: "white"
    },
    tfield: {
        backgroundColor: "white"
    }
});
class ChatWindow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            message: ""
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.messageChage = this.messageChage.bind(this);
    }

    sendMessage(){

        for(let i = 0; i<20; i++){
            setTimeout(()=>(this.props.sendWS((person, specs, id)=>{
                let req = {
                    id: id, 
                    version: 3, 
                    method: "message.send",
                    params: {
                        body: "Itiration "+i+ ", Message: " +this.state.message + " Time: " + new Date().toTimeString(),
                        channelId: this.props.conversation.id,
                        type: 1
                    }
                }
    
                return {request: req, function: console.log};
            })),100*i)
            
        }
       

    }
    messageChage(e){

        // console.log(e);
        this.setState({message: e.target.value});
    }
    render(){
        // console.log(this.props);
        const {classes} = this.props;
        return(<div>
            <Typography variant="h2">This is chat window</Typography>

            <TextField
                id="standard-textarea"
                label="Multiline Placeholder"
                placeholder="Placeholder"
                multiline
                value={this.state.message}
                onChange={this.messageChage}
                color="primary"
                className={classes.tfield}
                // onChange={this.messageChange}
            />
            <Button variant="contained" colot="primary" onClick={this.sendMessage}>Send</Button>
        </div>)
    }
}

export default withStyles(style)(ChatWindow);
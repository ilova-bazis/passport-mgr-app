import React from 'react';
import { Button, Grid, ListItem, Divider, List, ListItemAvatar, ListItemText, Avatar, Typography } from '@material-ui/core';
import {getConversation} from './functions/GetConversation';


const Conversations = (props)=>{

    return props.conversation.map(val=>( <ListItem alignItems="flex-start">
    <ListItemAvatar>
    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
    </ListItemAvatar>
    <ListItemText
    primary={props.conversation.title}
    secondary={
        <React.Fragment>
        <Typography
            component="span"
            variant="body2"
            color="textPrimary"
        >
            
        </Typography>
        {" — I'll be in your neighborhood doing errands this…"}
        </React.Fragment>
    }
    />
</ListItem>))

}
   

class Chat extends React.Component {

    constructor(props){
        super(props);

        this.getChat = this.getChat.bind(this);
    }

    getChat(){
        this.props.sendWS((person, specs, id)=>{
            let req = {
                id: id,
                method: "channel.getAll",
                version: 3,
                params: {

                }
            }
            let func = ()=>console.log("salom");
            return {request: req, function: getConversation}
        });
        
    }
    render(){
        console.log(this.props);
        return (<>
            This is chat module.
            <Button onClick={this.getChat}>Get Converation</Button>

            <Grid>
                <List>
                    <Conversations conversation={this.props.conversation !== undefined ? this.props.conversation : []} />
                <Divider variant="inset" component="li" />
                </List>
            </Grid>
        </>)
    }
}

export default Chat;
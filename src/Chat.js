import React from 'react';
import { Button, Grid, ListItem, Divider, List, ListItemAvatar, ListItemText, Avatar, Typography } from '@material-ui/core';
import {getConversation} from './functions/GetConversation';
import {Link, Route, Switch} from 'react-router-dom';
import ChatWindow from './ChatWindow';

import {withStyles} from '@material-ui/core/styles';



const style = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    button: {
        
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
        
    }
  });
const Conversations = (props)=>{

    const clickHandler = (e)=>{
        // console.log(e.target.id);
        props.setConversation(Number(e.target.id));
    }
    return props.conversation.map((val, idx)=>( <ListItem component={Link} to={'/chat/'+val.id} alignItems="flex-start" onClick={clickHandler} id={""+idx}>
    <ListItemAvatar>
    <Avatar alt="Remy Sharp" src={"https://wssdev.nexustls.com/files/file/"+val.icon} />
    </ListItemAvatar>
    <ListItemText
    primary={val.title}
    secondary={
        <React.Fragment>
        <Typography
            component="span"
            variant="body2"
            color="textPrimary"
        >
        {val.lastMessage.author}
        </Typography>
        {val.lastMessage.body}
        </React.Fragment>
    }
    />
</ListItem>))

}
   

class Chat extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            conversation: {}
        }

        this.getChat = this.getChat.bind(this);
        this.setConversation = this.setConversation.bind(this);
    }

    setConversation(id){
        // console.log(id);
        this.setState({conversation: this.props.conversation[id]});
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
            // let func = async ()=>({"salom": "salom"});
            return {request: req, function: getConversation}
        });
        
    }
    render(){
        const {classes} = this.props;
        // console.log(this.props);
        return (<>
            This is chat module.
            <Button onClick={this.getChat} className={classes.button} >Get Converation</Button>

            <Grid>
                <Switch>
                    <Route exact path="/chat">
                        <List className={classes.root}>
                            <Conversations setConversation={this.setConversation} conversation={this.props.conversation !== undefined ? this.props.conversation : []} />
                        <Divider variant="inset" component="li" />
                        </List>
                    </Route>
                    <Route exact path="/chat/:id">
                        <ChatWindow conversation={this.state.conversation} sendWS={this.props.sendWS}></ChatWindow>
                    </Route>
                </Switch>
            </Grid>
        </>)
    }
}

export default withStyles(style)(Chat);
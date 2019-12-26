import React from 'react';
import axios, { post } from 'axios';
import { Button, TextField, Typography, Grid } from '@material-ui/core';



class Analytics extends React.Component {

    constructor(props){
        super(props);
        this.getRequestData = this.getRequestData.bind(this);
    }
    state = {
        requests: [],
        averageResponseTime: 0
    }

    getRequestData(){
        axios.get('http://localhost:3030/nats/websocket/request/get').then(response=>{
            this.setState({requests: response.data.requests}, ()=>{
                this.analyze();
            });
        });
    }
    analyze(){
       
        let replied = this.state.requests.filter(val=>val.replyTime !== null);
        let n = replied.length;
        let avg = replied.reduce((res, val)=>{
            return res + Number(val.delay/n);
        }, 0);
        this.setState({averageResponseTime: avg});
    }

    render(){
        let n = this.state.requests.filter(val=>val.replyTime !== null).length;
        let data = this.state.requests.filter(val=>val.replyTime !== null).map(val=>val);
        data.sort();
        console.log(data);
        return(
        <Grid>
            <Button onClick={this.getRequestData}>Get Request Data</Button>
            <Typography>
                Average request response time: {this.state.averageResponseTime}
            </Typography>
            <Typography>
                Number of requests: {this.state.requests.length}
            </Typography>
            <Typography>
                Number of errors: {this.state.requests.filter(val=>val.error !== null).length}
            </Typography>
            <Typography>
                Number of success: {this.state.requests.filter(val=>val.success !== null).length}
            </Typography>
            <Typography>
                Number of requests without reply: {this.state.requests.filter(val=>val.replyTime === null).length}
            </Typography>
            <Typography>
               Min: {this.state.requests.filter(val=>val.replyTime !== null).reduce((res, val)=>{ 
                   return res > val.delay ? val.delay : res
               },100000000000)} Max: {this.state.requests.filter(val=>val.replyTime !== null).reduce((res, val)=>{ 
                return res < val.delay ? val.delay : res
            },0)} Median: { n > 0 ? data[Math.round(n/2)].delay : 0}
            </Typography>
        </Grid>)
    }
}


export default Analytics;
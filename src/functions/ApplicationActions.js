import axios from 'axios';
import {passURL} from '../config';

export const startApplication = (msg, person)=>{

    return new Promise((resolve, reject)=>{
        if (msg.result !== undefined){
            let a = msg.result;
            let application = {
                applicationID: a.applicationID,
                isoCode: 'TJK',
                status: a.status
            }
            axios.post(passURL + "application", application).then(response=>{
                axios.post(passURL + "person/application/add/"+person._id, { applicationID: response.data.application._id}).then(result=>
                    {
                        resolve(response.data);
                    }
                ).catch(console.log);
            }).catch(console.log);
        }else {
            console.log('No result recieved!');
            reject(msg.error);
        }
    });
   
    
}

// export default startApplication;
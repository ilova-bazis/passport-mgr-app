import axios from 'axios';
import {baseURL} from '../config';

export const startApplication = (a, cb)=>{

    let application = {
        applicationID: a.applicationID,
        isoCode: a.isoCode,
        status: a.status
    }
    axios.post(baseURL + "application", application).then(response=>{
        axios.post(baseURL + "person/application/add/"+a.personID, { applicationID: response.data.application._id}).then(result=>
            {
                cb(response.data);
            }
        ).catch(console.log);
    }).catch(console.log);
}

// export default startApplication;
import axios from 'axios';
import {passURL, baseURL} from '../config';


export const submitDocument = (msg, person, specs) => {
    
    return new Promise((resolve, reject)=>{
        if (msg.result !== undefined){
            let a = msg.result;
            let document = {
                documentID: a.documentID,
                filename: specs.filename,
                setID: a.setID,
                status: a.status,
                type: specs.type

            }
            axios.post(passURL + "application/add/document/"+specs.application._id, document).then(response=>{
                axios.post(baseURL + "person/application/add/"+person._id, { applicationID: response.data.application._id }).then(result=>
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

// const mongoose = require('mongoose');

// const documentSchema = mongoose.Schema({

//     _id: mongoose.Schema.Types.ObjectId,
    // documentID:{type: String, required: true},
    // filename: {type: String, required: true},
    // setID: {type: String, require: true},
    // type: {type: String, require: true},
    // status: {type: String, required: false},
    // error:{type: Boolean, required: false},
    // mrz: {type: mongoose.Schema.Types.ObjectId, ref: 'MRZ'},
    // errorText: mongoose.Schema.Types.Mixed,
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Document', documentSchema);


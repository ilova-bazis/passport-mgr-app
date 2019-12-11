
import axios from 'axios';
import {baseURL} from '../config'

export const getPeople = ()=>{
    return axios.get(baseURL + "person");
}
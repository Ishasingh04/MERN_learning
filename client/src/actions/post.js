import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_POST,
    POST_ERROR
} from './types';

//Get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/post');
        dispatch({
            type: GET_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
         }); 
    }
};
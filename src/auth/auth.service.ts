import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios, { Axios } from "axios";
import { REFUSED } from 'dns';

/*
    TODO: get access token
    Requesting an access token with the client credentials flow is
    just a POST request on the /oauth/token endpoint with a grant_type 
    parameter set to client_credentials
    https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/
    https://www.oauth.com/oauth2-servers/access-tokens
*/

@Injectable()
export class AuthService {
    constructor (){}
    getAccessToken(){
        const  credentials = {
            grant_type: 'authorization_code', //!!!!
            client_id: process.env.UID,
            client_secret: process.env.SECRET,
            // code 
        };

        axios({ // Requests can be made by passing the relevant config to axios.
            method: 'post',
            url: 'https://api.intra.42.fr/oauth/token',
            data: JSON.stringify(credentials),
        })
        .then((res) => { // If the promise is fulfilled
            console.log(res);
        })
        .catch((err) => { 
            console.log(err);
        })
    }
}


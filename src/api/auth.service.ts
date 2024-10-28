import axios from "axios";

const login  = (emailOrUsername: string , password: string) => {
    return axios.post ('http://localhost:5000/api/Auth/login', {
        emailOrUsername,
        password
    })
}

const validateCredentials = (emailOrUsername: string, password: string) => {
    return axios.post('http://localhost:5000/api/Auth/validateCredentials', {
        emailOrUsername,
        password
    });
}

const createAccount = (email: string, password: string,  username: string) => {
    return axios.post('http://localhost:5000/api/Auth/register', {
        email,
        password,
        username
    })
}

const sendCode = (email: string) => {
    return axios.post('http://localhost:5000/api/Auth/sendCode', {
        email
    })
}

const validateCode = (email: string, code: string) => {
    return axios.post('http://localhost:5000/api/Auth/verifyCode', {
        email,
        code
    })
}

const register = (email: string, password: string, username: string) => {
    return axios.post('http://localhost:5000/api/Auth/register', {
        email,
        password,
        username,
        
    })
}

export {login};
export {createAccount};
export {validateCredentials};
import axios from "axios";

const login  = (emailOrUsername, password) => {
    return axios.post ('http://localhost:5000/api/Auth/login', {
        emailOrUsername,
        password
    })
}

const createAccount = (email, password,  username) => {
    return axios.post('http://localhost:5000/api/Auth/register', {
        email,
        password,
        username
    })
}

export {login};
export {createAccount};
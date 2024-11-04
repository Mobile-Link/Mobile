import axios, {Axios, AxiosResponse} from "axios";

interface LoginResponse{
    token: string,
    idDevice: number
}

interface CreateAccounteResponse{
    token: string,
    idDevice: number
}

const updatePassword = (email: string, password: string, code: string) => {
    return axios.put('http://localhost:5000/api/Auth/updatePassword', {
        email, 
        password,
        code
    })
}

const login  = (emailOrUsername: string , password: string):Promise<AxiosResponse<CreateAccounteResponse, any>> => {
    return axios.post<CreateAccounteResponse> ('http://localhost:5000/api/Auth/login', {
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

const sendCodeNewAccount = (email: string) => {
    return axios.get(`http://localhost:5000/api/Auth/sendCodeNewAccount?email=${email}`)
}

const sendCode = (email: string) => {
    return axios.get(`http://localhost:5000/api/Auth/sendCode?email=${email}`)
}

const validateCode = (email: string, code: string) => {
    return axios.post(`http://localhost:5000/api/Auth/verifyCode?email=${email}&code=${code}`, {
        email,
        code
    })
}

const register = async (email: string, password: string, username: string, code: string, deviceName: string) => {
    try{
        const {data} = await axios.post(`http://localhost:5000/api/Auth/register?email=${email}&code=${code}`, {
            email,
            password,
            username,
            code,
            deviceName
        })
        
        return data;
    }catch (error){
        return null;
    }
}

const loginCreateDevice = async (emailOrUsername: string, password: string, code: string, deviceName: string): Promise<LoginResponse | null>=> {
    try{
        const {data} = await axios.post<LoginResponse>('http://localhost:5000/api/Auth/loginCreateDevice', {
            emailOrUsername,
            password,
            code,
            deviceName
        })
        return data;
        
    }catch (error){
        return null;
    }
}

export {login};
export {validateCredentials};
export {sendCodeNewAccount};
export {validateCode};
export {register};
export {loginCreateDevice};
export {updatePassword};
export {sendCode};


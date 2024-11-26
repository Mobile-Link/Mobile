import {AxiosResponse} from "axios";
import axiosDefault from "@/src/api/axiosConfig";
import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";
import {Platform} from "react-native";

interface LoginResponse{
    token: string,
    idDevice: number
}

interface CreateAccounteResponse{
    token: string,
    idDevice: number
}

const getPlatformOS = () => {
    switch (Platform.OS) {
        case "android":
            return EnDeviceOs.Android;
        case "ios":
            return EnDeviceOs.IOS;
        default:
            return EnDeviceOs.Unknown;
    }
}

const updatePassword = (email: string, password: string, code: string) => {
    return axiosDefault.put('/api/Auth/updatePassword', {
        email, 
        password,
        code
    })
}

const login  = (emailOrUsername: string , password: string, idDevice: number):Promise<AxiosResponse<CreateAccounteResponse, any>> => {
    return axiosDefault.post<CreateAccounteResponse> ('/api/Auth/login', {
        emailOrUsername,
        password,
        idDevice,
    })
}

const validateCredentials = (emailOrUsername: string, password: string) => {
    return axiosDefault.post('/api/Auth/validateCredentials', {
        emailOrUsername,
        password
    });
}

const sendCodeNewAccount = (email: string) => {
    return axiosDefault.get(`/api/Auth/sendCodeNewAccount?email=${email}`)
}

const sendCode = (email: string) => {
    return axiosDefault.get(`/api/Auth/sendCode?email=${email}`)
}

const validateCode = (email: string, code: string) => {
    return axiosDefault.post(`/api/Auth/verifyCode?email=${email}&code=${code}`, {
        email,
        code
    })
}

const register = async (email: string, password: string, username: string, code: string, deviceName: string) => {
    try{
        const {data} = await axiosDefault.post(`/api/Auth/register?email=${email}&code=${code}`, {
            email,
            password,
            username,
            code,
            deviceName,
            platformOs: getPlatformOS()
        })
        
        return data;
    }catch (error){
        return null;
    }
}

const loginCreateDevice = async (emailOrUsername: string, password: string, code: string, deviceName: string): Promise<LoginResponse | null>=> {
    try{
        const {data} = await axiosDefault.post<LoginResponse>('/api/Auth/loginCreateDevice', {
            emailOrUsername,
            password,
            code,
            deviceName,
            platformOs: getPlatformOS()
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


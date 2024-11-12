import {AxiosResponse} from "axios";
import { DeviceType } from "@/src/models/types/entities/DeviceType";
import axiosDefault from "./axiosConfig";
import {AccessLogType} from "@/src/models/types/entities/AccessLogType";

export const getUserDevices = ():Promise<AxiosResponse<DeviceType[], any>> => {
    return axiosDefault.get('http://localhost:5000/api/Device/GetUserDevices')
}

export const getLastAccess = (idDevice: number):Promise<AxiosResponse<AccessLogType, any>> => {
    return axiosDefault.get(`http://localhost:5000/api/Device/lastAccess?idDevice=${idDevice}`)
}


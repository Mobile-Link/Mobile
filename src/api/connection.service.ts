import {AxiosResponse} from "axios";
import axiosDefault from "@/src/api/axiosConfig";

export const getConnectedDevices = (): Promise<AxiosResponse<number[], any>> => {
    return axiosDefault.get("/api/Connection/GetConnectedDevices")
}

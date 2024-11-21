import {AxiosResponse} from "axios";
import axiosDefault from "@/src/api/axiosConfig";

export const startTransference = (idDevice: number, filePath: string, fileNameExtension: string, fileSize: number, destinationPath: string):Promise<AxiosResponse<number, any>> => {
    return axiosDefault.post(`/api/Transfer/startTransference`, {
        idDevice,
        filePath,
        fileNameExtension,
        fileSize,
        destinationPath
    })
}

export const sendFileChunk = (idTransfer: number, startByteIndex: number, byteArray: Uint8Array):Promise<AxiosResponse<boolean, any>> => {
    return axiosDefault.post(`/api/Transfer/sendFileChunk`, {
        idTransfer,
        startByteIndex,
        byteArray
    })
}
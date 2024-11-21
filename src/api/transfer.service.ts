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

export const sendFileChunk = async(idTransfer: number, startByteIndex: number, byteArray: Uint8Array): Promise<AxiosResponse<boolean>> => {

    try {
        const base64Data = btoa(String.fromCharCode(...byteArray));

        const formData = new FormData();
        formData.append('idTransfer', idTransfer.toString());
        formData.append('startByteIndex', startByteIndex.toString());
        formData.append('byteArray', base64Data);

        console.log("Enviando chunk:", { idTransfer, startByteIndex, base64Data });

        const response = await axiosDefault.post(`/api/Transfer/sendFileChunk`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;

    } catch (error) {
        console.error("Erro ao enviar o chunk:", error);
        throw error;
    }
}

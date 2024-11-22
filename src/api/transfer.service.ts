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

export const sendFileChunk = async (idTransfer: number, startByteIndex: number, base64Data: string): Promise<AxiosResponse<boolean>> => {
    try {
        const data = {
            idTransfer,
            startByteIndex,
            byteArray: base64Data,
        };

        const response = await axiosDefault.post("/api/Transfer/sendFileChunk", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    } catch (error) {
        console.error("Erro ao enviar chunk:", error);
        throw error;
    }
};
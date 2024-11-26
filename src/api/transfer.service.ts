import axios, {AxiosResponse} from "axios";
import axiosDefault from "@/src/api/axiosConfig";
import {TransferenceType} from "@/src/models/types/entities/TransferenceType";
import {TransferenceChunksType} from "@/src/models/types/entities/TransferenceChunks";

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

export const getTransferChunks = async (idTransfer: number): Promise<AxiosResponse<TransferenceChunksType[]>> => {
    return axiosDefault.get(`/api/transfer/getTransferChunks?idTransfer=${idTransfer}`)
}

export const getTransfer = async (idTransfer: number): Promise<AxiosResponse<TransferenceType>> => {
    return axiosDefault.get(`/api/transfer/getTransfer?idTransfer=${idTransfer}`)
}

export const getTransfers = async (): Promise<AxiosResponse<TransferenceType[]>> => {
    return axiosDefault.get(`/api/transfer/getTransfers`)
}

export const finishTransfer = async (idTransfer: number): Promise<AxiosResponse<TransferenceType[]>> => {
    return axiosDefault.post(`/api/transfer/finishTransfer?idTransfer=${idTransfer}`)
}
import * as FileSystem from "expo-file-system"
import {EncodingType} from "expo-file-system"
import {getTransfer, getTransferChunks} from "@/src/api/transfer.service";
import Tr from "react-native-paper-dates/src/translations/tr";

// export const ReceiveFileChunk = async (idTransfer: number, startByteIndex: number, byteArray: any) => {
//
//     const transference = await getTransfer(idTransfer)
//    
//     if(!transference){
//         return;
//     }
//    
//     const chunkPath = `${FileSystem.documentDirectory}chunks/${idTransfer}/${startByteIndex}.bin`;
//    
//     const chunkDir = `${FileSystem.documentDirectory}chunks/${idTransfer}`;
//     await FileSystem.makeDirectoryAsync(chunkDir, { intermediates: true });
//    
//     const fileExists = await FileSystem.getInfoAsync(chunkPath);
//     if (fileExists.exists){
//         console.log(`Chunk já existe no caminho: ${chunkPath}`);
//         return;
//     }
//    
//     await FileSystem.writeAsStringAsync(chunkPath, byteArray, {
//         encoding: EncodingType.Base64,
//     })
//     console.log(`Chunk salvo em: ${chunkPath}`);
//
//     const allChunksReceived = await checkAllChunksReceived(idTransfer);
//     if (allChunksReceived) {
//         console.log(`Todos os chunks recebidos para a transferência ${idTransfer}.`);
//         removeChunkTimer(idTransfer);
//     } else {
//         console.log(`Nem todos os chunks foram recebidos. Continuando o monitoramento.`);
//         startChunkTimer(idTransfer);
//     }
// }
//
// const assembleFile = async (idTransfer: number, transferDirectory: string, byteArray: any) => {
//    
// }
//
// const chunkTimers: {[idTransfer: number]: NodeJS.Timeout} = {};
//
// const checkAllChunksReceived = async (idTransfer: number) => {
//     const transference = await getTransfer(idTransfer);
//     if(!transference){
//         console.error(`Transferência ${idTransfer} não encontrada.`);
//         return;
//     }
//    
//     const receivedChunks = await getTransferChunks(transference)
//    
//     if(!receivedChunks){
//         console.log(`Nem todos os chunks da transferência ${idTransfer} foram recebidos.`);
//         return;
//     }
//
//     console.log(`Todos os chunks da transferência ${idTransfer} foram recebidos.`);
//     return true;
// }
//
// const startChunkTimer = (idTransfer: number, timeoutMinutes: number = 30) => {
//     if (chunkTimers[idTransfer]){
//         clearTimeout(chunkTimers[idTransfer])
//         console.log(`Timer anterior para transferência ${idTransfer} redefinido.`);
//     }
//    
//     const timeouts = timeoutMinutes * 60 * 1000;
//     chunkTimers[idTransfer] = setTimeout(async () => {
//         const allReceived = await checkAllChunksReceived(idTransfer);
//        
//         if(!allReceived){
//             console.warn(`Timeout! Nem todos os chunks da transferência ${idTransfer} chegaram.`);
//         }
//     }, timeouts);
//
//     console.log(`Timer iniciado para transferência ${idTransfer} com timeout de ${timeoutMinutes} minutos.`);
// }
//
// const removeChunkTimer = (idTransfer: number) => {
//     if (chunkTimers[idTransfer]) {
//         clearTimeout(chunkTimers[idTransfer]);
//         delete chunkTimers[idTransfer];
//         console.log(`Timer removido para transferência ${idTransfer}.`);
//     } else {
//         console.log(`Nenhum timer encontrado para a transferência ${idTransfer}.`);
//     }
// };


type TimerMap = { [idTransfer: number]: NodeJS.Timeout };

const activeTimers: TimerMap = {};

const CHUNK_TIMEOUT_MS = 30 * 60 * 1000;

const resetTimer = (idTransfer: number, onTimeout: () => void) => {
    if (activeTimers[idTransfer]) {
        clearTimeout(activeTimers[idTransfer]);
    }

    const timer = setTimeout(() => {
        console.log(`Transferência ${idTransfer} expirou por falta de chunks.`);
        onTimeout();
    }, CHUNK_TIMEOUT_MS);

    activeTimers[idTransfer] = timer;
};

const clearTimer = (idTransfer: number) => {
    if (activeTimers[idTransfer]) {
        clearTimeout(activeTimers[idTransfer]);
        delete activeTimers[idTransfer];
    }
};

export const assembleFile = async (
    idTransfer: number,
    destinationPath: string,
    fileName: string
) => {
    try {
        const chunksDirectory = `${FileSystem.documentDirectory}chunks/${idTransfer}/`;
        const outputFilePath = `${destinationPath}/${fileName}`;

        await FileSystem.makeDirectoryAsync(destinationPath, { intermediates: true });

        const chunkFiles = await FileSystem.readDirectoryAsync(chunksDirectory);

        const sortedChunks = chunkFiles.sort((a, b) => {
            const aIndex = parseInt(a.split(".")[0]);
            const bIndex = parseInt(b.split(".")[0]);
            return aIndex - bIndex;
        });

        const outputFileUri = `${outputFilePath}`;
        await FileSystem.writeAsStringAsync(outputFileUri, "", { encoding: FileSystem.EncodingType.Base64 });

        for (const chunk of sortedChunks) {
            const chunkPath = `${chunksDirectory}${chunk}`;
            const chunkContent = await FileSystem.readAsStringAsync(chunkPath, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await FileSystem.writeAsStringAsync(outputFileUri, chunkContent, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }

        console.log(`Arquivo combinado salvo em: ${outputFilePath}`);

        for (const chunk of sortedChunks) {
            const chunkPath = `${chunksDirectory}${chunk}`;
            await FileSystem.deleteAsync(chunkPath);
        }

        await FileSystem.deleteAsync(chunksDirectory);
        clearTimer(idTransfer);
        console.log(`Chunks e diretório removidos: ${chunksDirectory}`);
        return outputFilePath;
    } catch (error) {
        console.error(`Erro ao montar o arquivo: ${error}`);
        throw error;
    }
};

export const ReceiveFileChunk = async (
    idTransfer: number,
    startByteIndex: number,
    byteArray: any,
    totalChunks: number,
    fileName: string,
    destinationPath: string
) => {
    try {
        const chunkPath = `${FileSystem.documentDirectory}chunks/${idTransfer}/${startByteIndex}.bin`;
        const chunkDir = `${FileSystem.documentDirectory}chunks/${idTransfer}`;

        await FileSystem.makeDirectoryAsync(chunkDir, { intermediates: true });

        const fileExists = await FileSystem.getInfoAsync(chunkPath);
        if (fileExists.exists) {
            console.log(`Chunk já existe no caminho: ${chunkPath}`);
            return;
        }

        await FileSystem.writeAsStringAsync(chunkPath, byteArray, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log(`Chunk salvo em: ${chunkPath}`);

        const receivedChunks = await FileSystem.readDirectoryAsync(chunkDir);
        console.log(`Chunks recebidos: ${receivedChunks.length}/${totalChunks}`);

        resetTimer(idTransfer, async () => {
            console.error(`Timeout atingido para transferência ${idTransfer}`);
            clearTimer(idTransfer);
        });

        if (receivedChunks.length === totalChunks) {
            console.log("Todos os chunks foram recebidos. Combinando o arquivo...");
            const assembledFilePath = await assembleFile(idTransfer, destinationPath, fileName);
            console.log(`Arquivo combinado salvo em: ${assembledFilePath}`);
        }
    } catch (error) {
        console.error(`Erro ao receber o chunk: ${error}`);
        throw error;
    }
};
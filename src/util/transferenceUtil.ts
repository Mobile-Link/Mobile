import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import {TransferenceType} from "@/src/models/types/entities/TransferenceType";
import {finishTransfer, getTransfer, getTransferChunks} from "@/src/api/transfer.service";
import {getMimeTypeFromExtension} from "@/src/util/getMimeTypeFromExtension";
import { showMessage } from "react-native-flash-message";

type TimerMap = { [idTransfer: number]: NodeJS.Timeout };
const activeTimers: TimerMap = {};

const CHUNK_TIMEOUT_MS = 30 * 60 * 1000;

const getStoredFolder = async (): Promise<string | null> => {
    try {
        const folder = await SecureStore.getItemAsync("folder");
        return folder || null;
    } catch (error) {
        console.error("Erro ao recuperar o diretório armazenado:", error);
        return null;
    }
};

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



const assembleFileSemaphores: Map<number, { isProcessing: boolean; queue: Array<() => void> }> = new Map();

export const acquireSemaphore = (idTransference: number): Promise<void> => {
    return new Promise((resolve) => {
        let semaphore = assembleFileSemaphores.get(idTransference);
        if (!semaphore) {
            semaphore = { isProcessing: false, queue: [] };
            assembleFileSemaphores.set(idTransference, semaphore);
        }

        if (semaphore.isProcessing) {
            semaphore.queue.push(resolve);
        } else {
            semaphore.isProcessing = true;
            resolve();
        }
    });
};

export const releaseSemaphore = (idTransference: number) => {
    const semaphore = assembleFileSemaphores.get(idTransference);
    if (semaphore && semaphore.queue.length > 0) {
        const nextResolve = semaphore.queue.shift();
        if (nextResolve) {
            nextResolve();
        }
    } else if (semaphore) {
        semaphore.isProcessing = false;
    }
};

const isValidBase64 = (str: string): boolean => {
    try {
        return btoa(atob(str)) === str;
    } catch (e) {
        return false;
    }
};

const decodeBase64ToBytes = (base64Str: string): Uint8Array => {
    const binaryString = atob(base64Str);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
};

const encodeBytesToBase64 = (byteArray: Uint8Array): string => {
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryString);
};

export const assembleFile = async (
    transference: TransferenceType,
    chunks: Array<{ startByteIndex: number; filePath: string }>
): Promise<string | void> => {
    try {
        await acquireSemaphore(transference.idTransference);

        if (chunks.some((chunk) => !chunk || !chunk.filePath)) {
            console.error("Alguns chunks não estão disponíveis.");
            return;
        }

        const sortedChunks = chunks.sort((a, b) => a.startByteIndex - b.startByteIndex);
        const receivingFolder = await getStoredFolder();
        if (!receivingFolder) {
            throw new Error("Pasta de recebimento não configurada.");
        }

        const fileName = transference.fileNameExtension;
        const fileExtension = getMimeTypeFromExtension(fileName.split('.').pop() || '');
        const outputFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            receivingFolder,
            fileName.replace(`.${fileExtension}`, ''),
            fileExtension
        );

        console.log(`Criando arquivo combinado em: ${outputFileUri}`);

        await FileSystem.writeAsStringAsync(outputFileUri, "", {
            encoding: FileSystem.EncodingType.Base64,
        });

        let combinedData: Uint8Array[] = [];

        for (const chunk of sortedChunks) {
            const chunkContent = await FileSystem.readAsStringAsync(chunk.filePath, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (!isValidBase64(chunkContent)) {
                console.error(`O chunk ${chunk.startByteIndex} não contém uma string Base64 válida.`);
                return;
            }

            console.log(`Processando chunk ${chunk.startByteIndex}`);

            const chunkBuffer = decodeBase64ToBytes(chunkContent);

            combinedData.push(chunkBuffer);
        }

        const totalLength = combinedData.reduce((sum, buffer) => sum + buffer.length, 0);
        const allDataBuffer = new Uint8Array(totalLength);

        let offset = 0;
        for (const buffer of combinedData) {
            allDataBuffer.set(buffer, offset);
            offset += buffer.length;
        }

        const combinedBase64 = encodeBytesToBase64(allDataBuffer);

        await FileSystem.writeAsStringAsync(outputFileUri, combinedBase64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        console.log(`Arquivo combinado salvo em: ${outputFileUri}`);

        showMessage({
            message: "Arquivo recebido!",
            description: `O arquivo "${transference.fileNameExtension}" foi salvo com sucesso.`,
            type: "success",
            backgroundColor: "#4CAF50",
            duration: 2000,
        });

        await finishTransfer(transference.idTransference);
        return outputFileUri;
    } catch (error) {
        console.error(`Erro ao montar o arquivo: ${error}`);

        showMessage({
            message: "Erro ao processar arquivo",
            description: "Ocorreu um problema ao combinar os chunks recebidos.",
            type: "danger",
        });

        throw error;
    } finally {
        releaseSemaphore(transference.idTransference);
    }
};

export const ReceiveFileChunk = async (
    idTransfer: number,
    startByteIndex: number,
    byteArray: string
): Promise<void> => {
    try {
        const chunkPath = `${FileSystem.documentDirectory}chunks/${idTransfer}/${startByteIndex}`;
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

        resetTimer(idTransfer, async () => {
            console.error(`Timeout atingido para transferência ${idTransfer}`);
            clearTimer(idTransfer);
        });

        const transference = await getTransfer(idTransfer);
        if (!transference.data) {
            return;
        }

        const transferenceChunks = await getTransferChunks(idTransfer);

        if (transferenceChunks.data.length === receivedChunks.length) {
            console.log("Todos os chunks foram recebidos. Combinando o arquivo...");

            const chunks = await Promise.all(
                receivedChunks
                    .map((chunk) => ({
                        startByteIndex: parseInt(chunk, 10),
                        filePath: `${chunkDir}/${chunk}`,
                    }))
                    .sort((a, b) => a.startByteIndex - b.startByteIndex)
            );

            await assembleFile(transference.data, chunks);
        }

    } catch (error) {
        console.error(`Erro ao receber o chunk: ${error}`);

        showMessage({
            message: "Erro no recebimento",
            description: "Houve um problema ao receber os dados do arquivo.",
            type: "danger",
        });

        throw error;
    }
};

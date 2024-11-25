import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { TransferenceType } from "@/src/models/types/entities/TransferenceType";
import { getTransfer } from "@/src/api/transfer.service";

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

export const assembleFile = async (
    transference: TransferenceType,
    chunks: Array<{ startByteIndex: number, filePath: string }>
): Promise<string | void> => {
    try {
        const sortedChunks = chunks.sort((a, b) => a.startByteIndex - b.startByteIndex);

        const receivingFolder = await getStoredFolder();
        if (!receivingFolder) {
            throw new Error("Pasta de recebimento não configurada.");
        }

        const fileName = transference.fileNameExtension;
        const fileExtension = fileName.split('.').pop() || "bin";
        const outputFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            receivingFolder,
            fileName.replace(`.${fileExtension}`, ''),
            fileExtension
        );

        let combinedBase64 = "";

        for (const chunk of sortedChunks) {
            const chunkContent = await FileSystem.readAsStringAsync(chunk.filePath, {
                encoding: FileSystem.EncodingType.Base64,
            });
            combinedBase64 += chunkContent;
        }

        await FileSystem.writeAsStringAsync(outputFileUri, combinedBase64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const chunksDirectory = `${FileSystem.documentDirectory}chunks/${transference.idTransference}`;
        await FileSystem.deleteAsync(chunksDirectory, { idempotent: true });

        console.log(`Arquivo combinado salvo em: ${outputFileUri}`);
        return outputFileUri;
    } catch (error) {
        console.error(`Erro ao montar o arquivo: ${error}`);
        throw error;
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

        const chunks = receivedChunks.map((chunk) => ({
            startByteIndex: parseInt(chunk, 10),
            filePath: `${chunkDir}/${chunk}`,
        }));

        console.log("Todos os chunks foram recebidos. Combinando o arquivo...");
        await assembleFile(transference.data, chunks);
    } catch (error) {
        console.error(`Erro ao receber o chunk: ${error}`);
        throw error;
    }
};

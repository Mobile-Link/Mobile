import * as FileSystem from "expo-file-system"
import {getTransfer, getTransferChunks} from "@/src/api/transfer.service";
import {TransferenceType} from "@/src/models/types/entities/TransferenceType";
import * as SecureStore from "expo-secure-store";

type TimerMap = { [idTransfer: number]: NodeJS.Timeout };

const activeTimers: TimerMap = {};

const CHUNK_TIMEOUT_MS = 30 * 60 * 1000;

const getStoredFolder = () => {
    return new Promise<string | null>((resolve, reject) => {
        SecureStore.getItemAsync("folder").then((folder)=>{
            resolve(folder);
        }).catch(()=>resolve(null))
    })
}

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
) => {
    try {
        const sortedChunks = chunks.sort((a, b) => a.startByteIndex - b.startByteIndex);

        let destinationPath = ""

        console.log(JSON.stringify(transference))

        const receivingFolder = await getStoredFolder()

        if(!receivingFolder){
            return ;
        }

        if (!transference.destinationPath || transference.destinationPath.trim() === "" || transference.destinationPath == "/") {
            destinationPath = `${receivingFolder}/${transference.idTransference}`;
        } else {
            destinationPath = `${receivingFolder}/${transference.destinationPath}`;
        }

        const outputFilePath = `${destinationPath}/${transference.fileNameExtension}`;

        console.log("passou do makeDirecktioongliuerhg")

        const fileName = transference.fileNameExtension.split(".")

        // await FileSystem.StorageAccessFramework.createFileAsync(destinationPath, transference.fileNameExtension.replace(`.${fileName[fileName.length-1]}`, ''), fileName[fileName.length-1]);

        const chunk = chunks[0]

        const content = await FileSystem.readAsStringAsync(chunk.filePath)

        await FileSystem.StorageAccessFramework.writeAsStringAsync(outputFilePath, content)

        // for (const chunk of sortedChunks) {
        //     const chunkContent = await FileSystem.readAsStringAsync(chunk.filePath, {
        //         encoding: FileSystem.EncodingType.Base64,
        //     });
        //     await FileSystem.StorageAccessFramework.writeAsStringAsync(outputFilePath, chunkContent, {
        //         encoding: FileSystem.EncodingType.Base64, //TODO resolver está função para escrever os arquivos corretamente, sem salvar em uma string vazia, escrevre de chunk em chunk, ver RNFS(SAF)
        //     });
        // }

        // for (const chunk of sortedChunks) {
        //     await FileSystem.deleteAsync(chunk.filePath);
        // }

        const chunksDirectory = `${FileSystem.documentDirectory}chunks/${transference.idTransference}`;
        await FileSystem.deleteAsync(chunksDirectory);

        console.log(`Arquivo combinado salvo em: ${outputFilePath}`);
        return outputFilePath;
    } catch (error) {
        console.error(`Erro ao montar o arquivo: ${error}`);
        throw error;
    }
};

export const ReceiveFileChunk = async (
    idTransfer: number,
    startByteIndex: number,
    byteArray: string
) => {
    console.log("chegou na função")
    try {
        const chunkPath = `${FileSystem.documentDirectory}chunks/${idTransfer}/${startByteIndex}.bin`;
        const chunkDir = `${FileSystem.documentDirectory}chunks/${idTransfer}`;

        await FileSystem.makeDirectoryAsync(chunkDir, {intermediates: true});

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
        console.log(`Chunks recebidos: ${receivedChunks.length}`);

        resetTimer(idTransfer, async () => {
            console.error(`Timeout atingido para transferência ${idTransfer}`);
            clearTimer(idTransfer);
        });

        const transference = await getTransfer(idTransfer);
        console.log("Todos os chunks foram recebidos. Combinando o arquivo...");

        const chunks = receivedChunks.map((chunk) => ({
            startByteIndex: parseInt(chunk.split(".")[0]),
            filePath: `${chunkDir}/${chunk}`,
        }));

        if(!transference.data){
            return;
        }

        await assembleFile(transference.data, chunks);

    } catch (error) {
        console.error(`Erro ao receber o chunk: ${error}`);
        throw error;
    }
};
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useSecureStore} from "@/src/providers/SecureStoreProvider";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import LayoutAuth from "@/src/components/LayoutAuth";
import SelectDevice from "@/src/components/SelectDevice";
import * as FileSystem from "expo-file-system"
import Uuid from "expo-modules-core/src/uuid";
import {sendFileChunk, startTransference} from "@/src/api/transfer.service";

interface DeviceActive {
    idDevice: number;
    name: string;
    isActive: boolean;
}

const TransferenceScreen = () => {
    const {actions} = useSecureStore();
    const [selectedFile, setSelectedFile] = useState<string>('')
    const [fileSize, setFileSize] = useState<number>(0)
    const [device, setDevice] = useState<DeviceActive | null>(null);

    const selectFile = async (): Promise<void> => {
        DocumentPicker.getDocumentAsync({
            type: "*/*",
        })
            .then(result =>{
                
                if(result?.assets?.[0]?.uri){
                    setSelectedFile(result?.assets?.[0]?.uri)
                }
                
                if(result?.assets?.[0]?.size){
                    setFileSize(result?.assets?.[0]?.size)
                }
                
            })
            .catch(error => {
            console.error("Error selecting file:", error);
            return null;
        });
    };

    const transfer = async () => {
        if (device == null) {
            return;
        }

        const fileSplit = selectedFile.split('/');
        const fileName = fileSplit[fileSplit.length - 1];

        const documentDirectory = FileSystem.documentDirectory;
        const targetDirectory = `${documentDirectory}outgoing/${Uuid.v4()}`;
        const targetFile = `${targetDirectory}/${fileName}`;

        await FileSystem.copyAsync({ from: selectedFile, to: targetFile });

        const response = await startTransference(
            device?.idDevice,
            targetFile,
            fileName,
            fileSize,
            '/'
        );

        if (!response.data) {
            return; // TODO: retornar erro
        }

        console.log('Iniciando transferência...', response.data);

        const chunkSize = 512 * 1024;
        let startByteIndex = 0;
        let attemptCount = 0;
        const maxAttempts = 100;

        const sendChunkWithDelay = async (startByteIndex: number) => {
            try {
                const readResult = await FileSystem.readAsStringAsync(targetFile, {
                    encoding: FileSystem.EncodingType.Base64,
                    position: startByteIndex,
                    length: chunkSize,
                });

                const binaryData = atob(readResult);
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }

                console.log(`Enviando chunk de índice ${startByteIndex}`);
                const sendResponse = await sendFileChunk(response.data, startByteIndex, byteArray);
                console.log('Resposta do servidor:', sendResponse.data);
            } catch (error) {
                console.error(`Erro no envio do chunk ${startByteIndex}:`, error);
            }
        };
        
        while (startByteIndex < fileSize && attemptCount < maxAttempts) {
            attemptCount++;
            
            await sendChunkWithDelay(startByteIndex);

            startByteIndex += chunkSize;

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('Transferência concluída!');
    };

    return (
        <LayoutAuth>
            <View style={styles.centralSection}>
                <TouchableOpacity style={styles.deviceContainer} onPress={() => selectFile()}>
                    <MaterialCommunityIcons name="cellphone" size={210} color="#D1B3FF" />
                </TouchableOpacity>

                <View style={styles.arrowsContainer}>
                    <MaterialCommunityIcons name="arrow-right" size={50} color="#D1B3FF"/>
                    <MaterialCommunityIcons name="arrow-left" size={50} color="#D1B3FF"/>
                </View>

                <View>
                    <SelectDevice
                        title="Dispositivos"
                        iconName="monitor"
                        iconSize={200}
                        iconColor="#D1B3FF"
                        onDeviceSelect={(device) => setDevice(device)}
                    />
                </View>

                <TouchableOpacity style={styles.floatingButton} onPress={() => transfer()}>
                    <MaterialCommunityIcons 
                        name="send" size={40} 
                        color={"#FFFFFF"}
                        style={{transform: [{rotate: '-45deg'}]}}
                    />
                </TouchableOpacity>
            </View>
        </LayoutAuth>
    );
};

const styles = StyleSheet.create({
    centralSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 20,
        width: '100%',
    },
    deviceContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    selectText: {
        color: '#D1B3FF',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    arrowsContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 80,
    },
    floatingButton: {
        backgroundColor: '#9465CF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: 140,
        paddingBottom: 5,
        paddingLeft: 5,
    },
});

export default TransferenceScreen;
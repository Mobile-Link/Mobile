import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import LayoutAuth from "@/src/components/LayoutAuth";
import SelectDevice from "@/src/components/SelectDevice";
import * as FileSystem from "expo-file-system";
import Uuid from "expo-modules-core/src/uuid";
import { sendFileChunk, startTransference } from "@/src/api/transfer.service";
import { showMessage } from 'react-native-flash-message';

interface DeviceActive {
    idDevice: number;
    name: string;
    isActive: boolean;
}

export const TransferenceScreen = () => {
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [fileSize, setFileSize] = useState<number>(0);
    const [device, setDevice] = useState<DeviceActive | null>(null);

    const selectFile = async (): Promise<void> => {
        DocumentPicker.getDocumentAsync({ type: "*/*" })
            .then(result => {
                if (result?.assets?.[0]?.uri) setSelectedFile(result.assets[0].uri);
                if (result?.assets?.[0]?.size) setFileSize(result.assets[0].size);
            })
            .catch(error => {
                console.error("Error selecting file:", error);
                showMessage({
                    message: "Erro ao selecionar arquivo",
                    description: "Não foi possível selecionar o arquivo. Tente novamente.",
                    type: "danger",
                });
            });
    };

    const transfer = async () => {
        if (!device) {
            showMessage({
                message: "Erro na transferência",
                description: "Selecione um dispositivo para enviar o arquivo.",
                type: "danger",
            });
            return;
        }

        if (!selectedFile) {
            showMessage({
                message: "Erro na transferência",
                description: "Selecione um arquivo para enviar.",
                type: "danger",
            });
            return;
        }

        try {
            const fileSplit = selectedFile.split("/");
            const fileName = fileSplit[fileSplit.length - 1];

            const documentDirectory = FileSystem.documentDirectory;
            const targetDirectory = `${documentDirectory}outgoing/${Uuid.v4()}`;
            const targetFile = `${targetDirectory}/${fileName}`;
            await FileSystem.copyAsync({ from: selectedFile, to: targetFile });

            const response = await startTransference(device.idDevice, targetFile, fileName, fileSize, "/");

            if (!response.data) {
                throw new Error("Erro ao iniciar transferência.");
            }

            console.log("Transferência iniciada, ID:", response.data);

            const chunkSize = 1024 * 1024;
            let startByteIndex = 0;

            while (startByteIndex < fileSize) {
                const readResult = await FileSystem.readAsStringAsync(targetFile, {
                    encoding: FileSystem.EncodingType.Base64,
                    position: startByteIndex,
                    length: chunkSize,
                });

                await sendFileChunk(response.data, startByteIndex, readResult);
                startByteIndex += chunkSize;
            }

            showMessage({
                message: "Transferência concluída!",
                description: "Seu arquivo foi enviado com sucesso.",
                type: "success",
                backgroundColor: "#4CAF50",
                duration: 2000,
            });

            setSelectedFile('');
        } catch (error) {
            console.error("Erro na transferência:", error);
            showMessage({
                message: "Erro na transferência",
                description: "Ocorreu um erro durante o envio do arquivo. Tente novamente.",
                type: "danger",
            });
        }
        
    };

    const clearSelection = () => {
        setSelectedFile('');
        setDevice(null);
    };

    return (
        <LayoutAuth>
            <View style={styles.centralSection}>
                <TouchableOpacity style={styles.deviceContainer} onPress={() => selectFile()}>
                    <MaterialCommunityIcons name="cellphone" size={210} color="#D1B3FF" />
                    {selectedFile && (
                        <Text style={styles.iconText}>{selectedFile.split('/').pop()}</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.arrowsContainer}>
                    <MaterialCommunityIcons name="arrow-right" size={50} color="#D1B3FF" />
                    <MaterialCommunityIcons name="arrow-left" size={50} color="#D1B3FF" />
                </View>

                <SelectDevice
                    title="Dispositivos"
                    iconName="monitor"
                    iconSize={200}
                    iconColor="#D1B3FF"
                    onDeviceSelect={(device) => setDevice(device)}
                    clearDeviceSelection={clearSelection}
                />

                <TouchableOpacity style={styles.floatingButtonLeft} onPress={clearSelection}>
                    <MaterialCommunityIcons
                        name="close-circle"
                        size={40}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                

                <TouchableOpacity style={styles.floatingButton} onPress={transfer}>
                    <MaterialCommunityIcons
                        name="send"
                        size={40}
                        color={"#FFFFFF"}
                        style={{ transform: [{ rotate: '-45deg' }] }}
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
        marginTop: 10,
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
    floatingButtonLeft: {
        backgroundColor: '#D1B3FF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 40,
        bottom: 20,
    },
    iconText: {
        position: 'absolute',
        textAlign: 'center',
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        width: 180,
        top: 90,
    },
});

export default TransferenceScreen;

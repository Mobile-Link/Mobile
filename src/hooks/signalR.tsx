import React, {useState, useEffect, Context, useContext} from 'react';
import {createContext} from 'react';
import * as signalR from '@microsoft/signalr';
import {HubConnection} from "@microsoft/signalr";
import {SignalRProviderType} from "@/src/models/types/SignalRProviderType";
import * as SecureStore from "expo-secure-store";
import {ReceiveFileChunk} from "@/src/util/transferenceUtil";

export const SignalRContext = createContext<SignalRProviderType | undefined>(undefined);

export const useSignalR = () => {
    const connection = useContext(SignalRContext);
    if (!connection) {
        throw new Error("Use signalR inside the provider")
    }
    return connection
}

//TODO PEGAR COMO BASE O SOCKETCONNECTION DO DESKTOP E PASSAR IDDEVICE MOCKADO POR ENQUANTO

export const SignalRProvider = ({children}: { children: React.ReactNode }) => {
    const [connection, setConnection] = useState<HubConnection | undefined>(undefined);
    const [statusType, setStatusType] = useState('Disconnected');


    const connectAccount = () => {

        SecureStore.getItemAsync("token").then(async (token) => {

            if (token == null) {
                return
            }

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`http://201.41.169.132/connectionhub`,
                    {accessTokenFactory: () => token}).build();
            setConnection(connection);

            try {
                await connection.start();
                setStatusType('Connected');

                connection.on('ReceiveMessage', (userId, message) => {
                    console.log(`Received ${userId}: ${message}`);
                });

                connection.on('UserConnected', (userId, message) => {
                    console.log(`User ${userId} : ${message}`);
                });

                connection.on('UserDisconnected', (userId, message) => {
                    console.log(`User ${userId} : ${message}`);
                });

                connection.on(
                    'ReceiveFileChunk',
                    (idTransfer, startByteIndex, byteArray) => {
                        ReceiveFileChunk(idTransfer, startByteIndex, byteArray).then(() => {
                        })
                            console.log(`${idTransfer}, ${startByteIndex}, ${byteArray.length}`)
                        
                    }
                    //TODO não está chegando no receiveFileChunk
                );

                connection.on(
                    'ReceiveNewTransference',
                    (idTransfer, filePath, fileSize) => {
                        console.log(
                            `New transfer started ${idTransfer}, ${filePath}, ${fileSize}`
                        );
                    }
                );
                
                connection.on('ReSendChunks', (idTransfer: number) => {
                    console.log(`Reviando os chunks da transferência ${idTransfer}`)
                })

                connection.on('FinalizeTransference', (idTransference) => {
                    console.log(`Transference ${idTransference} finalized`);
                });
            } catch (error) {
                setStatusType('Connecting')
                console.log("Connection failed: ", error);
            }
        })
    };

    useEffect(() => {
        if (connection) {
            connection.on('Closed', async (error) => {
                setStatusType('Disconnected');
                console.log('Connection closed', error);
                await retryConnection();
            });
        }
    }, [connection]);

    const retryConnection = async () => {
        let retries = 3;

        while (retries > 0) {
            try {
                await connection?.start();
                setStatusType('Connected');
                break;
            } catch (error) {
                retries--;
                console.log('Connection failed: ', error);
            }
        }

        if (retries === 0) {
            setStatusType('Disconnected');
        }
    }; //TODO melhorar para reconectar de tempos em tempos

    return (
        <SignalRContext.Provider value={{connection, connectAccount}}>
            {children}
        </SignalRContext.Provider>
    );
}


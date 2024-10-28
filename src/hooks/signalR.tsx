import React, {useState, useEffect, Context, useContext} from 'react';
import {createContext} from 'react';
import * as signalR from '@microsoft/signalr';
import {HubConnection} from "@microsoft/signalr";
import {SignalRProviderType} from "@/src/models/types/SignalRProviderType";

export const SignalRContext = createContext < SignalRProviderType | undefined >(undefined);

export const useSignalR = () => {
    const connection = useContext(SignalRContext);
    if(!connection){
        throw new Error("Use signalR inside the provider")
    }
    return connection
}

//TODO PEGAR COMO BASE O SOCKETCONNECTION DO DESKTOP E PASSAR IDDEVICE MOCKADO POR ENQUANTO

export const SignalRProvider = ({children}: {children: React.ReactNode}) => {
    const [connection, setConnection] = useState < HubConnection | undefined > (undefined);

    const [statusType, setStatusType] = useState ('Disconnected');
    
    const storageContent = {
        IdDevice: '1',
        Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZERldmljZSI6IjEiLCJqdGkiOiI5MWFhODA2Ni0xZTJiLTQyYzQtOWY0YS1jNzM2MDg2ZDkwMzYiLCJleHAiOjE3Mjk3NDg1MjAsImlzcyI6Ik1vYmlsZUxpbmsiLCJhdWQiOiJNb2JpbGVMaW5rIn0.Xo2giQhgNR-b_qs5YX8jSvYhPc0fSX2jmwubYo5Dz3Y'
    };
        
    useEffect(() => {
        if(storageContent.IdDevice){
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`http://localhost:5000/connectionhub`,
                    {accessTokenFactory: () => storageContent.Token}).build();
            setConnection(newConnection);
        }        

    }, []);

    const connectAccount = () => {
        
        console.log('Conectando...'+ connection);
        
        if(connection){
            const connect = async () => {
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
                            console.log(
                                `New chunk received ${idTransfer}, ${startByteIndex}, Length: ${byteArray.length}`
                            );
                        }
                    );

                    connection.on(
                        'ReceiveNewTransference',
                        (idTransfer, filePath, fileSize) => {
                            console.log(
                                `New transfer started ${idTransfer}, ${filePath}, ${fileSize}`
                            );
                        }
                    );

                    connection.on('FinalizeTransference', (idTransference) => {
                        console.log(`Transference ${idTransference} finalized`);
                    });
                } catch (error) {
                    setStatusType('Connecting')
                    console.log("Connection failed: ",error);
                }
            };
            connect();
        }
    };

    useEffect(() => {
        if (connection){
            connection.on('Closed', async(error) => {
                setStatusType('Disconnected');
                console.log('Connection closed', error);
                await retryConnection();
            });
        }
    }, [connection]);
    
    const retryConnection = async () => {
        let retries = 3;
        
        while(retries > 0){
            try {
                await connection?.start();
                setStatusType('Connected');
                break;
            } catch (error) {
                retries--;
                console.log('Connection failed: ', error);
            }
        }
        
        if(retries === 0){
            setStatusType('Disconnected');
        }
    };
    
    return (
        <SignalRContext.Provider value={{connection, connectAccount}}>
            {children}
        </SignalRContext.Provider>
    );
}


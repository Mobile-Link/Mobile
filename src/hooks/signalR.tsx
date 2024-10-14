import {useState, useEffect, Context, useContext} from 'react';
import {createContext} from 'react';
import * as signalR from '@microsoft/signalr';
import {HubConnection} from "@microsoft/signalr";

export const SignalRContext = createContext < HubConnection | undefined >(undefined);

export const useSignalR = () => {
    const connection = useContext(SignalRContext);
    if(!connection){
        throw new Error("Use signalR inside the provider")
    }
    return connection
}

export const SignalRProvider = ({children}) => {
    const [connection, setConnection] = useState < HubConnection | undefined > (undefined);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/chathub')
            .build();

        newConnection.start()
            .then(() => {
                setConnection(newConnection);
            })
            .catch(error => {
                console.error('SignalR connection error:', error);
            });

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);
    return (
        <SignalRContext.Provider value={connection}>{children}</SignalRContext.Provider>
    )
}


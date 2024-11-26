import {HubConnection} from "@microsoft/signalr";

export type SignalRProviderType ={
    connection: HubConnection | undefined,
    connectAccount: () => void,
};
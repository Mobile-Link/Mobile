import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import {SecureStoreProvider} from "@/src/providers/SecureStoreProvider";
import Auth from "@/src/app/auth";
import {SignalRProvider} from "@/src/hooks/signalR";
import LoginScreen from "@/src/app/loginScreen";

const Index = () => {

    return (
        <SecureStoreProvider>
            <SignalRProvider>
                <LoginScreen>
                    <Auth>
                        <Text>Conectado</Text>
                    </Auth>
                </LoginScreen>
            </SignalRProvider>
        </SecureStoreProvider>
    );
};

export default Index;
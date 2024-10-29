import axios from "axios";
import React, {useEffect} from "react";
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Text, View} from "react-native";
import {useSecureStore} from "@/src/providers/SecureStoreProvider";
import {useSignalR} from "@/src/hooks/signalR";
const Auth = ({children}: {children: React.ReactNode}) =>  {
    useEffect(() => {
        const checkFirstAccess = async () => {
            try {
                const Token = await actions.getStoredToken();
                if (Token == null ) {
                  router.replace('/loginScreen');
                } else {
                    actions.setToken(Token);
                    
                    console.log("Chamei o connectAccount");
                    
                  router.replace('/homepage');
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkFirstAccess();
    }, [router]);

    const{actions} = useSecureStore();
    
    return(
        <View>
            <Text>Carregando...</Text>
        </View>
    )
}

export default Auth;
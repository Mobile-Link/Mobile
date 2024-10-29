import React, {useState} from "react";
import {Button, TextInput, View, Text} from "react-native";
import {loginCreateDevice} from "@/src/api/auth.service";
import {router, useLocalSearchParams} from "expo-router";
import {useSecureStore} from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
}

const LoginCreateDeviceScreen = () => {
    const {email, password, code} = useLocalSearchParams<{route: any, email:string, password: string, code: string}>();
    const [error, setError] = useState<ErrorState | null>(null);
    const [deviceName, setDeviceName] = useState('');

    const{actions} = useSecureStore();
    
    const submitLoginCreateDevice = async () => {
        try{
            const data = await loginCreateDevice(email, password, code, deviceName);
            
            if(data){
                data.token
                actions.setToken(data.token);
                actions.setIdDevice(data.idDevice);
                router.replace('/homepage');
            }else{
                setError({error: 'Erro ao criar dispositivo' });
            }
        }catch (error){
            setError({error: 'Erro ao criar dispositivo' });
        }
    }

    return(
        <View>
            <Text>Criar dispositivo</Text>
            <TextInput
                placeholder="Nome do dispositivo"
                value={deviceName}
                onChangeText={(text) => setDeviceName(text)}
            />
            <Button title="Criar" onPress={submitLoginCreateDevice}/>
        </View>
    )
}


export default LoginCreateDeviceScreen;
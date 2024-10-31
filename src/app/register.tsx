import React, {useState} from "react";
import {View, Text, TextInput, Button} from "react-native";
import {loginCreateDevice, register} from "@/src/api/auth.service";
import {router, useLocalSearchParams} from "expo-router";
import {useSecureStore} from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
}

const Register = () => {
    const {email, code} = useLocalSearchParams<{route: any, email:string, code: string, from: string}>();
    const [username, setUsername] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);

    const{actions} = useSecureStore();
    
    const registerAccount = async () => {
        try{
            const registerUser = await register(email, password, username, code, deviceName);

            if(registerUser){
                registerUser.token
                actions.setToken(registerUser.token);
                actions.setIdDevice(registerUser.idDevice);
                router.replace('/(app)/');
            }else{
                setError({error: 'Erro ao criar a conta' });
            }
        }catch (error){
            setError({error: 'Erro ao criar a conta' });
        }
    }

    return(
        <View>
            <Text>Deu certo</Text>
            <TextInput
                placeholder="Nome de usuário"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                placeholder="Sua senha"
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TextInput
                placeholder="Nome do dispositivo"
                value={deviceName}
                onChangeText={(text) => setDeviceName(text)}
            />
            {error && <Text style={{ color: 'red' }}>{error.error}</Text>}
            <Button title="Criar" onPress={registerAccount}/>
        </View>

    )
}


export default Register;
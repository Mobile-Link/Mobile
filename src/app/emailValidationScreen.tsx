import React, {useState} from "react";
import {View, Text, TextInput, Button} from "react-native";
import {validateCode} from "@/src/api/auth.service";
import {router, useLocalSearchParams} from "expo-router";

type ErrorState = {
    error: string;
}

const EmailValidationScreen = () => {
    const {email, password, from} = useLocalSearchParams<{route: any, email:string, password: string, from: string}>();
    const [code, setCode] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);
    
    const submitEmailCreateAccount = async () => {
        
        try{
            const verifyCode = await validateCode(email, code);
            
            
            if (verifyCode.status === 200){
                router.replace(`/register?email=${email}&code=${code}`);
            }
        }catch (error){
            setError({error: 'Código inválido ou expirado' });
        }
    }
    
    const submitEmailLogin = async () => {
        try{
            const verifyCode = await validateCode(email, code);
            
            if (verifyCode.status === 200){
                router.replace(`/loginCreateDeviceScreen?email=${email}&password=${password}&code=${code}`);
            }else{
                setError({error: 'Código inválido ou expirado' });
            }
        }catch(error){
            setError({error: 'Código inválido ou expirado' });
        }
    }
    
    return(
        <View>
            <Text>Código foi enviado ao email para validação</Text>
            <TextInput
                placeholder="Código"
                value={code}
                onChangeText={(text) => setCode(text)}>
            </TextInput>
            {error && <Text style={{ color: 'red' }}>{error.error}</Text>}
            {from === 'createAccount' && <Button title="Validar" onPress={submitEmailCreateAccount}/>}
            {from === 'login' && <Button title="Validar" onPress={submitEmailLogin}/>}
        </View>
        
    )
}


export default EmailValidationScreen;
import React, {useState} from "react";
import {View, Text, TextInput, Button} from "react-native";
import {register} from "@/src/api/auth.service";
import {router, useLocalSearchParams} from "expo-router";

type ErrorState = {
    error: string;
}

const Register = () => {
    const {email, password, } = useLocalSearchParams<{route: any, email:string, password: string, from: string}>();
    const [code, setCode] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);

    // const registerAccount = async () => {
    //      try{
    //          const registerUser = await register( email, password, username, code, deviceName);
    //      }catch (error){
    //          setError({error: 'Erro ao criar conta' });
    //      }
    // }
    //
    return(
        <View>
            
        </View>

    )
}


export default Register;
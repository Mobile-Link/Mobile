import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { router } from "expo-router";
import {login, validateCredentials} from '../api/auth.service';
import {useSecureStore} from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
}

const LoginScreen = ({children}: {children: React.ReactNode}) => {
  const [emailOrUsername, setemailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorState | null>(null);

  const{actions} = useSecureStore();
  const submitLogin = async () => {
      try{
          const idDevice = await actions.getStoredIdDevice();
          
          if(idDevice == null){
              const response = await validateCredentials(emailOrUsername, password);
              
              if (response.status === 200) {
                  router.replace(`/emailValidationScreen?email=${emailOrUsername}&password=${password}&from=login`);
              }else{
                    setError({error: 'Credenciais inválidas' });
              }   
          }
          
          if(idDevice != null){
              const response = await login(emailOrUsername, password);
              
              if(response.status === 200){
                  const token = response.data.token;
                  actions.setToken(token);
                  router.replace('/(app)/');
              }else{
                  setError({error: 'Credenciais inválidas' });
              }
          }
      }catch (error){
            setError({error: 'Credenciais inválidas',  });
      }
      
  }

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Usuário"
        value={emailOrUsername}
        onChangeText={(text) => setemailOrUsername(text)}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {error && <Text style={{ color: 'red' }}>{error.error}</Text>}
      <Button title="Entrar" onPress={submitLogin} />
      <Button title="Criar Conta" onPress={() => router.replace('/createAccountScreen')} />
    </View>
  );
};

export default LoginScreen;
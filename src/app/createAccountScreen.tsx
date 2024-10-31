import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { router } from "expo-router";
import {sendCode} from '../api/auth.service';

type ErrorState = {
    error: string;
}

const CreateAccountScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorState | null>(null);

  const submitCreateAccount = async () => {
      try{
          const response = await sendCode(email);
            if(response.status === 200){
                router.replace(`/emailValidationScreen?email=${email}&from=createAccount`);
            }else{
                setError({error: 'Erro ao criar conta' });
            }
      }catch (error){
          setError({error: `Erro ao criar ${error}`});
      }
  }

  return (
    <View>
      <Text>Criar Conta</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {error && <Text style={{ color: 'red' }}>{error.error}</Text>}
      <Button title="Criar" onPress={submitCreateAccount} />
      <Button title="Cancelar" onPress={() => router.back()} />
    </View>
  );
};

export default CreateAccountScreen;
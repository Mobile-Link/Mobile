import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { router } from "expo-router";
import { login } from '../api/auth.service';
import *  as SecureStore from 'expo-secure-store';

const LoginScreen = () => {
  const [emailOrUsername, setemailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    login(emailOrUsername, password)
      .then((result) => {
        if (result.status == 200) {
          router.replace('/homepage'); // Mover para a homepage após login bem-sucedido
        } else {
          setError(result.data);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

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
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar Conta" onPress={() => router.replace('/createAccountScreen')} />
    </View>
  );
};

export default LoginScreen;
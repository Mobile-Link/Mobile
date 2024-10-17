import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { router } from "expo-router";
import { createAccount } from '../api/auth.service';

const CreateAccountScreen = () => {
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState(null);

  const handleCreateAccountSubmit = () => {
    createAccount(email, password, username)
      .then((result) => {
        if (result.status == 200) {
          router.replace('/codeAccountScreen'); // Mover para a codeAccountScreen após criar conta
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
      <Text>Criar Conta</Text>
      <TextInput
        placeholder="Nome"
        value={username}
        onChangeText={(text) => setusername(text)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setpassword(text)}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Criar" onPress={handleCreateAccountSubmit} />
      <Button title="Cancelar" onPress={() => router.back()} />
    </View>
  );
};

export default CreateAccountScreen;
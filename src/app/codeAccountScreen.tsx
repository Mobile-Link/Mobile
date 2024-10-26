import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from "expo-router";
import { codeAccount } from '../api/auth.service';

const CodeAccountScreen = () => {
  const [code, setCode] = useState('');

  const handleCodeAccountSubmit = () => {
    codeAccount(code)
    .then((result) => {
        if (result.data == 200) {
            router.replace('/homepage')
        }
        else{
            Alert.alert('Invalid Code')
        }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inserir Codigo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu codigo"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Enviar Codigo" onPress={handleCodeAccountSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CodeAccountScreen;
import { useSignalR } from "@/hooks/signalR";
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { connection } = useSignalR();

  const handleLogin = () => {
    connection.invoke('login', username, password)
      .then((result) => {
        if (result.success) {
          // Login bem-sucedido, redirecionar para a próxima tela
        } else {
          setError(result.error);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleCreateAccount = () => {
    setIsCreatingAccount(true);
  };

  const handleCreateAccountSubmit = () => {
    connection.invoke('createAccount', nome, email, senha)
      .then((result) => {
        if (result.success) {
          // Conta criada com sucesso, redirecionar para a próxima tela
        } else {
          setError(result.error);
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
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar Conta" onPress={handleCreateAccount} />
      {isCreatingAccount && (
        <View>
          <Text>Criar Conta</Text>
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={(text) => setNome(text)}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="Senha"
            secureTextEntry={true}
            value={senha}
            onChangeText={(text) => setSenha(text)}
          />
          <Button title="Criar" onPress={handleCreateAccountSubmit} />
          <Button title="Cancelar" onPress={() => setIsCreatingAccount(false)} />
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
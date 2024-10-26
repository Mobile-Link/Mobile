import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

const Index = () => {

  useEffect(() => {
    const checkFirstAccess = async () => {
      try {
        // TODO getSecureStoreProvider
        // const Token = await SecureStore.getItemAsync("Token"); // Remover parêntese extra
        // //android keychange
        // if (Token == null ) {
        //   // Primeiro acesso, redireciona para a tela de cadastro
        //   router.replace('/loginScreen');
        //   // Após redirecionar, você pode definir que não é mais o primeiro acesso  
        //   await AsyncStorage.setItem('Token', 'false');
        // } else {
        //   // Não é o primeiro acesso, redireciona para a tela de login
        //   router.replace('/homepage');
        // }
      } catch (error) {
        console.error(error);
      }
    };

    checkFirstAccess();
  }, [router]);

  return (
    <View>
      <Text>Carregando...</Text>
    </View>
  );
};

export default Index;
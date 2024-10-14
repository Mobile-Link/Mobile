import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

const Index = () => {

  useEffect(() => {
    const checkFirstAccess = async () => {
      try {
        const isFirstAccess = await AsyncStorage.getItem('isFirstAccess'); // Remover parêntese extra

        if (isFirstAccess === null) {
          // Primeiro acesso, redireciona para a tela de cadastro
          router.replace('/createAccountScreen');
          // Após redirecionar, você pode definir que não é mais o primeiro acesso
          await AsyncStorage.setItem('isFirstAccess', 'false');
        } else {
          // Não é o primeiro acesso, redireciona para a tela de login
          router.replace('/loginScreen');
        }
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
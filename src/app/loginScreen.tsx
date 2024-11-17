import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { router } from "expo-router";
import { login, validateCredentials } from '../api/auth.service';
import { useSecureStore } from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
}

const LoginScreen = () => {
    const [emailOrUsername, setemailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);

    const { actions } = useSecureStore();
    const submitLogin = async () => {
        try {
            const idDevice = await actions.getStoredIdDevice();

            if (idDevice == null) {
                const response = await validateCredentials(emailOrUsername, password);
                if (response.status === 200) {
                    router.replace(`/emailValidationScreen?email=${emailOrUsername}&password=${password}&from=login`);
                } else {
                    setError({ error: 'Credenciais inválidas' });
                }
            }
            
            if (idDevice != null) {
                const response = await login(emailOrUsername, password, idDevice);
                actions.setToken(response.data.token);
                
                console.log(response)
                if (response.status === 200) {
                    router.replace('/(auth)/');
                } else {
                    console.log(response)
                    setError({ error: 'Credenciais inválidas' });
                }
            }
        } catch (error) {
            setError({ error: 'Credenciais inválidas' });
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
        
            <View style={styles.purpleBackground} />
            
            <Image style={styles.logo} source={require("../../assets/images/logo-branca.png")}/>
            
            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Faça seu Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email / Usuário"
                    placeholderTextColor="#9E9E9E"
                    value={emailOrUsername}
                    onChangeText={(text) => setemailOrUsername(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#9E9E9E"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />

                {error && <Text style={styles.errorText}>{error.error}</Text>}

                <Text onPress={() => router.replace('/forgotPasswordScreen')} style={styles.forgotPassword}>Esqueceu sua senha? <Text style={styles.linkText}>Clique Aqui</Text></Text>
                

                <TouchableOpacity style={styles.loginButton} onPress={submitLogin}>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.registerContainer} onPress={() => router.replace('/createAccountScreen')}>
                <Text style={styles.registerText}>
                    Não possui uma conta? <Text style={styles.linkText}>Criar Conta</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    purpleBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: '#9465CF',
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        color: '#9465CF',
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-thin'
    },
    input: {
        borderWidth: 1,
        borderColor: '#9465CF',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 30,
        color: '#333333',
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 20,
    },
    linkText: {
        color: '#9465CF',
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#9465CF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    registerText: {
        color: '#333333',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 110,
        height: 110,
        margin: 43,
        alignSelf: "center"
    }
});

export default LoginScreen;

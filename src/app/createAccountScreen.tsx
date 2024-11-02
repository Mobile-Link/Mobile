import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { router } from "expo-router";
import { sendCode } from '../api/auth.service';
import { Ionicons } from '@expo/vector-icons'; // Lembre-se de instalar expo-vector-icons se ainda não tiver.

type ErrorState = {
    error: string;
};

const CreateAccountScreen = () => {
    const [email, setEmail] = useState('');
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
        <View style={styles.container}>
            <View style={styles.purpleBackground}></View>

            <View style={styles.whiteContainer}>
                <View style={styles.iconContainer}>
                {/* Ícone de login */}
            </View>
                <Text style={styles.title}>Crie sua conta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#A35CD4"
                />
                {error && <Text style={styles.error}>{error.error}</Text>}

                <TouchableOpacity style={styles.button} onPress={submitCreateAccount}>
                    <Text style={styles.buttonText}>Enviar email</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/loginScreen')}>
                    <Text style={styles.loginText}>
                        Já possui uma conta? <Text style={styles.loginLink}>Entrar</Text>
                    </Text>
                </TouchableOpacity>
            </View>
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
        height: '40%',
        backgroundColor: '#9465CF',
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        marginTop: '50%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#9465CF',
        marginVertical: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        backgroundColor: '#9465CF',
        borderRadius: 25,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 0,
    },
    input: {
        width: '100%',
        borderColor: '#9465CF',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginVertical: 90,
        color: '#333333',
    },
    button: {
        width: '100%',
        backgroundColor: '#9465CF',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 14,
        color: '#000',
        marginTop: 100,
        left: 80,
    },
    loginLink: {
        fontWeight: 'bold',
        color: '#333333',
    },
    error: {
        color: 'red',
        marginTop: 0,
    },
});

export default CreateAccountScreen;

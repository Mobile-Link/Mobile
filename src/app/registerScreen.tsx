import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { register } from "@/src/api/auth.service";
import { router, useLocalSearchParams } from "expo-router";
import { useSecureStore } from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
};

const Register = () => {
    const { email, code } = useLocalSearchParams<{ route: any, email: string, code: string, from: string }>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);

    const { actions } = useSecureStore();

    const registerAccount = async () => {
        if (password !== confirmPassword) {
            setError({ error: 'As senhas não coincidem' });
            return;
        }

        try {
            const registerUser = await register(email, password, username, code, deviceName);

            if (registerUser) {
                actions.setToken(registerUser.token);
                actions.setIdDevice(registerUser.idDevice);
                router.replace('/(auth)/');
            } else {
                setError({ error: `Email já cadastrado` });
            }
        } catch (error) {
            setError({ error: `Erro ao criar a conta ${error}` });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.purpleBackground} />

            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Crie sua Conta</Text>
                <Text style={styles.subtitle}>Sua senha deve conter no mínimo 8 caracteres</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome de Usuário"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#9E9E9E"
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Dispositivo"
                        value={deviceName}
                        onChangeText={setDeviceName}
                        placeholderTextColor="#9E9E9E"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#9E9E9E"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmação de Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#9E9E9E"
                    />
                </View>

                {error && <Text style={styles.errorText}>{error.error}</Text>}

                <TouchableOpacity style={styles.validateButton} onPress={registerAccount}>
                    <Text style={styles.validateButtonText}>Próximo</Text>
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
        marginTop: '30%',
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
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#9465CF',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#F0F0F0',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333333',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    validateButton: {
        backgroundColor: '#9465CF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    validateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Register;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {login, updatePassword} from "@/src/api/auth.service";
import {router, useLocalSearchParams} from "expo-router";
import {useSecureStore} from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
};

const ResetPasswordScreen = () => {
    const { email, code } = useLocalSearchParams<{ email: string; code: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);

    const {actions} = useSecureStore();
    const resetPassword = async () => {
        if (password !== confirmPassword) {
            setError({ error: 'As senhas não coincidem' });
            return;
        }

        try {
            const response = await updatePassword(email, password, code);
            
            if (response.status === 200) {
                const loginAccount = await login(email, password);
                
                if(loginAccount.status === 200) {
                    actions.setToken(loginAccount.data.token);
                }

                router.replace('/(auth)/');
            } else {
                setError({ error: 'Erro ao atualizar a senha' });
            }
        } catch (error) {
            setError({ error: `Erro ao atualizar a senha: ${error}` });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.purpleBackground} />

            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Digite sua nova senha</Text>
                <Text style={styles.subtitle}>Sua senha deve conter no mínimo 8 caractéres</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nova Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#9E9E9E"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#9E9E9E"
                    />
                </View>

                {error && <Text style={styles.errorText}>{error.error}</Text>}

                <TouchableOpacity style={styles.validateButton} onPress={resetPassword}>
                    <Text style={styles.validateButtonText}>Enviar</Text>
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
        backgroundColor: '#7E57C2',
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
        color: '#7E57C2',
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
        borderColor: '#7E57C2',
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
        backgroundColor: '#7E57C2',
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

export default ResetPasswordScreen;

import React, {useState} from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {sendCode, updatePassword} from "@/src/api/auth.service";
import {router, useLocalSearchParams} from "expo-router";
import {Ionicons} from '@expo/vector-icons';

type ErrorState = {
    error: string;
};

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<ErrorState | null>(null);

    const resetPassword = async () => {
        try {
            const code = await sendCode(email);

            if (code.status === 200) {
                router.replace(`/emailValidationScreen?email=${email}&from=resetPassword`);
            } else {
                setError({error: 'Erro ao atualizar a senha'});
            }
        } catch {
            
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.purpleBackground}></View>

            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Esqueceu sua Senha</Text>
                <Text style={styles.subtitle}>Digite seu email para mais instruções</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
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
        height: '35%',
        backgroundColor: '#9465CF',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginTop: 40,
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        marginTop: '50%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#9465CF',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
        marginVertical: 10,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#9465CF',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    inputIcon: {
        marginRight: 10,
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
        paddingHorizontal: 80,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    validateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;

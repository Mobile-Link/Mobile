import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { validateCode } from "@/src/api/auth.service";
import { router, useLocalSearchParams } from "expo-router";

type ErrorState = {
    error: string;
};

const EmailValidationScreen = () => {
    const { email, password, from } = useLocalSearchParams<{ route: any; email: string; password: string; from: string }>();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<ErrorState | null>(null);

    const inputs = useRef<Array<TextInput | null>>([]);

    const handleCodeChange = (index: number, value: string) => {
        const newCode = [...code];

        if (value.length === 6) {
            const fullCode = value.split("");
            setCode(fullCode);
            inputs.current[5]?.focus();
            return;
        }

        newCode[index] = value;
        setCode(newCode);

        if (value && index < inputs.current.length - 1) {
            inputs.current[index + 1]?.focus();
        }
        else if (!value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const submitValidation = async () => {
        try {
            const fullCode = code.join('');
            const verifyCode = await validateCode(email, fullCode);

            if (verifyCode.status === 200) {
                switch (from) {
                    case 'resetPassword':
                        router.replace(`/updatePasswordScreen?email=${email}&code=${fullCode}`);
                        break;
                    case 'createAccount':
                        router.replace(`/registerScreen?email=${email}&code=${fullCode}&from=createAccount`);
                        break;
                    case 'login':
                        router.replace(`/loginCreateDeviceScreen?email=${email}&password=${password}&code=${fullCode}`);
                        break;
                    default:
                        break;
                }
            } else {
                setError({ error: 'Código inválido ou expirado' });
            }
        } catch (error) {
            setError({ error: 'Código inválido ou expirado' });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {/* Fundo roxo */}
            <View style={styles.purpleBackground} />

            {/* Contêiner branco arredondado */}
            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Código de Verificação</Text>
                <Text style={styles.subtitle}>Verifique seu email para colocar o código de verificação correto</Text>

                {/* Input para código de verificação */}
                <View style={styles.codeInputContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(el) => (inputs.current[index] = el)}
                            style={styles.codeInput}
                            maxLength={1}
                            keyboardType="numeric"
                            value={digit}
                            onChangeText={(value) => handleCodeChange(index, value)}
                        />
                    ))}
                </View>

                {error && <Text style={styles.errorText}>{error.error}</Text>}

                {/* Botão Validar */}
                <TouchableOpacity style={styles.validateButton} onPress={submitValidation}>
                    <Text style={styles.validateButtonText}>Validar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    codeInput: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        textAlign: 'center',
        fontSize: 18,
        color: '#333333',
        marginHorizontal: 5,
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
    },
    validateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EmailValidationScreen;
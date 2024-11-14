import React, { useState } from "react";
import {TextInput, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image} from "react-native";
import { loginCreateDevice } from "@/src/api/auth.service";
import { router, useLocalSearchParams } from "expo-router";
import { useSecureStore } from "@/src/providers/SecureStoreProvider";

type ErrorState = {
    error: string;
};

const LoginCreateDeviceScreen = () => {
    const { email, password, code } = useLocalSearchParams<{ route: any; email: string; password: string; code: string }>();
    const [error, setError] = useState<ErrorState | null>(null);
    const [deviceName, setDeviceName] = useState("");
    const { actions } = useSecureStore();

    const submitLoginCreateDevice = async () => {
        try {
            const data = await loginCreateDevice(email, password, code, deviceName);

            if (data) {
                actions.setToken(data.token);
                actions.setIdDevice(data.idDevice);
                router.replace("/(auth)/");
            } else {
                setError({ error: "Erro ao criar dispositivo" });
            }
        } catch (error) {
            setError({ error: "Erro ao criar dispositivo" });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {/* Fundo roxo */}
            <View style={styles.purpleBackground} />
            
            <Image style={styles.logo} source={require("../../assets/images/logo-branca.png")}/>

            {/* Contêiner branco arredondado */}
            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Nomeie seu dispositivo</Text>

                {/* Input para nome do dispositivo */}
                <Text style={styles.label}>Nome do Dispositivo</Text>
                <TextInput
                    style={styles.input}
                    value={deviceName}
                    onChangeText={(text) => setDeviceName(text)}
                />

                {error && <Text style={styles.errorText}>{error.error}</Text>}

                {/* Botão Entrar */}
                <TouchableOpacity style={styles.enterButton} onPress={submitLoginCreateDevice}>
                    <Text style={styles.enterButtonText}>Entrar</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        color: '#7E57C2',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 150,
    },
    label: {
        fontSize: 14,
        color: '#7E57C2',
        marginBottom: 5,
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#7E57C2',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 110,
        color: '#333333',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    enterButton: {
        backgroundColor: '#7E57C2',
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 10,
        alignItems: 'center',
    },
    enterButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 110,
        height: 110,
        margin: 43,
        alignSelf: "center"
    }
});

export default LoginCreateDeviceScreen;

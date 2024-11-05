// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useSecureStore } from "@/src/providers/SecureStoreProvider";
import {router} from "expo-router";

const DevicesScreen = () => {
    const { actions } = useSecureStore();


    const logout = () => {
        actions.deleteToken();
        router.replace("/loginScreen");
    }

    return (
        <View style={styles.container}>
            <View style={styles.purpleBackground}></View>

            <View style={styles.whiteContainer}>
                <Text style={styles.titulo}>Tela de Dispositivos</Text>
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
        marginTop: '25%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default DevicesScreen;

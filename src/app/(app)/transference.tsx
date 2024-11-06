import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSecureStore } from "@/src/providers/SecureStoreProvider";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TransferenceScreen = () => {
    const { actions } = useSecureStore();

    const logout = () => {
        actions.deleteToken();
        router.replace("/loginScreen");
    };

    // Function to select a file
    const selectFile = async (): Promise<void> => {
        DocumentPicker.getDocumentAsync({
            type: "*/*",
        }).catch(error => {
            console.error("Error selecting file:", error);
            return null;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.purpleBackground} />

            <View style={styles.whiteContainer}>
                <View style={styles.centralSection}>
                    {/* File selection button */}
                    <TouchableOpacity style={styles.deviceContainer} onPress={selectFile}>
                        <FontAwesome5 name="mobile-alt" size={150} color="#D1B3FF" />
                    </TouchableOpacity>

                    <View style={styles.arrowsContainer}>
                        <MaterialCommunityIcons name="arrow-right" size={50} color="#D1B3FF" />
                        <MaterialCommunityIcons name="arrow-left" size={50} color="#D1B3FF" />
                    </View>

                    <TouchableOpacity style={styles.deviceContainer}>
                        <MaterialCommunityIcons name="monitor" size={150} color="#D1B3FF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.floatingButton}>
                        <Ionicons name="paper-plane-outline" size={40} color={"#FFFFFF"} />
                    </TouchableOpacity>
                </View>
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
        height: 300,
        backgroundColor: '#9465CF',
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingTop: 20,
        marginTop: "25%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#000000',
    },
    centralSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 30,
        width: '100%',
    },
    deviceContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    selectText: {
        color: '#D1B3FF',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    arrowsContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 80,
        marginBottom: 10,
        marginTop: 10,
    },
    floatingButton: {
        backgroundColor: '#9465CF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: 140,
        top: 20,
    },
});

export default TransferenceScreen;
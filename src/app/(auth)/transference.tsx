import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSecureStore} from "@/src/providers/SecureStoreProvider";
import {MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AccountMenu from "@/src/components/AccountMenu";
import LayoutAuth from "@/src/components/LayoutAuth";
import SelectDevice from "@/src/components/SelectDevice";

const TransferenceScreen = () => {
    const {actions} = useSecureStore();

    const selectFile = async (): Promise<void> => {
        DocumentPicker.getDocumentAsync({
            type: "*/*",
        }).catch(error => {
            console.error("Error selecting file:", error);
            return null;
        });
    };

    return (
        <LayoutAuth>
            <View style={styles.centralSection}>
                <TouchableOpacity style={styles.deviceContainer} onPress={() => selectFile()}>
                    <MaterialCommunityIcons name="cellphone" size={160} color="#D1B3FF"/>
                </TouchableOpacity>

                <View style={styles.arrowsContainer}>
                    <MaterialCommunityIcons name="arrow-right" size={50} color="#D1B3FF"/>
                    <MaterialCommunityIcons name="arrow-left" size={50} color="#D1B3FF"/>
                </View>

                <View>
                    <SelectDevice
                        title="Dispositivos"
                        iconName="monitor"
                        iconSize={160}
                        iconColor="#D1B3FF"
                    />
                </View>

                <TouchableOpacity style={styles.floatingButton}>
                    <MaterialCommunityIcons name="send" size={40} color={"#FFFFFF"}
                                            style={{transform: [{rotate: '-45deg'}]}}/>
                </TouchableOpacity>
            </View>
        </LayoutAuth>
    );
};

const styles = StyleSheet.create({
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
        paddingBottom: 5,
        paddingLeft: 5,
    },
});

export default TransferenceScreen;
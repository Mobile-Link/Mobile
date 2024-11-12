import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useSecureStore} from "@/src/providers/SecureStoreProvider";
import {router} from "expo-router";
import {useFocusEffect} from '@react-navigation/native';

const AccountMenu = () => {
    const {actions} = useSecureStore();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const logout = () => {
        actions.deleteToken();
        router.replace("/loginScreen");
    };

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    useFocusEffect(
        useCallback(() => {
            setIsMenuVisible(false);
        }, [])
    );

    return (
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
            <View style={styles.container}>
                <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                }}>
                    <MaterialCommunityIcons name="account-circle" size={40} color='#FFFFFF'/>
                </TouchableOpacity>

                {isMenuVisible && (
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={styles.menu}>
                            <TouchableOpacity style={styles.menuItemContainer}>
                                <MaterialCommunityIcons name="cog-outline" size={25}/>
                                <Text style={styles.menuItem}>Configurações</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItemContainer}>
                                <MaterialCommunityIcons name="invert-colors" size={25}/>
                                <Text style={styles.menuItem}>Tema do Aplicativo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={logout} style={styles.menuItemContainer}>
                                <MaterialCommunityIcons name="logout-variant" size={25} color={'#ff0000'}/>
                                <Text style={styles.menuItem}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    menu: {
        position: 'absolute',
        top: 50,
        right: 0,
        backgroundColor: '#FFFFFF',
        width: 200,
        padding: 7,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
        zIndex: 10,
    },
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    menuItem: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
});

export default AccountMenu;

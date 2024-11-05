import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSecureStore } from "@/src/providers/SecureStoreProvider";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet } from "react-native";

export default function Layout() {
    const { actions } = useSecureStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        actions.getStoredToken().then((token) => {
            if (token == null) {
                router.replace('/loginScreen');
                return;
            }

            setLoading(false);
            actions.setToken(token);
        });
    }, []);

    return (
        <>
            {!loading && (
                <Tabs
                    screenOptions={{
                        tabBarShowLabel: true,
                        tabBarStyle: styles.tabBar,
                        tabBarActiveTintColor: '#8A2BE2',
                        tabBarInactiveTintColor: '#3A3A3A',
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            tabBarLabel: 'Início',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home-outline" size={24} color={color} />
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="history"
                        options={{
                            headerShown: false,
                            tabBarLabel: 'Histórico',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="time-outline" size={24} color={color} />
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="transference"
                        options={{
                            headerShown: false,
                            tabBarLabel: 'Transferir',
                            tabBarIcon: ({ color }) => (
                                <View style={styles.centerButton}>
                                    <Ionicons name="paper-plane-outline" size={28} color="white" />
                                </View>
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="access"
                        options={{
                            headerShown: false,
                            tabBarLabel: 'Acessos',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="clipboard-outline" size={24} color={color} />
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="devices"
                        options={{
                            headerShown: false,
                            tabBarLabel: 'Dispositivos',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="desktop-outline" size={24} color={color} />
                            ),
                        }}
                    />
                </Tabs>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 70,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,
        paddingBottom: 10,
        paddingTop: 10,
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#8A2BE2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
        elevation: 5,
        position: 'absolute',
        top: -40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});

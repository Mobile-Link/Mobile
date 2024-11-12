import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AccountMenu from "@/src/components/AccountMenu";
import Card from "@/src/components/DefaultCards";

const HistoryScreen = () => {
    return (
        <View style={styles.container}>
            <AccountMenu/>
            <View style={styles.purpleBackground}/>

            <View style={styles.whiteContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.titulo}>Histórico de transferências</Text>
                    <Card></Card>
                </ScrollView>
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
        backgroundColor: '#EEEEEE',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 20,
        marginTop: '25%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    centralSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 10,
        width: '100%',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default HistoryScreen;

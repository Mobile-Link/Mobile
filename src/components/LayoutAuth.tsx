import {StyleSheet, View, Text} from "react-native";
import AccountMenu from "@/src/components/AccountMenu";
import React, {ReactNode} from "react";

const LayoutAuth = ({children, title}: {children: ReactNode , title?: string}) => {
    
    
    
    
    return (
        <View style={styles.container}>
            <AccountMenu/>
            <View style={styles.purpleBackground}/>
            <View style={styles.whiteContainer}>
                {title && <Text style={styles.title}>{title}</Text>}
                {children}
            </View>
        </View>
    )
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
        elevation: 10,
    },
    centralSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 10,
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    }
})

export default LayoutAuth
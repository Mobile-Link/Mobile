import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DetailsProps{
    title: string;
    subtitle?: string;
    icon: any;
    iconColor?: string;
    onPress?: () => void;
    children?: React.ReactNode;
    statusText?: string;
    statusColor?: string;
}

const Card = ({ title, icon, statusText, statusColor, onPress, children} : DetailsProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.row}>
                {icon && (
                    <MaterialCommunityIcons name={icon} size={40} color="#333" style={styles.icon} />
                )}
                <View style={styles.textContainer}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {statusText && (
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {statusText}
                        </Text>
                    )}
                </View>
            </View>
            {children && <View style={styles.content}>{children}</View>}
            <MaterialCommunityIcons name="chevron-right" style={styles.chevronIcon} size={30} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 35,
        paddingHorizontal: 30,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        marginTop: 10,
    },
    chevronIcon: {
        color: '#333',
        right: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default Card;

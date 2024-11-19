import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";

interface CardProps {
    title?: string;
    subtitle?: string;
    icon?: any;
    iconColor?: any;
    statusText?: string;
    statusColor?: string;
    onPress?: () => void;
    children?: React.ReactNode;
    iconRight?: any;
    cardStyle?: StyleProp<ViewStyle>;
    rowStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<ViewStyle>;
    subtitleStyle?: StyleProp<TextStyle>;
    iconRightStyle?: StyleProp<ViewStyle>;
}

const Card = ({
                  title,
                  subtitle,
                  icon,
                  iconColor,
                  statusText,
                  statusColor = '#000',
                  onPress,
                  iconRight,
                  children,
                  cardStyle,
                  rowStyle,
                  textStyle,
                  iconStyle,
                  subtitleStyle,
                  iconRightStyle,
              }: CardProps) => {
    return (
        <TouchableOpacity disabled={!onPress} style={[styles.card, cardStyle]} onPress={onPress}>
            <View style={[styles.row, rowStyle]}>
                {icon && (
                    <MaterialCommunityIcons
                        name={icon}
                        size={40}
                        color={iconColor}
                        style={[styles.icon, iconStyle]}
                    />
                )}
                <View style={styles.textContainer}>
                    {title && <Text style={[styles.title, textStyle]}>{title}</Text>}
                    {statusText && (
                        <Text style={[styles.statusText, {color: statusColor}]}>
                            {statusText}
                        </Text>
                    )}
                </View>
                {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
            </View>
            {children && <View style={styles.content}>{children}</View>}
            {iconRight && (
                <MaterialCommunityIcons
                    name={iconRight}
                    size={30}
                    style={[styles.chevronIcon, iconRightStyle]}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
    },
    content: {
        marginTop: 5,
    },
    chevronIcon: {
        color: '#333',
        position: 'absolute',
        right: 10,
        top: '50%',
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default Card;

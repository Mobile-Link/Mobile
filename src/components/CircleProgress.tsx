import Svg, { Circle } from "react-native-svg";
import React from "react";
import { StyleSheet, View, Text, ViewStyle, TextStyle } from "react-native";

interface CircularProgressProps {
    percentage: number;
    radius?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    centerText?: string;
    textStyle?: TextStyle;
    style?: ViewStyle;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
                                                               percentage,
                                                               radius = 60,
                                                               strokeWidth = 10,
                                                               color = "#3498db",
                                                               backgroundColor = "#e0e0e0",
                                                               centerText,
                                                               textStyle,
                                                               style,
                                                           }) => {
    const size = radius * 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
        <View style={[styles.chartContainer, style]}>
            <Svg width={size} height={size}>
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${progress}, ${circumference}`}
                    strokeLinecap="round"
                    fill="none"
                    rotation="-90"
                    origin={`${radius}, ${radius}`}
                />
            </Svg>
            {centerText && (
                <View style={styles.textContainer}>
                    <Text style={[styles.text, textStyle]}>{centerText}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
});

export default CircularProgress;

import React from "react";
import {View, Text, StyleSheet} from "react-native";

interface LegendProps {
    activeCount?: number;
    inactiveCount?: number;
    activeColor?: string;
    inactiveColor?: string;
    text1Label?: string;
    text2Label?: string;
}

const Legend: React.FC<LegendProps> = ({
                                           activeCount,
                                           inactiveCount,
                                           activeColor = "#4caf50",
                                           inactiveColor = "#f44336",
                                           text1Label,
                                           text2Label
                                       }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={[styles.dot, {backgroundColor: activeColor}]}/>
                <Text style={styles.label}>
                    {text1Label} {activeCount}
                </Text>
            </View>

            <View style={styles.row}>
                <View style={[styles.dot, {backgroundColor: inactiveColor}]}/>
                <Text style={styles.label}>
                    {text2Label} {inactiveCount}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    label: {
        fontSize: 16,
        color: "#333",
    },
});

export default Legend;

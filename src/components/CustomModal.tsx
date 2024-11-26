import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    Dimensions,
    Pressable,
} from "react-native";

const screenHeight = Dimensions.get("screen").height;

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    details: { label: string; value: string }[];
}

const CustomModal = ({ visible, onClose, title, details }: CustomModalProps) => {
    const [modalPosition] = useState(new Animated.Value(screenHeight));

    useEffect(() => {
        if (visible) {
            Animated.timing(modalPosition, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(modalPosition, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <Pressable style={styles.background} onPress={onClose} />

            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        transform: [{ translateY: modalPosition }],
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {details.map((item, index) => (
                        <View key={index} style={styles.detailBox}>
                            <Text style={styles.detailDate}>{item.label}</Text>
                            <Text style={styles.detailDescription}>{item.value}</Text>
                        </View>
                    ))}
                </ScrollView>
            </Animated.View>
        </View>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
    },
    background: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        maxHeight: "80%",
        position: "absolute",
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: "center"
    },
    closeText: {
        fontSize: 16,
        color: "#9465CF",
    },
    contentContainer: {
        paddingBottom: 20,
    },
    detailBox: {
        borderWidth: 1,
        borderColor: "#9465CF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    detailDate: {
        fontSize: 14,
        color: "#9465CF",
        marginBottom: 5,
    },
    detailDescription: {
        fontSize: 14,
        color: "#000",
    },
});

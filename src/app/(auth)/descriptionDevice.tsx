import {useLocalSearchParams} from "expo-router";
import {View, Text, StyleSheet, ScrollView} from "react-native";
import React from "react";
import LayoutAuth from "@/src/components/LayoutAuth";
import Card from "@/src/components/DefaultCards";
import CircleProgress from "@/src/components/CircleProgress";
import Legend from "@/src/components/Legend";


const progressData = {
    labels: ["Swim"], // optional
    data: [0.5]
};

const DescriptionDeviceScreen = () => {
    const params = useLocalSearchParams();
    const {name, os, isActive} = params;

    return (
        <LayoutAuth title="Detalhes do Dispositivo">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Card
                    title="Transferir para esse dispositivo"
                    textStyle={{textAlign: "center", fontSize: 16}}
                    cardStyle={{width: "70%", alignSelf: "center"}}
                >

                </Card>
                <Card 
                    title={name + ''} 
                    iconRight={"pencil"} 
                >
                </Card>
                <Card>
                    <View style={styles.availableSpace}>
                        <CircleProgress
                            percentage={10}
                            radius={100}
                            strokeWidth={19}
                            color="#1192E8"
                            backgroundColor="#e0e0e0"
                            style={{marginBottom: 20, marginTop: 20, alignItems: "flex-start"}}
                        />
                        <Legend
                            activeColor="#1192E8"
                            inactiveColor="#e0e0e0"
                            text1Label="GB Livres"
                            text2Label="GB Usados"
                        />
                    </View>
                </Card>
                <Card>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                    <Text>fkjgnbetithyg</Text>
                </Card>
                <Card
                    icon="trash-can-outline"
                    iconStyle={{}}
                    title="Excluir dispositivo"
                    textStyle={{color: "#F44336"}}
                    cardStyle={{height: "9%"}}
                    iconColor="#F44336"
                />
            </ScrollView>
        </LayoutAuth>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        marginBottom: 5,
    },
    availableSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});

export default DescriptionDeviceScreen;
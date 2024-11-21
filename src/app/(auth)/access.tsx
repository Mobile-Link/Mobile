import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import Card from "@/src/components/DefaultCards";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {getUserDevices} from "@/src/api/device.service";
import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";
import LayoutAuth from "@/src/components/LayoutAuth";
import CustomModal from "@/src/components/CustomModal";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import getDeviceIcon from "@/src/constants/plataformIcon";

const AccessScreen = () => {
    const [devices, setDevices] = useState<DeviceType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        getUserDevices()
            .then((response) => {
                response.data.map((device) => {
                    device.lastAccessDate = new Date(device.lastAccessDate);
                });

                setDevices(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        navigation.addListener("blur", () => {
            setModalVisible(false);
        });
        
    }, []);

    const handleCardPress = (device: DeviceType) => {
        setSelectedDevice(device);
        setModalVisible(true);
    };

    return (
        <>
            <LayoutAuth title="Histórico de acessos">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {devices.length === 0 ? (
                        <Text style={styles.noDevicesText}>Nenhum histórico encontrado.</Text>
                    ) : (
                        devices.map((device: DeviceType) => (
                            <Card
                                key={device.idDevice}
                                title={device.name}
                                icon={getDeviceIcon(device.enDeviceOs)}
                                iconRight={"chevron-right"}
                                onPress={() => handleCardPress(device)}
                            >
                                <Text style={styles.content}>
                                    Último acesso: {device.lastAccessDate.toLocaleString("pt-BR", {dateStyle: "short"})}
                                </Text>
                            </Card>
                        ))
                    )}
                </ScrollView>

                <View>
                    <TouchableOpacity style={styles.bottomSearch}>
                        <MaterialCommunityIcons
                            name="magnify"
                            size={40}
                            color="#ffffff"
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.bottomFilter}>
                        <MaterialCommunityIcons
                            name="filter-outline"
                            size={40}
                            color="#ffffff"
                        />
                    </TouchableOpacity>
                </View>
            </LayoutAuth>

            {selectedDevice && (
                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    title={selectedDevice.name}
                    details={[
                        {
                            label: "Último acesso",
                            value: selectedDevice.lastAccessDate.toLocaleString("pt-BR"),
                        },
                        {
                            label: "Sistema Operacional",
                            value: EnDeviceOs[selectedDevice.enDeviceOs],
                        },
                        {
                            label: "Sistema Operacional",
                            value: EnDeviceOs[selectedDevice.enDeviceOs],
                        },
                        {
                            label: "Sistema Operacional",
                            value: EnDeviceOs[selectedDevice.enDeviceOs],
                        },
                        {
                            label: "Sistema Operacional",
                            value: EnDeviceOs[selectedDevice.enDeviceOs],
                        },
                    ]}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    noDevicesText: {
        fontSize: 16,
        fontStyle: "italic",
        color: "#888",
    },
    content: {
        fontSize: 16,
        color: "#888787",
    },
    bottomFilter:{
        position: "absolute",
        alignSelf: "flex-end",
        backgroundColor: "#9465CF",
        padding: 8,
        borderRadius: 30,
        bottom: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    bottomSearch:{
        position: "absolute",
        alignSelf: "flex-end",
        backgroundColor: "#9465CF",
        padding: 8,
        borderRadius: 30,
        bottom: 70,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    }
});

export default AccessScreen;

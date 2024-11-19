import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text} from "react-native";
import {useNavigation} from "@react-navigation/native"; // Import necessário
import Card from "@/src/components/DefaultCards";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {getUserDevices} from "@/src/api/device.service";
import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";
import LayoutAuth from "@/src/components/LayoutAuth";
import CustomModal from "@/src/components/CustomModal";

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
        return navigation.addListener("blur", () => {
            setModalVisible(false);
        });
        
    }, [navigation]);

    const getDeviceIcon = (os: EnDeviceOs) => {
        switch (os) {
            case 1:
                return "linux";
            case 2:
                return "microsoft-windows";
            case 3:
                return "android";
            case 4:
                return "apple";
            case 5:
                return "apple-finder";
            default:
                return "help-circle";
        }
    };

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
});

export default AccessScreen;

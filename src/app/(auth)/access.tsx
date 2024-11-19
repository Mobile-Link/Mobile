import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AccountMenu from "@/src/components/AccountMenu";
import Card from "@/src/components/DefaultCards";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {getLastAccess, getUserDevices} from "@/src/api/device.service";
import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";
import LayoutAuth from "@/src/components/LayoutAuth";

const AccessScreen = () => {
    const [devices, setDevices] = useState<DeviceType[]>([]);

    useEffect(() => {
        getUserDevices()
            .then((response) => {

                response.data.map((device) => {
                    device.lastAccessDate = new Date(device.lastAccessDate)
                })

                setDevices(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const getDeviceIcon = (os: EnDeviceOs) => {
        switch (os) {
            case 1:
                return 'linux';
            case 2:
                return 'microsoft-windows';
            case 3:
                return 'android';
            case 4:
                return 'apple';
            case 5:
                return 'apple-finder';
            default:
                return 'help-circle';
        }
    };

    return (
        <LayoutAuth title="Histórico de acessos">
            <ScrollView showsVerticalScrollIndicator={false}>
                {devices.length === 0 ? (
                    <Text style={styles.noDevicesText}>Nenhum histórico encontrado.</Text>
                ) : (
                    devices.map((device: DeviceType) => (device &&
                        <Card
                            key={device.idDevice}
                            title={device.name}
                            icon={getDeviceIcon(device.enDeviceOs)}
                            iconRight={"chevron-right"}
                            onPress={() => {}}
                        >
                            <Text style={styles.content}>Último acesso: {device.lastAccessDate.toLocaleString()}</Text>
                        </Card>
                    ))
                )}
            </ScrollView>
        </LayoutAuth>
    );
};

const styles = StyleSheet.create({
    noDevicesText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
    },
    content: {
        fontSize: 16,
        color: '#888787',
    },
});

export default AccessScreen;

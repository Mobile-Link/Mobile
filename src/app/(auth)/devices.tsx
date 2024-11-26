import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import Card from "@/src/components/DefaultCards";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {getUserDevices} from "@/src/api/device.service";
import {useSignalR} from "@/src/hooks/signalR";
import {getConnectedDevices} from "@/src/api/connection.service";
import {router} from "expo-router";
import LayoutAuth from "@/src/components/LayoutAuth";
import getDeviceIcon from "@/src/constants/plataformIcon";


type DeviceActive = DeviceType & {isActive: boolean}

const DevicesScreen = () => {
    const [devices, setDevices] = useState<DeviceActive[]>([]);
    const {connection} = useSignalR();
    
    const populateDevices = (connectedDevices: number[]) => {
        getUserDevices()
            .then((response) => {
                
                let active: DeviceActive[] = []
                
                response.data.map((device)=> {
                    active.push({...device, isActive: connectedDevices.includes(device.idDevice)})
                })

                active.sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
                
                setDevices(active);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getConnectedDevices()
            .then((response) => populateDevices(response.data))
    }, []);
    
    useEffect(() => {
        if(connection == null){
            return
        }
        
        connection.on('UpdateConnectedDevices', populateDevices);
    }, [connection]);
    
    const handleDevicePress = (device: DeviceActive) => {
        router.push({
            pathname: '/(auth)/descriptionDevice',
            params: {
                name: device.name,
                os: device.enDeviceOs,
                isActive: device.isActive.toString(),
            },
        })
    }

    return (
        <LayoutAuth title="Seus Dispositivos">
            <ScrollView showsVerticalScrollIndicator={false}>
                {devices.length === 0 ? (
                    <Text style={styles.noDevicesText}>Nenhum dispositivo encontrado.</Text>
                ) : (
                    devices.map((device: DeviceActive) => (
                        <Card
                            key={device.idDevice}
                            title={device.name}
                            icon={getDeviceIcon(device.enDeviceOs)}
                            iconRight={"chevron-right"}
                            onPress={() => handleDevicePress(device)}
                        >
                            <Text style={[styles.statusText, { color: device.isActive ? '#4CAF60' : '#F44336' }]}>
                                {device.isActive ? 'On-line' : 'Off-line'}
                            </Text>
                        </Card>
                    ))
                )}
            </ScrollView>
        </LayoutAuth>
    )
};

const styles = StyleSheet.create({
    noDevicesText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
    },
    statusText: {
        fontSize: 16,
        color: '#888787',
    },
});

export default DevicesScreen;

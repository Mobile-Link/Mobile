import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AccountMenu from "@/src/components/AccountMenu";
import Card from "@/src/components/DefaultCards";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {getUserDevices} from "@/src/api/device.service";
import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";

const DevicesScreen = () => {
    const [devices, setDevices] = useState<DeviceType[]>([]);
    
    useEffect(() => {
        getUserDevices()
            .then((response) => {
                setDevices(response.data);
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
        <View style={styles.container}>
            <AccountMenu/>
            <View style={styles.purpleBackground}/>

            <View style={styles.whiteContainer}>
                <Text style={styles.titulo}>Seus dispositivos</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {devices.length === 0 ? (
                        <Text style={styles.noDevicesText}>Nenhum dispositivo encontrado.</Text>
                    ) : (
                        devices.map((device: DeviceType) => (
                            <Card
                                key={device.idDevice.toString()} 
                                title={device.name}
                                icon={getDeviceIcon(device.enDeviceOs)}
                            />
                        ))
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    purpleBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: '#9465CF',
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 20,
        marginTop: '25%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    centralSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 10,
        width: '100%',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    deviceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    deviceType: {
        fontSize: 14,
        color: '#777',
    },
    deviceStatus: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    deviceIcon: {
        marginVertical: 10,
    },
    noDevicesText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
    },
    icon: {
        position: 'absolute',
        right: 15,
        top: '50%',
        color: '#333',
    },
    positionIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default DevicesScreen;

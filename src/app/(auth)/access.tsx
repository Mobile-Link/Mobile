import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AccountMenu from "@/src/components/AccountMenu";
import Card from "@/src/components/DefaultCards";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {getLastAccess, getUserDevices} from "@/src/api/device.service";
import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";

const AccessScreen = () => {
    const [devices, setDevices] = useState<DeviceType[]>([]);

    useEffect(() => {
        getUserDevices()
            .then((response) => {
                
                response.data.map((device)=> {
                    device.lastAccessDate = new Date (device.lastAccessDate)
                })
                
                setDevices(response.data)
                
                console.log(response.data)
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
                <Text style={styles.title}>Histórico de acessos</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {devices.length === 0 ? (
                        <Text style={styles.noDevicesText}>Nenhum histórico encontrado.</Text>
                    ) : (
                        devices.map((device: DeviceType) => ( device &&
                            <Card key={device.idDevice} title={device.name} icon={getDeviceIcon(device.enDeviceOs)}>
                                <Text style={styles.content}>Último acesso: {device.lastAccessDate.toLocaleString()}</Text> 
                            </Card>
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    titleCard: {
        margin: -5,
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        right: 285,
        bottom: 10,
    },
    noDevicesText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
    },
    content: {
        fontSize: 16,
        color: '#888787',
        textAlign: 'center',
        top: 30,
        right: 310,
    },
});

export default AccessScreen;

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LayoutAuth from "@/src/components/LayoutAuth";
import {getUserDevices} from "@/src/api/device.service";
import {getConnectedDevices} from "@/src/api/connection.service";
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {useSignalR} from "@/src/hooks/signalR";
import CircularProgress from "@/src/components/CircleProgress";
import Legend from "@/src/components/Legend";
import Card from "@/src/components/DefaultCards"; 

type DeviceActive = DeviceType & { isActive: boolean };

const HomeScreen = () => {
    const [devices, setDevices] = useState<DeviceActive[]>([]);
    const {connection} = useSignalR();

    const populateDevices = (connectedDevices: number[]) => {
        getUserDevices()
            .then((response) => {
                let active: DeviceActive[] = [];

                response.data.map((device) => {
                    active.push({
                        ...device,
                        isActive: connectedDevices.includes(device.idDevice),
                    });
                });

                setDevices(active);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getConnectedDevices()
            .then((response) => populateDevices(response.data));
    }, []);

    useEffect(() => {
        if (connection == null) {
            return;
        }

        connection.on("UpdateConnectedDevices", populateDevices);
    }, [connection]);


    const activeCount = devices.filter((device) => device.isActive).length;
    const totalDevices = devices.length;
    const percentageActive = totalDevices > 0 ? (activeCount / totalDevices) * 100 : 0;
    const inativeDevices = totalDevices - activeCount;

    return (
        <LayoutAuth title="Dashboard">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Card>
                    <Text style={styles.deviceCountText}>
                        Dispositivos Ativos
                    </Text>
                    <CircularProgress
                        percentage={percentageActive}
                        radius={80}
                        strokeWidth={25}
                        color="#4eea71"
                        backgroundColor="#e0e0e0"
                        style={{marginBottom: 20, marginTop: 20}}
                    />
                    <Legend
                        text1Label="Ativos:"
                        text2Label="Inativos:"
                        inactiveCount={inativeDevices}
                        activeCount={activeCount}
                        activeColor="#4caf50"
                        inactiveColor="#e0e0e0"
                    /></Card>
            </ScrollView>
        </LayoutAuth>
    );
};

const styles = StyleSheet.create({
    centralSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 20,
        width: '100%',
        marginVertical: 20,
    },
    deviceCountText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
        textAlign: "center"
    },
});

export default HomeScreen;

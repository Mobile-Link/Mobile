import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    ViewStyle,
    StyleProp
} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getUserDevices} from "@/src/api/device.service";
import {getConnectedDevices} from "@/src/api/connection.service";

interface DeviceActive {
    idDevice: number;
    name: string;
    isActive: boolean;
}

interface SelectDeviceProps {
    title?: string;
    iconName?: any;
    iconSize?: number;
    iconColor?: string;
    menuStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    onDeviceSelect?: (device: DeviceActive) => void;
}

const SelectDevice = ({
                          iconName,
                          iconSize,
                          iconColor,
                          menuStyle,
                          containerStyle,
                          onDeviceSelect,
                          title
                      }: SelectDeviceProps) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [devices, setDevices] = useState<DeviceActive[]>([]);

    const populateDevices = (connectedDevices: number[]) => {
        getUserDevices()
            .then((response) => {
                const activeDevices = response.data.map((device) => ({
                    ...device,
                    isActive: connectedDevices.includes(device.idDevice),
                }));
                setDevices(activeDevices);
            })
            .catch((error) => console.error("Erro ao carregar dispositivos:", error));
    };

    const loadDevices = () => {
        getConnectedDevices()
            .then((response) => populateDevices(response.data))
            .catch((error) => console.error("Erro ao carregar dispositivos conectados:", error));
    };

//TODO tirar busca de devices daqui, e passar como prop na tela    
    
    const toggleMenu = () => {
        if (!isMenuVisible) loadDevices();
        setIsMenuVisible(!isMenuVisible);
    };

    const handleDeviceSelect = (device: DeviceActive) => {
        setIsMenuVisible(false);
        if (onDeviceSelect) onDeviceSelect(device);
    };

    return (
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
            <View style={[styles.container, containerStyle]}>
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        toggleMenu();
                    }}
                >
                    <MaterialCommunityIcons
                        name={iconName}
                        size={iconSize}
                        color={iconColor}
                    />
                </TouchableOpacity>

                {isMenuVisible && (
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={[styles.menu, menuStyle]}>
                            <Text style={styles.title}>{title}</Text>
                            <FlatList
                                data={devices}
                                keyExtractor={(item) => item.idDevice.toString()}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        style={styles.menuItemContainer}
                                        onPress={() => handleDeviceSelect(item)}
                                    >
                                        <MaterialCommunityIcons
                                            name={item.isActive ? "circle" : "circle-outline"}
                                            size={20}
                                            color={item.isActive ? "#4caf50" : "#f44336"}
                                        />
                                        <Text style={styles.menuItem}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>
                                        Nenhum dispositivo encontrado.
                                    </Text>
                                }
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
    },
    menu: {
        position: 'absolute',
        alignSelf: "center",
        backgroundColor: '#FFFFFF',
        width: 300,
        maxHeight: 300,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
        zIndex: 10,
    },
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingLeft: 10,
        borderColor: "#8A2BE2",
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 5
    },
    menuItem: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
        borderBottomColor: '#8A2BE2',
        borderBottomWidth: 2,
        width: "60%",
        alignSelf: "center"
    }
});

export default SelectDevice;

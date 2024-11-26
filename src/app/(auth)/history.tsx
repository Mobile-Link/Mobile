import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/src/components/DefaultCards";
import LayoutAuth from "@/src/components/LayoutAuth";
import CustomModal from "@/src/components/CustomModal";
import FilterModal from "@/src/components/FilterModal";
import { EnStatus } from "@/src/models/types/enums/EnStatus";
import {useNavigation} from "@react-navigation/native";
import {getTransfers} from "@/src/api/transfer.service";
import {TransferenceType} from "@/src/models/types/entities/TransferenceType";

const HistoryScreen = () => {
    const [transfers, setTransfers] = useState<TransferenceType[]>([]);
    const [filteredTransfers, setFilteredTransfers] = useState<TransferenceType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<{ label: string; value: any }[]>([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        dateRange: { startDate: "", endDate: "" },
        actions: [] as EnStatus[],
    });
    const navigation = useNavigation();

    useEffect(() => {
        
        
        getTransfers().then((response) => {
            response.data.map((transfers) => {
                transfers.updateDate = new Date(transfers.updateDate);
            });
            
            
            console.log(response.data.length, "ihybgofbgrb")
            setTransfers(response.data);
            setFilteredTransfers(response.data);
        });
        
    }, []);

    const applyFilters = (newFilters: {
        dateRange: { startDate: string; endDate: string };
        actions: EnStatus[];
    }) => {
        let results = transfers;

        if (newFilters.dateRange.startDate && newFilters.dateRange.endDate) {
            results = results.filter((transfer) => {
                const transferDate = new Date(transfer.updateDate);
                const startDate = new Date(newFilters.dateRange.startDate);
                const endDate = new Date(newFilters.dateRange.endDate);
                return transferDate >= startDate && transferDate <= endDate;
            });
        }

        if (newFilters.actions.length > 0) {
            results = results.filter((transfer) =>
                newFilters.actions.includes(transfer.enStatus)
            );
        }

        setFilteredTransfers(results);
        setFilters(newFilters);
    };

    useEffect(() => {
        navigation.addListener("blur", () => {
            setModalVisible(false);
        });

    }, []);

    const handleCardPress = (transfer: TransferenceType) => {
        setSelectedTransfer([
            { label: "Tipo do Arquivo", value: transfer.fileNameExtension },
            { label: "Local", value: transfer.filePath },
            { label: "Tamanho do Arquivo", value: formatFileSize(transfer.size) },
            { label: "Enviado em", value: transfer.updateDate.toLocaleString("pt-BR") },
            { label: "Status", value: EnStatus[transfer.enStatus] },
        ]);
        setModalVisible(true);
    };

    const formatFileSize = (sizeInBytes: number): string => {
        if (sizeInBytes === 0) return "0 MB";
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return `${sizeInMB.toFixed(2)} MB`;
    };

    return (
        <>
            <LayoutAuth title="Histórico de transferências">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredTransfers.length === 0 ? (
                        <Text style={styles.noTransfersText}>Nenhum histórico encontrado.</Text>
                    ) : (
                        filteredTransfers.map((transfer) => {
                            const statusIcon = transfer.enStatus === EnStatus.Finished
                                ? { name: "check", color: "#4CAF50" }
                                : { name: "close", color: "#EB3223" };

                            return (
                                <Card
                                    key={transfer.idTransference}
                                    title={transfer.fileNameExtension}
                                    iconRight={statusIcon.name}
                                    iconColorRight={statusIcon.color}
                                    iconRightStyle={{ top: 50, right: 17 }}
                                    onPress={() => handleCardPress(transfer)}
                                >
                                    <View style={styles.dateFileTranfer}>
                                        <MaterialCommunityIcons
                                            name="calendar"
                                            size={25}
                                            color="#888787"
                                        />
                                        <Text style={styles.dateFileTranferText}>{transfer.updateDate.toLocaleString("pt-BR", {dateStyle: "short"})}</Text>
                                    </View>
                                </Card>
                            );
                        })
                    )}
                </ScrollView>

                <View>
                    <TouchableOpacity
                        style={styles.bottomFilter}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <MaterialCommunityIcons name="filter-outline" size={40} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </LayoutAuth>

            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                filters={filters}
                onApplyFilters={applyFilters}
            />

            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="Detalhes"
                details={selectedTransfer}
            />
        </>
    );
};

const styles = StyleSheet.create({
    noTransfersText: {
        fontSize: 16,
        fontStyle: "italic",
        color: "#888",
    },
    dateFileTranfer: {
        flexDirection: "row",
        gap: 7,
    },
    dateFileTranferText: {
        color: "#888787",
        fontSize: 16,
    },
    bottomFilter: {
        position: "absolute",
        alignSelf: "flex-end",
        backgroundColor: "#9465CF",
        padding: 8,
        borderRadius: 30,
        bottom: 1,
    },
});

export default HistoryScreen;

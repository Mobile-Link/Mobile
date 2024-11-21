import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/src/components/DefaultCards";
import LayoutAuth from "@/src/components/LayoutAuth";
import CustomModal from "@/src/components/CustomModal";
import FilterModal from "@/src/components/FilterModal";
import { EnStatus } from "@/src/models/types/enums/EnStatus";
import {useNavigation} from "@react-navigation/native";

interface MockTransfersProps {
    id: number;
    name: string;
    date: string;
    status: string;
    action: EnStatus;
    percentage?: number;
}

const HistoryScreen = () => {
    const [transfers, setTransfers] = useState<MockTransfersProps[]>([]);
    const [filteredTransfers, setFilteredTransfers] = useState<MockTransfersProps[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<{ label: string; value: string }[]>([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        dateRange: { startDate: "", endDate: "" },
        actions: [] as EnStatus[],
    });
    const navigation = useNavigation();

    useEffect(() => {
        const mockTransfers: MockTransfersProps[] = [
            { id: 1, name: "Nome_do_Arquivo.TXT", date: "19/11/2024", status: "success", action: EnStatus.Finished },
            { id: 2, name: "Nome_do_Arquivo.JPG", date: "18/11/2024", status: "progress", action: EnStatus.In_cloud, percentage: 0 },
            { id: 3, name: "Nome_do_Arquivo.PNG", date: "17/11/2024", status: "error", action: EnStatus.Error },
        ];
        setTransfers(mockTransfers);
        setFilteredTransfers(mockTransfers);

        const interval = setInterval(() => {
            setTransfers((prevTransfers) =>
                prevTransfers.map((transfer) => {
                    if (transfer.status === "progress" && transfer.percentage !== undefined) {
                        const updatedPercentage = transfer.percentage + 1;
                        if (updatedPercentage >= 100) {
                            return { ...transfer, status: "success", percentage: 100 };
                        }
                        return { ...transfer, percentage: updatedPercentage };
                    }
                    return transfer;
                })
            );
        }, 600);

        return () => clearInterval(interval);
    }, []);

    const applyFilters = (newFilters: {
        dateRange: { startDate: string; endDate: string };
        actions: EnStatus[];
    }) => {
        let results = transfers;

        if (newFilters.dateRange.startDate && newFilters.dateRange.endDate) {
            results = results.filter((transfer) => {
                const transferDate = new Date(transfer.date.split("/").reverse().join("-"));
                const startDate = new Date(newFilters.dateRange.startDate);
                const endDate = new Date(newFilters.dateRange.endDate);
                return transferDate >= startDate && transferDate <= endDate;
            });
        }

        if (newFilters.actions.length > 0) {
            results = results.filter((transfer) =>
                newFilters.actions.includes(transfer.action)
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

    const handleCardPress = (transfer: MockTransfersProps) => {
        setSelectedTransfer([
            { label: "Tipo do Arquivo", value: "Arquivo de Texto (.txt)" },
            { label: "Local", value: "C:\\Users\\Nome\\Download" },
            { label: "Tamanho do Arquivo", value: "735 KB (735.000 bytes)" },
            { label: "Enviado em", value: "segunda-feira, 12 de agosto de 2024, 21:26:54" },
            { label: "Acessado em", value: "terça-feira, 6 de agosto de 2024, 14:47:02" },
            { label: "Remetente", value: "Mobile 2" },
            { label: "Status", value: "Transferência realizada" },
        ]);
        setModalVisible(true);
    };

    return (
        <>
            <LayoutAuth title="Histórico de transferências">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredTransfers.length === 0 ? (
                        <Text style={styles.noTransfersText}>Nenhum histórico encontrado.</Text>
                    ) : (
                        filteredTransfers.map((transfer) => {
                            const statusIcon = transfer.status === "success"
                                ? { name: "check", color: "#4CAF50" }
                                : { name: "close", color: "#EB3223" };

                            return (
                                <Card
                                    key={transfer.id}
                                    title={transfer.name}
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
                                        <Text style={styles.dateFileTranferText}>{transfer.date}</Text>
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

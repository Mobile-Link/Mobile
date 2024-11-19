import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/src/components/DefaultCards";
import LayoutAuth from "@/src/components/LayoutAuth";
import CircularProgress from "@/src/components/CircleProgress";
import CustomModal from "@/src/components/CustomModal";

interface MockTransfersProps {
    id: number;
    name: string;
    date: string;
    status: string;
    percentage?: number;
}

const HistoryScreen = () => {
    const [transfers, setTransfers] = useState<MockTransfersProps[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<{ label: string; value: string }[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const mockTransfers: MockTransfersProps[] = [
            { id: 1, name: "Nome_do_Arquivo.TXT", date: "19/11/2024", status: "success" },
            { id: 2, name: "Nome_do_Arquivo.JPG", date: "19/11/2024", status: "progress", percentage: 0 },
            { id: 3, name: "Nome_do_Arquivo.PNG", date: "19/11/2024", status: "error" },
        ];
        setTransfers(mockTransfers);

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

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            setModalVisible(false); // Fecha o modal automaticamente ao trocar de tela
        });

        return unsubscribe;
    }, [navigation]);

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
                return { name: "check", color: "#4CAF50" };
            case "progress":
                return { color: "#FFC107" };
            case "error":
                return { name: "close", color: "#EB3223" };
            default:
                return { name: "help-circle", color: "#888787" };
        }
    };

    return (
        <>
            <LayoutAuth title="Histórico de transferências">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {transfers.length === 0 ? (
                        <Text style={styles.noTransfersText}>Nenhum histórico encontrado.</Text>
                    ) : (
                        transfers.map((transfer) => {
                            const statusIcon = getStatusIcon(transfer.status);

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
                                    {transfer.status === "progress" && transfer.percentage !== undefined && (
                                        <CircularProgress
                                            percentage={transfer.percentage}
                                            radius={18}
                                            strokeWidth={4}
                                            centerText={`${transfer.percentage}%`}
                                            textStyle={{ fontSize: 12, right: 6, color: "#9465CF" }}
                                            color="#9465CF"
                                            style={{ alignItems: "flex-end", height: 1, bottom: 10 }}
                                        />
                                    )}
                                </Card>
                            );
                        })
                    )}
                </ScrollView>
            </LayoutAuth>

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
});

export default HistoryScreen;

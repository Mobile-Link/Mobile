import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DatePickerModal } from "react-native-paper-dates";
import { EnStatus } from "@/src/models/types/enums/EnStatus";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    filters: {
        dateRange: { startDate: string; endDate: string };
        actions: EnStatus[];
    };
    onApplyFilters: (filters: {
        dateRange: { startDate: string; endDate: string };
        actions: EnStatus[];
    }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, filters, onApplyFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const actionOptions = Object.values(EnStatus)
        .filter((value) => typeof value === "number")
        .map((value) => ({
            label: EnStatus[value as EnStatus],
            value: value.toString(),
        }));

    const handleDateConfirm = ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
        if (startDate && endDate) {
            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];
            setLocalFilters((prev) => ({
                ...prev,
                dateRange: { startDate: formattedStartDate, endDate: formattedEndDate },
            }));
        }
    };

    const applyFilters = () => {
        const selectedActions = localFilters.actions.map((action) => parseInt(action as unknown as string, 10));
        onApplyFilters({ ...localFilters, actions: selectedActions });
        onClose();
    };

    const clearFilters = () => {
        const initialFilters = { dateRange: { startDate: "", endDate: "" }, actions: [] };
        setLocalFilters(initialFilters);
        onApplyFilters(initialFilters);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.closeButtonContainer}>
                        <Button onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} />
                        </Button>
                    </View>

                    <Text style={styles.modalTitle}>Filtrar Histórico</Text>

                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => {
                            setShowDropdown(false);
                            setShowDatePicker(true);
                        }}
                    >
                        <Text>Selecionar intervalo de datas</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownContainer}>
                        <Text style={styles.sectionTitle}>Ações</Text>

                        <TouchableOpacity
                            onPress={() => {
                                setShowDatePicker(false);
                                setShowDropdown(!showDropdown);
                            }}
                            style={styles.dropdownButton}
                        >
                            <Text>
                                {localFilters.actions[0]
                                    ? actionOptions.find(opt => opt.value === localFilters.actions[0]?.toString())?.label
                                    : "Selecione uma ação"}
                            </Text>
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={styles.dropdownMenu}>
                                {actionOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => {
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                actions: [parseInt(option.value, 10)],
                                            }));
                                            setShowDropdown(false);
                                        }}
                                        style={styles.dropdownItem}
                                    >
                                        <Text>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.buttonRow}>
                        <Button mode="outlined" onPress={clearFilters} style={{ marginRight: 8 }}>
                            Limpar
                        </Button>
                        <Button mode="contained" onPress={applyFilters}>
                            Aplicar
                        </Button>
                    </View>
                </View>
            </View>

            {showDatePicker && (
                <DatePickerModal
                    locale="pt"
                    mode="range"
                    visible={showDatePicker}
                    onDismiss={() => setShowDatePicker(false)}
                    onConfirm={handleDateConfirm}
                />
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        margin: 20,
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    closeButtonContainer: {
        alignSelf: "flex-end",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    dateButton: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    dropdownContainer: {
        width: "100%",
        marginBottom: 20,
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        width: "100%",
        marginBottom: 10,
    },
    dropdownMenu: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingVertical: 5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
});

export default FilterModal;

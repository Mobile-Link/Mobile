import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AccountMenu from "@/src/components/AccountMenu";
import Card from "@/src/components/DefaultCards";
import LayoutAuth from "@/src/components/LayoutAuth";

const HistoryScreen = () => {
    return (
        <LayoutAuth title="Histórico de transferências">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Card></Card>
            </ScrollView>
        </LayoutAuth>
    );
};

const styles = StyleSheet.create({
    
});

export default HistoryScreen;

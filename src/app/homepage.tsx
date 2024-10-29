import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import  * as FileSystem from 'expo-file-system';
import {useSecureStore} from "@/src/providers/SecureStoreProvider";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

axios.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token")
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

interface Perfil {
  username: string;
  email: string;
}

interface Dispositivo {
  nome: string;
  descricao: string;
}

const handleDevicePress = (carregarDispositivos: Dispositivo) => {
    DocumentPicker.getDocumentAsync()
}
  
interface DeviceFilesProps {
    route: {
        params: {
            deviceId: number;
        };
    };
}
  
const DeviceFiles = ({ route }: DeviceFilesProps) => {
    const deviceId = route.params.deviceId;
};

const Homepage = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);

  useEffect(() => {
    const carregarPerfil = async () => {
      const perfil = {
        nome: 'João Doe',
        email: 'joao.doe@example.com',
      };
    };

    const carregarDispositivos = async () => {
      const dispositivos = [
        {
          nome: 'Dispositivo 1',
          descricao: 'Descrição do dispositivo 1',
        }
      ];
      setDispositivos(dispositivos);
    };

    carregarPerfil();
    carregarDispositivos();
  }, []);
   
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/foto-do-usuario.jpg' }}
          style={styles.fotoperfil}
        />
        <Text style={styles.nomeperfil}>{}</Text>
      </View>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Dispositivos Conectados</Text>
        <FlatList
          data={dispositivos}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>handleDevicePress(item)} style={styles.dispositivo}>
              <Text style={styles.nomedispositivo}>{item.nome}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => String(item)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    height: 100,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoperfil: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nomeperfil: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  emailperfil: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  conteudo: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  perfil: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dispositivo: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  nomedispositivo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})

export default Homepage;

import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const axiosDefault = axios.create ({
    baseURL: 'http://localhost:5000',
}) 

axiosDefault.interceptors.request.use(async (config) => {
    
    const token = await SecureStore.getItemAsync("token")
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosDefault;
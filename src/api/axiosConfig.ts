import axiosDefault from "axios";
import * as SecureStore from 'expo-secure-store';

axiosDefault.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("token")
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosDefault;